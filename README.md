# Apify UI/UX Best Practices Showcase Actor

This repository is not meant to be a polished production scraper. It is a showcase Actor built to accompany the article in [article.md](./article.md) and demonstrate how I design Apify Actor input schemas to improve clarity, reduce user confusion, and increase conversion from page visit to actual run.

The codebase exists mainly as a practical reference for the article: a small Actor that implements the schema patterns and collection logic discussed there.

## What this Actor showcases

This project demonstrates several input-schema UX patterns I use across public Apify Actors:

- A clear primary input instead of a cluttered top-level schema
- Support for multiple input sources, including direct `startUrls` and dataset-based chaining through `searchResultsDatasetId`
- A dedicated `parseAllResults` toggle instead of relying on magic values
- A `maxResults` limit with predictable pagination behavior
- Early input validation before the Actor starts doing work
- A simple structure you can reuse when building article examples or new Actors

## Why this repo exists

The article argues that the input schema is the actual UI of an Apify Actor. This repository is the hands-on companion to that idea.

It is meant to help readers:

- see how those UX ideas translate into code
- inspect a minimal Actor structure without unrelated production complexity
- reuse individual patterns in their own Actors

If you are looking for a full scraper, this repository is not that. The current `fetchPage()` implementation in [src/main.js](./src/main.js) is intentionally a placeholder so the focus stays on schema design and result-collection flow.

## Project structure

- [article.md](./article.md) - the article this Actor supports
- [src/main.js](./src/main.js) - Actor entry point and example pagination flow
- [src/request-sources.js](./src/request-sources.js) - request source building, including dataset input support
- [src/collect-results.js](./src/collect-results.js) - reusable collection logic for `maxResults` and `parseAllResults`
- [test/main.test.js](./test/main.test.js) - tests for the showcase logic

## How it works

At a high level, the Actor:

1. Reads the input
2. Validates collection settings such as `maxResults`
3. Builds request sources from direct URLs and optional dataset inputs
4. Runs a simple paginated collection flow
5. Pushes results while respecting `maxResults` unless `parseAllResults` is enabled

This makes the repo useful as a reference implementation for the patterns described in the article, especially:

- parse-all behavior
- dataset-to-dataset chaining
- minimal and readable Actor structure

## Run locally

Install dependencies:

```bash
npm install
```

Run the Actor locally:

```bash
apify run
```

Or start it directly with Node.js:

```bash
npm start
```

## Run tests

```bash
npm test
```

## Use this as a reference

If you are building your own Apify Actor, the most relevant parts to borrow are:

- the request-source composition in [src/request-sources.js](./src/request-sources.js)
- the collection-limit logic in [src/collect-results.js](./src/collect-results.js)
- the schema and UX rationale explained in [article.md](./article.md)

The point of this repo is not the scraping target. The point is how the Actor is presented and structured for users.
