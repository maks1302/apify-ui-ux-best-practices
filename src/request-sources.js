import { Actor, log } from 'apify';

export async function buildRequestListSources(input, {
    openDataset = Actor.openDataset,
    logger = log,
} = {}) {
    const {
        searchResultsDatasetId = [],
        startUrls = [],
    } = input || {};

    const requestListSources = [...startUrls];

    if (searchResultsDatasetId.length > 0) {
        logger.info(`Loading data from ${searchResultsDatasetId.length} dataset(s)...`);

        for (const datasetId of searchResultsDatasetId) {
            const dataset = await openDataset(datasetId, { forceCloud: true });

            await dataset.forEach(async (item) => {
                if (!item?.url) return;

                requestListSources.push({ url: item.url });
            });
        }
    }

    return requestListSources;
}

export async function enqueueRequestListSources(requestListSources, {
    openRequestQueue = Actor.openRequestQueue,
} = {}) {
    const requestQueue = await openRequestQueue();

    for (const source of requestListSources) {
        await requestQueue.addRequest(source);
    }

    return requestQueue;
}
