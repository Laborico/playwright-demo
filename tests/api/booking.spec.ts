import { test, expect, Tags } from "@fixtures/api.fixture";
import { BookingClient } from "@api/clients/BookingClient";
import { buildBooking } from "@api/factories/booking.factory";

// an id far above anything the shared server holds
const UNKNOWN_BOOKING_ID = 999999999;

test.describe("Booking test cases", { tag: Tags.booking }, () => {
  test.describe("Get booking ids", { tag: Tags.crud.read }, () => {
    test("Returns a list of booking ids", async ({ bookingClient }) => {
      const response = await bookingClient.getIds();

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body[0]).toEqual({ bookingid: expect.any(Number) });
    });

    test("Returns an empty list when no booking matches the filter", async ({
      bookingClient,
    }) => {
      const response = await bookingClient.getIds({
        firstname: `no-match-${Date.now()}`,
      });

      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual([]);
    });
  });

  test.describe("Create booking", { tag: Tags.crud.create }, () => {
    test("Booking can be created", async ({
      bookingClient,
      bookingCleanup,
    }) => {
      const booking = buildBooking();

      const response = await bookingClient.create(booking);

      expect(response.status()).toBe(200);

      const body = await response.json();
      bookingCleanup.track(body.bookingid);
      expect(body.bookingid).toEqual(expect.any(Number));
      expect(body.booking).toEqual(booking);
    });

    test("Created booking can be retrieved by id", async ({
      bookingClient,
      bookingCleanup,
    }) => {
      const booking = buildBooking({ firstname: "James", totalprice: 250 });

      const createResponse = await bookingClient.create(booking);
      const { bookingid } = await createResponse.json();
      bookingCleanup.track(bookingid);

      const getResponse = await bookingClient.get(bookingid);

      expect(getResponse.status()).toBe(200);
      expect(await getResponse.json()).toEqual(booking);
    });
  });

  test.describe("Update booking", { tag: Tags.crud.update }, () => {
    test("Booking can be updated", async ({ bookingClient, booking }) => {
      const updatedBooking = buildBooking({
        firstname: "James",
        totalprice: 222,
      });

      const response = await bookingClient.update(booking.id, updatedBooking);

      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual(updatedBooking);
    });

    test("Booking can be partially updated", async ({
      bookingClient,
      booking,
    }) => {
      const response = await bookingClient.partialUpdate(booking.id, {
        firstname: "James",
      });

      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({
        ...booking.data,
        firstname: "James",
      });
    });
  });

  test.describe("Delete booking", { tag: Tags.crud.delete }, () => {
    test("Returns 403 without a token", async ({ request }) => {
      const unauthenticatedClient = new BookingClient(request);

      const response = await unauthenticatedClient.delete(UNKNOWN_BOOKING_ID);

      expect(response.status()).toBe(403);
    });

    test("Deletes an existing booking", async ({ bookingClient, booking }) => {
      const response = await bookingClient.delete(booking.id);

      // restful-booker returns 201 on delete
      expect(response.status()).toBe(201);

      const getResponse = await bookingClient.get(booking.id);
      expect(getResponse.status()).toBe(404);
    });
  });
});
