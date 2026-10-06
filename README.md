# No-Code CSS Selector Web Scraper — URL + Field Map to JSON — Apify Actor usage guide

[![Run on Apify](https://img.shields.io/badge/Apify-Run%20this%20Actor-24C1E0)](https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara)
[![Try Apify free](https://img.shields.io/badge/Apify-Try%20it%20free-24C1E0)](https://console.apify.com/sign-up?fpr=aupara)

No-code web scraper with CSS selectors: give start URLs and a field map (CSS or XPath, attribute, regex, type) and get structured rows with pagination and detail pages. Export JSON, CSV, Excel. From $1 per 1,000 results.

> **This repository does not contain the Actor's source code.** The Actor is closed-source and
> runs on Apify's infrastructure. This repo is documentation plus ready-to-run client examples
> (curl, Python, JavaScript) that call the hosted Actor with **your own** Apify API token.

**Run it on Apify →** [https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara](https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara)

## What it does

This **no code web scraper CSS selector** tool turns any public, server-rendered web page into structured data. You give it start URLs and a *field map* (a field name → a CSS or XPath selector, plus optional attribute, regex and type). It returns one clean JSON row per item, and can follow "next page" links or a page-URL pattern, and open each item's detail page for extra fields. No code and no custom page function to write. Results can be exported as JSON, CSV, Excel, XML or HTML from the Apify dataset.

## Use cases

- Turn a category/list page plus pagination into rows (e.g. product name, price, link for every product card)
- Enrich a list of detail-page URLs with a fixed set of fields (title, price, SKU, description)
- List page -> follow each item link -> extract detail fields into one row per item
- Test and debug CSS/XPath selectors with a field-level fill-rate report before building a dedicated Actor
- Feed n8n/Make/Zapier with a stable JSON schema on a schedule


## Input

| Field | Type | Required | Description |
|---|---|---|---|
| `startUrls` | array | yes | Public pages to scrape (list pages, or single pages when no item selector is set). |
| `itemSelector` | string | no | CSS selector of each repeated item on a list page (e.g. article.product_pod). Leave empty to treat each page as ONE item. |
| `fields` | array | yes | List of {name, selector, extract (text/html/attr), attribute, regex, type (string/number/integer/boolean/url), all, selectorType (auto/css/xpath)}. Selectors are evaluated inside each item. Selectors starting with / are XPath. |
| `nextPageSelector` | string | no | CSS selector of the 'next page' link (e.g. li.next a). |
| `pageUrlPattern` | string | no | Alternative to the next-page selector: URL containing {page}, e.g. https://site.com/list?page={page}. Used from page 2; stops at the first empty page. |
| `maxPages` | integer | no | Pagination limit for each start URL. |
| `detailLinkSelector` | string | no | Optional: link inside each item to follow to a detail page (e.g. h3 a). Requires detail fields. |
| `detailFields` | array | no | Fields read on the detail page (same format as Fields; evaluated on the whole page). Names must differ from list fields. |
| `maxResults` | integer | no | Stop after this many rows (also caps your spending). |
| `requestDelayMs` | integer | no | Politeness delay. |
| `headers` | object | no | Optional extra headers (e.g. Accept-Language). Cookie and Authorization are refused: public pages only. |
| `proxyConfiguration` | object | no | Only needed if the site blocks direct requests (HTTP 403/429). |

The full input form (with defaults and validation) is on the [Actor page](https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara).


## Output (sample item)

Sample trimmed for readability (long texts and lists are shortened) — a real run returns the complete data.

```json
{
  "title": "It's Only the Himalayas",
  "price": 45.17,
  "url": "https://books.toscrape.com/catalogue/its-only-the-himalayas_981/index.html",
  "rating": "Two",
  "pageUrl": "https://books.toscrape.com/catalogue/category/books/travel_2/index.html",
  "pageNumber": 1,
  "itemIndex": 0,
  "missingFields": [],
  "scrapedAt": "2026-10-04T18:12:36.799Z"
}
```

## Pricing

Pay only for results: about **$1.50 per 1,000 results** on the Apify Free plan, down to **$1.00 per 1,000** on paid Apify plans.

Apify platform usage (compute) is billed by Apify on top of the per-result price — about **$0.39 per 1,000 results** in our measured test runs (estimate, varies with input). Tip: keep only the output formats and options you need to reduce it.

Prices can change — the [Actor page](https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara) always shows the current pricing.

## Quick start

You need an Apify account and an API token (Apify Console → **Settings → API & Integrations**).
Never commit your token: export it as the `APIFY_TOKEN` environment variable.

### cURL

```bash
curl -X POST "https://api.apify.com/v2/acts/leadsbrary~selector-map-web-scraper/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
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
```

### Python (`apify-client`)

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
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
        "useApifyProxy": False
    }
}

run = client.actor("leadsbrary/selector-map-web-scraper").call(run_input=run_input)
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)
```

### JavaScript (`apify-client`)

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

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
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

Runnable versions live in [`examples/`](./examples).

## Troubleshooting

- **401 / "User was not found or authentication token is not valid"** — check that `APIFY_TOKEN` is set and copied completely.
- **The run finished but the dataset is empty** — widen your search input or check the run log on the Apify Console.
- **Run stops early** — you may have reached the maximum cost per run you set in Apify; raise it in the run options.
- **Need something else?** Open an issue in this repository or use the Issues tab on the Actor page.

## Don't have an Apify account yet?

[Sign up here](https://console.apify.com/sign-up?fpr=aupara) — new accounts get $5 of free platform usage every month, enough to try most Actors without paying upfront.
Browse the full [Apify Store](https://apify.com/store?fpr=aupara) or [all Actors from this developer](https://apify.com/leadsbrary?fpr=aupara).

## Links

- Actor page: [https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara](https://apify.com/leadsbrary/selector-map-web-scraper?fpr=aupara)
- All Actors from this developer: [https://apify.com/leadsbrary?fpr=aupara](https://apify.com/leadsbrary?fpr=aupara)
- Apify API reference: [https://docs.apify.com/api/v2](https://docs.apify.com/api/v2)

## Keywords

no code web scraper css selector, css selector scraper, xpath scraper json, web scraper without code, no code scraper, website to json, html to json extractor, selector based scraper, pagination scraper, list and detail page scraper, n8n web scraper, make web scraper, structured data extractor, cheerio scraper alternative

#webscraping #nocode #cssselector #xpath #json #dataextraction #automation #n8n #make #apify

## License

The example code in this repository is released under the MIT License — see [LICENSE](./LICENSE).
It does not cover the Actor itself, which remains closed-source and is operated by its developer on Apify.
