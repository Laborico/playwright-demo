import { test, expect, Tags } from "@fixtures/api.fixture";

test.describe("Booking test cases", { tag: Tags.booking }, () => {
  test.describe("Get booking ids", () => {
    test("Returns a list of booking ids", async ({ request }) => {
      const response = await request.get("/booking");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body[0]).toEqual({ bookingid: expect.any(Number) });
    });
  });
});
