# Playwright TypeScript Demo Framework

Playwright automation demo for `https://opensource-demo.orangehrmlive.com/` built to showcase three things clearly:

- Page Object Model for maintainable UI automation
- Cucumber for business-readable scenarios
- Allure for stakeholder-friendly reporting
- Parallel execution for faster feedback
- Cross-browser coverage with Chromium, Firefox, and WebKit

## What To Show In The Demo

### 1. POM

Tests stay small and readable because selectors and page behavior live in `src/pages/`.

- `src/pages/login-page.ts`
- `src/pages/dashboard-page.ts`
- `src/pages/employee-page.ts`
- `tests/e2e/login.spec.ts`
- `tests/e2e/employee.spec.ts`

### 2. Cucumber

Business flow is written in `.feature` files, while technical implementation stays in step definitions and hooks.

- `bdd/features/login.feature`
- `bdd/features/employee.feature`
- `bdd/steps/login.steps.ts`
- `bdd/support/world.ts`
- `bdd/support/hooks.ts`

### 3. Allure

Both Playwright and Cucumber write into the same `reports/allure-results` directory, so you can generate one consolidated Allure report after both suites run.

## Project Layout

```text
src/
|-- config/            # environment and report paths
|-- fixtures/          # shared Playwright fixtures
|-- pages/             # page objects
|-- utils/             # test data, logging, artifact helpers
`-- visual/            # visual comparison helpers

tests/
|-- e2e/               # Playwright POM scenarios
`-- visual/            # visual regression examples

bdd/
|-- features/          # business-readable scenarios
|-- steps/             # step definitions
`-- support/           # Cucumber hooks and custom world
```

## Setup

```bash
npm install
npx playwright install
copy .env.example .env
```

## Demo Commands

All local runs are headed by default.

```bash
npm run test:pom
npm run test:pom:cross-browser
npm run test:cucumber
npm run demo:showcase
npm run report:playwright
npm run report:allure:open
```

Command summary:

- `npm run test:pom`
  Runs only the Playwright POM tests in Chromium using Playwright's parallel execution.
- `npm run test:pom:cross-browser`
  Runs the Playwright POM suite across Chromium, Firefox, and WebKit.
- `npm run test:cucumber`
  Runs the Cucumber scenarios in headed mode.
- `npm run demo:showcase`
  Cleans old artifacts, runs POM tests, runs Cucumber, then generates the Allure report.
- `npm run report:playwright`
  Opens the Playwright HTML report.
- `npm run report:allure:open`
  Opens the generated Allure report.

## How To Explain The Framework

### POM

Use this line:

`The tests describe intent, and the page objects own selectors plus page behavior. That keeps the tests readable and the UI details centralized.`

Concrete example:

- `tests/e2e/login.spec.ts` says what the user does.
- `src/pages/login-page.ts` knows how the page is located and operated.

### Cucumber

Use this line:

`The feature file is written in business language, and the step definitions connect that language to the same page objects used by Playwright tests.`

Concrete example:

- `bdd/features/login.feature` is readable by non-technical stakeholders.
- `bdd/steps/login.steps.ts` calls `loginPage` and `dashboardPage`.

### Allure

Use this line:

`Allure gives me one presentation-friendly report that combines execution results, attachments, and failure evidence from both Playwright and Cucumber runs.`

Concrete example:

- Playwright reporter writes to `reports/allure-results`
- Cucumber reporter writes to the same directory
- `npm run report:allure` builds the final report

## Headed Execution

The framework is configured for local demo clarity:

- Playwright runs headed from `playwright.config.ts`
- Playwright keeps parallel execution enabled
- Playwright keeps cross-browser projects for Chromium, Firefox, and WebKit
- Cucumber defaults to headed mode unless `BDD_HEADED=false` is set explicitly
