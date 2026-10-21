import { test as base } from "@playwright/test";
import { AuthClient } from "@api/clients/AuthClient";
import { BookingClient } from "@api/clients/BookingClient";
import { buildBooking } from "@api/factories/booking.factory";
import { CreatedBooking } from "@api/types";

type TestFixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
  booking: CreatedBooking;
};

type WorkerFixtures = {
  authToken: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  authToken: [
    async ({ playwright }, use, workerInfo) => {
      // ---- setup ----
      // the built-in `request` fixture is test-scoped, so a worker fixture
      // needs its own request context
      const context = await playwright.request.newContext({
        baseURL: workerInfo.project.use.baseURL,
        extraHTTPHeaders: workerInfo.project.use.extraHTTPHeaders,
      });

      const response = await new AuthClient(context).login(
        process.env.API_USERNAME,
        process.env.API_PASSWORD,
      );
      const { token } = await response.json();

      if (!token) {
        throw new Error(`Auth failed: ${await response.text()}`);
      }

      // hand the value to every test in this worker
      await use(token);

      // cleanup
      await context.dispose();
    },
    { scope: "worker" },
  ],
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  bookingClient: async ({ request, authToken }, use) => {
    await use(new BookingClient(request, authToken));
  },
  booking: async ({ bookingClient }, use) => {
    // ---- setup ----
    const data = buildBooking();
    const response = await bookingClient.create(data);

    if (!response.ok()) {
      throw new Error(`Booking setup failed: ${await response.text()}`);
    }

    const { bookingid } = await response.json();

    // hand the created booking to the test
    await use({ id: bookingid, data });

    // cleanup, the test may have deleted it already so the status is ignored
    await bookingClient.delete(bookingid);
  },
});

export { expect } from "@playwright/test";

export const Tags = {
  login: "@login",
  booking: "@booking",
  crud: {
    create: "@create",
    read: "@read",
    update: "@update",
    delete: "@delete",
  },
};
