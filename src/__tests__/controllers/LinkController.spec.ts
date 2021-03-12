import connection from "../../config/connection";
import { request } from "../helpers";

import { Link } from "../../entity/Link";
import LinkService from "../../services/LinkService";

import {
  INVALID_SHORTED,
  INVALID_URL,
  LINK_NOT_FOUND,
} from "../../error/messages";

const storeLink = async (url: string): Promise<Link> => {
  let result = LinkService.buildLink(url);

  if (result.isFailure) throw new Error(result.error as string);

  let ls = new LinkService();

  return await ls.store(result.value);
};

describe("LinkController", () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  test("generate link on POST /short-url", async () => {
    const original = "https://www.bing.com";
    let response = await request.post("/short-url").send({ original });

    expect(response.status).toBe(201);

    const { link, error } = response.body;

    expect(error).toBe(undefined);
    expect(link).not.toBe(undefined);
    expect(link.original).toBe(LinkService.stripUrl(original));
    expect(link.protocol).toBe("https");
    expect(link.shorted).toHaveLength(6);
  });

  test("wont re-generate a link from a url already generated", async () => {
    const original = "http://www.testing.com.br";
    let storedLink = await storeLink(original);

    let response = await request.post("/short-url").send({ original });

    expect(response.status).toBe(200);
    const { link, error } = response.body;

    expect(error).toBe(undefined);
    expect(link.id).toBe(storedLink.id);
    expect(link.shorted).toBe(storedLink.shorted);
  });

  test("wont generate a link from an invalid url", async () => {
    const invalidUrls = [
      "www.foufos-.gr",
      "www.-foufos.gr",
      "foufos.gr",
      "http://foufos",
      "www.mp3#.com",
    ];

    for (let url of invalidUrls) {
      let response = await request.post("/short-url").send({ original: url });
      const { link, error } = response.body;

      expect(response.status).toBe(400);
      expect(link).toBe(undefined);
      expect(error).not.toBe(undefined);
      expect(error).toBe(INVALID_URL);
    }
  });

  test("will add www if given url dont have it after protocol", async () => {
    const original = "https://someurl.com";

    let response = await request.post("/short-url").send({ original });
    const { link, error } = response.body;

    expect(response.status).toBe(201);
    expect(error).toBe(undefined);
    expect(link.original).toBe("www.someurl.com");
  });

  test("Will redirect user on GET /:shorted", async () => {
    const original = "http://www.testing.com.br";
    const link = await storeLink(original);

    const response = await request.get(`/${link.shorted}`);

    expect(response.status).toBe(302);
    expect(response.redirect).toBe(true);

    expect(response.headers["location"]).toBe(LinkService.redirectionUrl(link));
  });

  test("will increase accessed on redirection", async () => {
    const original = "http://www.testing.com.br";
    const ls = new LinkService();
    let link = await storeLink(original);

    const oldAccessed = link.accessed;

    const response = await request.get(`/${link.shorted}`);

    link = await ls.findShorted(link.shorted);

    expect(response.status).toBe(302);
    expect(link.accessed).toBe(oldAccessed + 1);
  });

  test("wont redirect if link is not found", async () => {
    const response = await request.get(`/aaaaaa`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(LINK_NOT_FOUND);
  });

  test("wont allow infalid shorted links", async () => {
    const response = await request.get(`/1234567`); // len 7

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(INVALID_SHORTED);
  });

  test("get top 5 most accessed links on GET /top", async () => {
    const ls = new LinkService();
    const urls = [];
    for (let i = 0; i < 6; ++i) {
      urls.push(`http://www.abcde${i}.com`);
    }

    let accessed = 0;
    await Promise.all(
      urls.map(async (url) => {
        let l = await storeLink(url);
        l.accessed = accessed++;
        return await ls.store(l);
      })
    );

    const response = await request.get(`/top`);
    expect(response.status).toBe(200);

    const links = response.body.links as Link[];

    expect(links).toHaveLength(5);
    expect(links[0].accessed).toBe(5);
    expect(links[4].accessed).toBe(1);
  });
});
