import { test as base } from "@playwright/test";

type WorkerFixtures = {
  authToken: string;
};

export const test = base.extend<{}, WorkerFixtures>({
  authToken: [
    async ({ playwright }, use, workerInfo) => {
      // ---- setup ----
      // the built-in `request` fixture is test-scoped, so a worker fixture
      // needs its own request context
      const context = await playwright.request.newContext({
        baseURL: workerInfo.project.use.baseURL,
        extraHTTPHeaders: workerInfo.project.use.extraHTTPHeaders,
      });

      const response = await context.post("/auth", {
        data: {
          username: process.env.API_USERNAME,
          password: process.env.API_PASSWORD,
        },
      });
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
});

export { expect } from "@playwright/test";

export const Tags = {
  login: "@login",
  booking: "@booking",
};
