import { test, expect, Tags } from "@fixtures/api.fixture";

test.describe("Login test cases", { tag: Tags.login }, () => {
  test("Auth returns a token", async ({ request }) => {
    const response = await request.post("/auth", {
      data: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toEqual(expect.any(String));
  });

  test("Auth with bad credentials returns a reason", async ({ request }) => {
    const response = await request.post("/auth", {
      data: {
        username: process.env.API_USERNAME,
        password: "wrong-password",
      },
    });

    // restful-booker answers bad credentials with 200, not 401
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ reason: "Bad credentials" });
  });
});
