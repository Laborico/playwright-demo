# playwright-demo

End-to-end UI and API test automation built with [Playwright](https://playwright.dev/) and TypeScript.

| Layer | Application under test |
|---|---|
| UI | [Sauce Demo](https://www.saucedemo.com), a sample e-commerce store |
| API | [Restful-booker](https://restful-booker.herokuapp.com), a sample hotel booking REST API |

The suite has 17 tests plus 1 authentication setup step: 7 UI tests and 10 API tests.

---

## Contents

- [Quick start](#quick-start)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the tests](#running-the-tests)
- [Automated scenarios](#automated-scenarios)
- [Framework structure](#framework-structure)
- [Implementation](#implementation)

---

## Quick start

```bash
git clone https://github.com/Laborico/playwright-demo.git
cd playwright-demo
npm ci
npx playwright install --with-deps chromium
cp .env_sample .env
npx playwright test
```

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20 or later | 

### Dependencies

These are installed by `npm ci` from `package.json`:

| Package | Purpose |
|---|---|
| `@playwright/test` (^1.63) | Test runner, browser automation and HTTP client |
| `@types/node` | Type definitions for `process.env` and `path` |
| `dotenv` | Loads `.env` into `process.env` when the config starts |

Playwright also needs a browser binary, which is installed in a separate step below. The projects don't set a device, so tests run on Playwright's default browser, Chromium.

---

## Setup

### 1. Install the dependencies

```bash
npm ci
```

### 2. Install the browser

```bash
npx playwright install --with-deps chromium
```

`--with-deps` also installs the operating system libraries Chromium needs, which matters on Linux and in CI. Leave out `chromium` to install every browser.

### 3. Create the `.env` file

```bash
cp .env_sample .env
```

The config reads its URLs and credentials from `.env`, which is git-ignored. `.env_sample` already contains working values, because both applications publish their demo credentials:

| Variable | Used by | Value in sample |
|---|---|---|
| `UI_BASE_URL` | UI projects | `https://www.saucedemo.com` |
| `UI_STANDARD_USER` | Auth setup and login test | `standard_user` |
| `UI_LOCKEDOUT_USER` | Negative login test | `locked_out_user` |
| `UI_PASSWORD` | Every UI login | `secret_sauce` |
| `API_BASE_URL` | API project | `https://restful-booker.herokuapp.com` |
| `API_USERNAME` | API auth | `admin` |
| `API_PASSWORD` | API auth | `password123` |

The variables are typed in `env.d.ts`, so `process.env.UI_PASSWORD` is a `string` in the tests and a typo in a variable name fails to compile.

---

## Running the tests

| Goal | Command |
|---|---|
| Run everything | `npx playwright test` |
| UI tests only | `npx playwright test --project=ui` |
| API tests only | `npx playwright test --project=api` |
| One spec file | `npx playwright test tests/ui/checkout.spec.ts` |
| By tag | `npx playwright test --grep @checkout` |
| Combine tags | `npx playwright test --grep "@booking.*@delete"` |
| Watch the browser | `npx playwright test --project=ui --headed` |
| Interactive UI mode | `npx playwright test --ui` |
| Open the last HTML report | `npx playwright show-report` |


### Tags

| Tag | Applies to |
|---|---|
| `@login` | UI login tests **and** API auth tests. Add `--project` to run only one of them |
| `@inventory` | UI inventory tests |
| `@sorting` | UI product sorting test |
| `@cart` | UI cart test |
| `@checkout` | UI checkout test |
| `@booking` | All API booking tests |
| `@create`, `@read`, `@update`, `@delete` | API booking tests for each CRUD operation |

### Reports and debugging output

The HTML reporter writes to `playwright-report/`. Run `npx playwright show-report` to open it.

| Artifact | When it is kept |
|---|---|
| Screenshot | Only when a test fails |
| Video | Only when a test fails |
| Trace | On the first retry. Retries are enabled only in CI, where `CI` is set |

In CI (`CI` set), the run also uses 2 retries and a single worker, and fails if a `test.only` was left in the code.

---

## Automated scenarios

### UI: Sauce Demo

These tests cover the purchase journey in the order a shopper experiences it: log in, browse, manage the cart and check out. 

| Spec | Test | Validates |
|---|---|---|
| `login.spec.ts` | Login as valid user | A standard user lands on `/inventory.html` and is able to access the app. |
| `login.spec.ts` | Login as invalid user | A **locked-out** user sees the "this user has been locked out" error |
| `inventory.spec.ts` | User can add items to cart | The user is able to add items to the cart (needed for checkout).
| `inventory.spec.ts` | User can remove items from cart | The user is able to remove items from the cart. |
| `inventory.spec.ts` | User can sort products: Name | User is able to sort products on the inventory/listing page |
| `cart.spec.ts` | User can view, open and remove an item in the cart | Functionality within the cart page, as well as validating user is able to navigate to the product view page |
| `checkout.spec.ts` | User can complete a checkout | User is able to do a complete flow, adds item, fills the info form and completes the checkout. |

### API: Restful-booker

The API tests cover authentication and every CRUD operation on `/booking`. 

| Spec | Group | Test | Expected result |
|---|---|---|---|
| `login.spec.ts` | Login | Auth returns a token | `200` and a token string |
| `login.spec.ts` | Login | Auth with bad credentials returns a reason | `200` with `{ "reason": "Bad credentials" }` |
| `booking.spec.ts` | Get booking ids | Returns a list of booking ids | `200` and an array of `{ bookingid }` |
| `booking.spec.ts` | Get booking ids | Returns an empty list when no booking matches the filter | `200` and `[]` |
| `booking.spec.ts` | Create booking | Booking can be created | `200`, a new id and the booking echoed back |
| `booking.spec.ts` | Create booking | Created booking can be retrieved by id | `GET` returns the same booking, which proves it was saved and not only echoed |
| `booking.spec.ts` | Update booking | Booking can be updated (`PUT`) | `200` and the fully replaced booking |
| `booking.spec.ts` | Update booking | Booking can be partially updated (`PATCH`) | `200`, with only the patched field changed |
| `booking.spec.ts` | Delete booking | Returns 403 without a token | `403` |
| `booking.spec.ts` | Delete booking | Deletes an existing booking | `201`, and a follow-up `GET` returns `404` |

---

## Framework structure

```
playwright-demo/
├── playwright.config.ts        # projects, base URLs, headers, reporters
├── env.d.ts                    # types for the .env variables
├── .env_sample                 # template for .env
│
├── pages/                      # UI page objects
│   ├── BasePage.ts             # shared navigation and waiting
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts         # all three checkout steps
│   └── components/             # UI pieces shared between pages
│       ├── HeaderComponent.ts  # cart link and badge
│       └── ItemListComponent.ts# product rows: names, open, remove
│
├── api/                        # API layer
│   ├── clients/
│   │   ├── AuthClient.ts       # POST /auth
│   │   └── BookingClient.ts    # /booking CRUD
│   ├── factories/
│   │   └── booking.factory.ts  # builds valid booking payloads
│   └── types.ts                # Booking, CreatedBooking, BookingFilters
│
├── fixtures/
│   ├── ui.fixture.ts           # page objects, logged-in page, UI tags
│   └── api.fixture.ts          # token, clients, booking, API tags
│
└── tests/
    ├── ui.auth.setup.ts        # logs in once and saves the session
    ├── ui/                     # login, inventory, cart, checkout specs
    └── api/                    # login and booking specs
```

### Playwright projects

| Project | Runs | Depends on | Base URL |
|---|---|---|---|
| `ui-setup` | `tests/ui.auth.setup.ts` | — | `UI_BASE_URL` |
| `ui` | `tests/ui/**/*.spec.ts` | `ui-setup` | `UI_BASE_URL` |
| `api` | `tests/api/**/*.spec.ts` | — | `API_BASE_URL` |

---

## Implementation

### UI layer

**Page Object Model.** Each page is a class that extends `BasePage`, which holds the Playwright `page` and the shared `navigate()` and `waitForPageLoad()` helpers. Page objects hold locators and user actions. Assertions stay in the specs, so a page object never decides whether a test passes.

**Components for shared UI.** The header and the product list appear on several pages, so they are classes that pages hold as properties rather than inherit from a parent class:

- `HeaderComponent` is used by the inventory, cart and checkout pages.
- `ItemListComponent` is used by the same three pages.

**Locators.** Locators use `getByRole` wherever an element has an accessible role and name, for example form fields and buttons. That matches how users find elements and survives styling changes. `data-test` attributes are used for elements that have it, for example the cart badge and the payment and shipping values.

**Log in once.** `tests/ui.auth.setup.ts` logs in through UI and saves the browser session to `playwright/.auth/ui-user.json`. The `loggedInPage` fixture opens a fresh browser context from that saved session, so tests start already logged in without repeating the login. Only `login.spec.ts` uses a clean `page`.

**Fixtures.** `ui.fixture.ts` gives each test ready-made page objects: `loginPage`, `inventoryPage`, `cartPage` and `checkoutPage`. Every page object in a test shares the same `loggedInPage`, so a test can move from the inventory page to the cart page and on to checkout in one browser session.

### API layer

**Shared headers in the config.** `Accept` and `Content-Type: application/json` are set once in the `api` project's `extraHTTPHeaders`. Restful-booker returns `418` for `POST /booking` without the `Accept` header.

**Clients.** `AuthClient` and `BookingClient` wrap Playwright's `request` and give each endpoint a named method, example, `create()`, `update()` and `delete()`.

- Methods return the raw `APIResponse`, so tests assert on both the status code and the body.
- `BookingClient` attaches the auth cookie to `PUT`, `PATCH` and `DELETE` requests. The token is optional in its constructor, which lets negative tests build a client without one and check for a `403`.

**Factory.** `buildBooking(overrides?)` returns a valid booking payload, and a test overrides only the fields it cares about, for example `buildBooking({ firstname: "James" })`. The override is a shallow merge, so a nested `bookingdates` override must include both dates.

**Fixtures** (`api.fixture.ts`):

| Fixture | Scope | Provides |
|---|---|---|
| `authToken` | Worker | Calls `/auth` once per worker and shares the token with every test in it. It throws a clear error if login fails |
| `authClient` | Test | An `AuthClient` |
| `bookingClient` | Test | A `BookingClient` that already holds the token |
| `bookingCleanup` | Test | Collects the ids of bookings a test creates through `track(id)`, and deletes them all after the test, even if the test failed |
| `booking` | Test | Creates a booking before the test, tracks it for cleanup and gives it `{ id, data }` |

`authToken` is scoped to the worker because a token is cheap to reuse and doesn't need a file on disk. It uses its own request context, because Playwright's built-in `request` fixture only exists per test.

**Types.** `api/types.ts` defines `Booking`, `CreatedBooking` and `BookingFilters`, so client methods and the factory reject malformed payloads at compile time.

---

## Known quirks of the applications

Some of the API assertions look unusual. They are correct for restful-booker:

| Behaviour | Restful-booker returns |
|---|---|
| Login with bad credentials | `200` with `{ "reason": "Bad credentials" }`, not `401` |
| Successful `DELETE` | `201`, not `200` or `204` |
| Update or delete without a valid token | `403` |
| Delete of a booking that doesn't exist | `405`, so the `bookingCleanup` fixture ignores the status of its cleanup deletes |
| `POST /booking` without `Accept: application/json` | `418` |

--- 

**Notes**

- This is just a quick demo, there are a lot of test cases missing (validating user cannot checkout on empty cart, validating the item view page, validating the .pdf receipt, validating filtering on the booking endpoint, validating creating booking with XML files, etc.)