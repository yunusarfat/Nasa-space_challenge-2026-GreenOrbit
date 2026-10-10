# Field Shift (Frontend Demo)

NASA Space Apps Challenge 2026 | Challenge: **Field Shift: Adapting Farms with NASA Data**

A frontend-only prototype of the first two features of our full project:

1. **Location picker + NASA climate history.** Click anywhere on the map (or use a quick pick) and the app fetches 10 years of monthly **temperature, rainfall and solar radiation** from the **NASA POWER API**, then shows trends and charts.
2. **Crop rotation suggestions.** Rotations are ranked for that location from its real climate, using the farmer's priorities (save water, profit, soil health) and an optional future-warming slider.

No backend and no API key. The browser calls NASA POWER directly.

## Run it

```bash
npm install
npm run dev
```

Open the local URL that Vite prints.

## Stack

React, Vite, Tailwind CSS, Leaflet (map), Recharts (charts).

## Data

- **NASA POWER** (`T2M`, `PRECTOTCORR`, `ALLSKY_SFC_SW_DWN`), monthly, 2015 to 2024.
  https://power.larc.nasa.gov/docs/services/api/

## Honest limits

- NASA POWER is regional-scale data (about 50 km grid), not field-level precision.
- The crop values and scoring in `src/lib/rotation.js` are illustrative rule-based heuristics, not agronomic advice.
- Seasons are set for South Asia (monsoon, cool season, hot pre-monsoon), so results are most meaningful for Bangladesh and nearby regions.

## Full project roadmap

SMAP soil moisture, MODIS NDVI, GPM drought/flood risk, a 10-year rotation simulator, NEX-GDDP climate stress tests, NISAR radar, and an AI advisor in Bangla/English.
