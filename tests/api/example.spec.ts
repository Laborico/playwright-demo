import { test, expect } from "@playwright/test";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

test.describe("Restful-booker example", () => {
  test("Auth returns a token", async ({ request }) => {
    const response = await request.post("/auth", {
      headers,
      data: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toEqual(expect.any(String));
  });

  test("Get booking ids", async ({ request }) => {
    const response = await request.get("/booking", { headers });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toEqual({ bookingid: expect.any(Number) });
  });
});
