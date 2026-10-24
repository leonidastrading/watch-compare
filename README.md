# Watch Compare

Compare the top 5 luxury watches (Rolex Submariner, Rolex Daytona, Omega Speedmaster,
AP Royal Oak, Patek Nautilus) with a price filter, a side-by-side spec table and live
Google Trends search-interest graphs.

```bash
npm install
npm run dev
```

Watch data lives in `src/lib/watches.ts`. Prices are hand-entered estimates. The Trends graph
uses Google's embed widget in the browser, because Google rate-limits server-side requests.
