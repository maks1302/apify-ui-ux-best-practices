# Empty JavaScript project — developer documentation

Demonstrates Actor input-schema design, request-source composition, dataset chaining, and predictable collection limits.

This root README is for developers and operators maintaining the implementation, backend configuration, and deployments. A user guide is not present yet; its intended location is `.actor/README.md`. That guide should explain published-Actor usage and input/output without maintainer setup.

This document describes the checked-in code, not a guarantee about an existing deployed build or provider uptime. “Attempts” includes the initial request; “retries” means additional requests unless a source constant is explicitly quoted.

## Purpose and execution flow

Input is validated, direct URLs and dataset-based request sources are combined and enqueued, and collectResults enforces maxResults unless parseAllResults is enabled. The current placeholder fetchPage yields no results.

Key implementation files:

- [src/collect-results.js](src/collect-results.js) — Extraction, parsing, or supporting business logic.
- [src/main.js](src/main.js) — Process entry point and Actor/monitoring startup.
- [src/request-sources.js](src/request-sources.js) — Extraction, parsing, or supporting business logic.

## Upstream APIs and integration boundaries

The current runtime does not call an upstream scraping API. This is a developer reference, not a production scraper. It has no remote telemetry integration. An abort listener waits one second and exits. Replace fetchPage with real retrieval before describing a production API, retries, or extraction coverage.

## Credentials and runtime configuration

No upstream API credential is required by the current placeholder implementation.

Backend credentials belong in operator-managed environment variables or secret configuration, never the public user README or committed input examples. Apify credentials used by the SDK are separate from third-party provider keys. Keep real secret values out of source, command history, logs, and support reports.

Actor settings and schema references are in [.actor/actor.json](.actor/actor.json). Cloud-injected Actor/run/storage identity is consumed by the SDK and monitoring code; configure backend credentials separately for local execution.

## Retries, timeouts, and request pacing

There is no external HTTP request or application retry policy in fetchPage: it returns an empty items array with hasNextPage=false. Collection errors propagate normally.

This is a developer reference, not a production scraper. It has no remote telemetry integration. An abort listener waits one second and exits. Replace fetchPage with real retrieval before describing a production API, retries, or extraction coverage.

The attempt budget is per helper call, not necessarily per input or saved record: identifier resolution, pagination, empty-page checks, and enrichment can create additional calls. Separate Actor runs consume provider quota independently; a per-run limiter does not coordinate all deployments.

## Input, output, and billing contracts

Schema and configuration files:

- [.actor/input_schema.json](.actor/input_schema.json).

Declared numeric/boolean schema defaults: `maxResults=100`, `parseAllResults=false`. These are schema declarations; explicit input and runtime fallbacks still determine effective behavior.

Dataset persistence, pagination limits, normalization, and billing must evolve together. Keep dataset/output schema fields aligned with the actual saved records. A partial or empty dataset is not enough to diagnose failure: inspect request outcome and run logs. Source media links and optional provider fields can change or expire.

## Storage, lifecycle, and recovery

Results already saved to Apify storage survive a later request failure; in-memory work does not automatically resume. No named application checkpoint/summary key is explicitly written by the runtime.

There is no persisted application pagination checkpoint loaded by this implementation. Restarting a fresh run can repeat retrieval and create repeated output unless the caller deduplicates.

Explicit lifecycle hooks in source: `aborting`. Their cleanup/cancellation behavior is implemented in the entry/runner modules; a hook name alone does not guarantee an in-flight HTTP request is interrupted.

## Logs and operational diagnosis

The showcase logs collection configuration, page fetches, stop conditions, and total collected count; the placeholder fetch produces no external request logs.

A local warning/error log is not equivalent to a remote exception event. Input URLs, identifiers, queries, and provider failure details may appear in logs according to the linked call sites. Credential sanitization in telemetry does not imply that all original application logs exclude personal data. Keep credentials out of new log arguments and use the existing logger/context conventions when adding diagnostics.

## Telemetry and error reporting

No remote exception telemetry is implemented in the checked-in runtime. There is no SENTRY_DSN configuration path, shared telemetry client, or monitoring smoke command for this Actor. Operational diagnosis relies on application logs, run status, and saved output. Installing a crawler or SDK dependency alone does not enable error reporting.

## Local development and verification

Run commands from this Actor directory. Match the container Node major when available; several packages use ESM and JSON import attributes, and the shared telemetry dependency requires Node >=20.19 even if a legacy engines field declares a lower minimum.

```sh
npm ci
apify run
```

Supply backend credentials through environment/secret configuration before running. Prepare a small representative input in the default local key-value store (normally storage/key_value_stores/default/INPUT.json). Local SDK storage remains on disk and does not synchronize itself to Apify Console. `npm start` executes the declared entry point directly; `apify run` supplies the CLI local Actor environment.

Declared package commands:

- `npm start` → `node ./src/main.js`.
- `npm run format:check` → `prettier --check .`.
- `npm run lint` → `eslint`.
- `npm test` → `vitest run`.

## Build, deployment, and external services

Deployment uses [.actor/actor.json](.actor/actor.json). README/schema paths in a modern Actor definition are resolved relative to the `.actor` directory. Keep `readme: "./README.md"` pointing to the public guide when present, so this maintainer document is not selected for Store users.

Checked-in container definitions: [Dockerfile](Dockerfile). Root Dockerfile base: `apify/actor-node:24`.

Before publishing a code change, run the repository’s appropriate checks, confirm required backend subscriptions and secrets in the deployment environment, and review schema/README compatibility. `apify push` deploys and builds the Actor; run it only as an intentional deployment step. A local dataset check does not prove that a cloud build, its credentials, or remote output is valid.

## Maintenance checklist

- Change request behavior in the API/client module, keeping the documented attempt count, timeout, and permanent-error handling aligned.
- Update runtime validation, input/output schemas, and normalization together when provider fields or pagination tokens change.
- Preserve partial output and distinguish valid empty/unavailable results from transport, authentication, and schema failures.
- Register new secrets before logs/events, keep monitoring data bounded, and capture an unrecovered operation once at its owning boundary.
- Exercise success, exhausted retries, malformed responses, storage errors, and lifecycle shutdown using the repository’s existing tests or focused local fixtures.
- Update the public user README only for changed usage/output/pricing behavior; keep operator API keys, hosting, and deployment details in this file.

## Preserved repository and maintainer notes

The following existing notes are retained for their Actor-specific context. The operational sections above describe the current source.

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
