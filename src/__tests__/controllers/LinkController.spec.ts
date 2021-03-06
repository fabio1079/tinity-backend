import connection from "../../config/connection";
import { request } from "../helpers";

import LinkService from "../../services/LinkService";

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
});
