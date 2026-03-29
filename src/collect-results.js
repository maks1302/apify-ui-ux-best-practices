import { Actor, log } from 'apify';

export function getCollectionConfig(input) {
    const {
        maxResults = 20,
        parseAllResults = false,
    } = input ?? {};

    if (!Number.isInteger(maxResults) || maxResults < 1) {
        throw new Error('Input field "maxResults" must be an integer greater than 0.');
    }

    return {
        maxResults,
        parseAllResults,
    };
}

export async function collectResults({
    fetchPage,
    extractItems,
    maxResults = 20,
    parseAllResults = false,
    pushData = async (items) => Actor.pushData(items),
    logger = log,
}) {
    let totalCollected = 0;
    let page = 1;

    while (true) {
        if (!parseAllResults && totalCollected >= maxResults) {
            logger.info(`Reached limit of ${maxResults} items.`);
            break;
        }

        const data = await fetchPage({ page });
        const items = extractItems(data) || [];

        if (items.length === 0) {
            logger.info('No more results available.');
            break;
        }

        const remaining = maxResults - totalCollected;
        const itemsToPush = parseAllResults ? items : items.slice(0, remaining);

        await pushData(itemsToPush);
        totalCollected += itemsToPush.length;

        if (!parseAllResults && itemsToPush.length < items.length) {
            logger.info(`Reached limit of ${maxResults} items.`);
            break;
        }

        if (!data.hasNextPage) {
            logger.info('Pagination finished.');
            break;
        }

        page += 1;
    }

    return totalCollected;
}
