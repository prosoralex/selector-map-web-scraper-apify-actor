#!/usr/bin/env bash
# Run the "No-Code CSS Selector Web Scraper — URL + Field Map to JSON" Apify Actor synchronously and print the dataset items.
# Usage: export APIFY_TOKEN=your_apify_token && ./run.sh
set -euo pipefail
: "${APIFY_TOKEN:?Set APIFY_TOKEN first (Apify Console > Settings > API & Integrations)}"

curl -sS -X POST "https://api.apify.com/v2/acts/leadsbrary~selector-map-web-scraper/run-sync-get-dataset-items" \
  -H "Authorization: Bearer ${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @- <<'JSON'
{
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
}
JSON
