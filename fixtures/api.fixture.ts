import { test as base } from "@playwright/test";
import { AuthClient } from "@api/clients/AuthClient";
import { BookingClient } from "@api/clients/BookingClient";

type TestFixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
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
});

export { expect } from "@playwright/test";

export const Tags = {
  login: "@login",
  booking: "@booking",
};
