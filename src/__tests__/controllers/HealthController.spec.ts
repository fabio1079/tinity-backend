import connection from "../../config/connection";
import { request } from "../helpers";

describe("HealthController", () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  test("it is alive on GET /health", async () => {
    const response = await request.get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("alive");
  });
});
