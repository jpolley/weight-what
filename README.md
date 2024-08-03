# Weight, what?! ![workflow](https://github.com/jpolley/weight-what/actions/workflows/playwright.yml/badge.svg)

This project uses Typescript and Playwright to weigh gold bars and locate the fake: http://sdetchallenge.fetch.com/ 

## Dev Setup

1\. Clone this repo & `cd` into root directory

2\. Ensure [nvm](https://github.com/nvm-sh/nvm) is installed, and the correct version of nodejs used

```bash
nvm install # check .nvmrc to see the required version of node
nvm use
```

3\. Get the correct nodejs things

```bash
rm -r node_modules
nvm use
npm install
npx playwright install
```

6\. Run the tests & view report

```bash
npx playwright test
npx playwright show-report
```

7\. If you have [Docker](https://docs.docker.com/engine/install/) installed then you can run tests using this command

```bash
docker compose up
```
