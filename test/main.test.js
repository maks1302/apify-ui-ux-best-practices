import { describe, expect, it, vi } from 'vitest';

import { collectResults, getCollectionConfig } from '../src/collect-results.js';
import { buildRequestListSources, enqueueRequestListSources } from '../src/request-sources.js';

describe('getCollectionConfig', () => {
    it('uses defaults when input is empty', () => {
        expect(getCollectionConfig()).toEqual({
            maxResults: 20,
            parseAllResults: false,
        });
    });

    it('rejects invalid maxResults', () => {
        expect(() => getCollectionConfig({ maxResults: 0 })).toThrow(
            'Input field "maxResults" must be an integer greater than 0.',
        );
    });
});

describe('collectResults', () => {
    it('trims the final batch when parseAllResults is disabled', async () => {
        const pushedBatches = [];
        const fetchPage = vi
            .fn()
            .mockResolvedValueOnce({
                items: [{ id: 1 }, { id: 2 }, { id: 3 }],
                hasNextPage: true,
            })
            .mockResolvedValueOnce({
                items: [{ id: 4 }, { id: 5 }, { id: 6 }],
                hasNextPage: true,
            });

        const totalCollected = await collectResults({
            fetchPage,
            extractItems: (page) => page.items,
            maxResults: 5,
            parseAllResults: false,
            pushData: async (items) => {
                pushedBatches.push(items);
            },
            logger: {
                info: vi.fn(),
                warning: vi.fn(),
            },
        });

        expect(pushedBatches).toEqual([
            [{ id: 1 }, { id: 2 }, { id: 3 }],
            [{ id: 4 }, { id: 5 }],
        ]);
        expect(totalCollected).toBe(5);
        expect(fetchPage).toHaveBeenCalledTimes(2);
    });

    it('keeps collecting until pagination ends when parseAllResults is enabled', async () => {
        const pushedBatches = [];
        const fetchPage = vi
            .fn()
            .mockResolvedValueOnce({
                items: [{ id: 1 }, { id: 2 }],
                hasNextPage: true,
            })
            .mockResolvedValueOnce({
                items: [{ id: 3 }],
                hasNextPage: false,
            });

        const totalCollected = await collectResults({
            fetchPage,
            extractItems: (page) => page.items,
            maxResults: 1,
            parseAllResults: true,
            pushData: async (items) => {
                pushedBatches.push(items);
            },
            logger: {
                info: vi.fn(),
                warning: vi.fn(),
            },
        });

        expect(pushedBatches).toEqual([
            [{ id: 1 }, { id: 2 }],
            [{ id: 3 }],
        ]);
        expect(totalCollected).toBe(3);
        expect(fetchPage).toHaveBeenCalledTimes(2);
    });
});

describe('buildRequestListSources', () => {
    it('combines startUrls with urls loaded from datasets', async () => {
        const input = {
            startUrls: [{ url: 'https://example.com/start' }],
            searchResultsDatasetId: ['dataset-1'],
        };

        const openDataset = vi.fn().mockResolvedValue({
            forEach: async (iteratee) => {
                await iteratee({ url: 'https://example.com/from-dataset' });
                await iteratee({ id: 'missing-url' });
            },
        });

        const requestListSources = await buildRequestListSources(input, {
            openDataset,
            logger: { info: vi.fn() },
        });

        expect(openDataset).toHaveBeenCalledWith('dataset-1', { forceCloud: true });
        expect(requestListSources).toEqual([
            { url: 'https://example.com/start' },
            { url: 'https://example.com/from-dataset' },
        ]);
    });
});

describe('enqueueRequestListSources', () => {
    it('adds every source to the request queue', async () => {
        const addRequest = vi.fn();
        const openRequestQueue = vi.fn().mockResolvedValue({ addRequest });

        await enqueueRequestListSources(
            [
                { url: 'https://example.com/1' },
                { url: 'https://example.com/2' },
            ],
            { openRequestQueue },
        );

        expect(addRequest).toHaveBeenCalledTimes(2);
        expect(addRequest).toHaveBeenNthCalledWith(1, { url: 'https://example.com/1' });
        expect(addRequest).toHaveBeenNthCalledWith(2, { url: 'https://example.com/2' });
    });
});
