import { test as UITest } from "./ui.auth.fixture"
import { mergeTests } from '@playwright/test';

export const test = mergeTests(UITest);
export { expect } from '@playwright/test';