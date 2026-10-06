// Run the "No-Code CSS Selector Web Scraper — URL + Field Map to JSON" Apify Actor and print its results.
// Setup: npm install  &&  export APIFY_TOKEN=your_apify_token  &&  node example.mjs
// This repository only documents the Actor; its source code runs on Apify's infrastructure.
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first (Apify Console > Settings > API & Integrations).');
    process.exit(1);
}

const client = new ApifyClient({ token });

const runInput = {
  "startUrls": [
    {
      "url": "https://books.toscrape.com/catalogue/category/books/travel_2/index.html"
    }
  ],
  "itemSelector": "article.product_pod",
  "fields": [
    {
      "name": "title",
      "selector": "h3 a",
      "extract": "attr",
      "attribute": "title"
    },
    {
      "name": "price",
      "selector": ".price_color",
      "regex": "([0-9.]+)",
      "type": "number"
    }
  ],
  "maxPages": 1,
  "maxResults": 3,
  "requestDelayMs": 300,
  "proxyConfiguration": {
    "useApifyProxy": false
  }
};

const run = await client.actor('leadsbrary/selector-map-web-scraper').call(runInput);
console.log(`Run finished with status: ${run.status}`);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
