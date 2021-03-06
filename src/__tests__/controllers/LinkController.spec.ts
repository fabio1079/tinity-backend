import connection from "../../config/connection";
import { request } from "../helpers";

import { Link } from "../../entity/Link";
import LinkService from "../../services/LinkService";

const storeLink = async (url: string): Promise<Link> => {
  let [link, error] = LinkService.buildLink(url);

  if (error) throw new Error(error);

  let ls = new LinkService();

  return await ls.store(link);
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
});
