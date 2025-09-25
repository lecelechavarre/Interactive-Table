# Interactive Data Table (Vanilla JS)

## Run locally
1. Serve folder with a static server (required to fetch `sample.json`). Example:
   - `npx http-server` or `python -m http.server 8000`
2. Open `http://localhost:8080` (or port used) in browser.

## Files
See `index.html`, `css/styles.css`, `data/sample.json`, `js/*`.

## Notes
- Accessibility: uses `aria-sort`, keyboard support on headers, and `aria-live` region.
- Pagination & filtering are client-side.
- To change schema, update `data/sample.json` and `js/components/tableRenderer.js` columns.
