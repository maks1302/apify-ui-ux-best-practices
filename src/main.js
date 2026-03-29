import { setTimeout } from 'node:timers/promises';

import { Actor, log } from 'apify';

import { collectResults, getCollectionConfig } from './collect-results.js';
import { buildRequestListSources, enqueueRequestListSources } from './request-sources.js';

Actor.on('aborting', async () => {
    await setTimeout(1000);
    await Actor.exit();
});

await Actor.init();

const input = await Actor.getInput();
const { maxResults, parseAllResults } = getCollectionConfig(input);
const requestListSources = await buildRequestListSources(input);

await enqueueRequestListSources(requestListSources);

log.info('Actor started.', {
    maxResults,
    parseAllResults,
    requestCount: requestListSources.length,
});

// Example only: replace this with your real request/pagination logic.
const fetchPage = async ({ page }) => {
    log.info(`Fetching page ${page}.`);

    return {
        items: [],
        hasNextPage: false,
    };
};

const extractItems = (page) => page.items;
const totalCollected = await collectResults({ fetchPage, extractItems, maxResults, parseAllResults });

log.info('Collection finished.', { totalCollected });

await Actor.exit();
