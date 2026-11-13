# GreenOrbit

**NASA data turned into clear farming decisions.**

GreenOrbit helps farmers choose crop rotations that stay productive in a changing climate. Pin a farm on the map, and the app loads real NASA climate history for that location, then ranks crop rotation plans based on what the farmer values most: saving water, profit, or soil health.

Built by team **GreenOrbit** for the **NASA Space Apps Challenge 2026**.
Challenge: *Field Shift: Adapting Farms with NASA Data*.

---

## Features

- **Interactive map.** Click anywhere, or use quick picks for Bangladeshi locations such as Dhaka, Chattogram, Rajshahi, Khulna, and Sylhet.
- **Live NASA climate data.** Ten years (2015 to 2024) of monthly temperature, rainfall, and solar radiation from the NASA POWER API, with trend indicators.
- **Charts.** Monthly temperature and annual rainfall at a glance.
- **Rotation ranking.** The top three crop rotations for the selected location, scored from its real climate.
- **Farmer priorities.** Sliders for water saving, profit, and soil health re-rank the plans instantly.
- **Future warming option.** Add up to +4 °C to see how the best rotation changes.

## Data source

| Dataset | Variables | Access |
|---|---|---|
| [NASA POWER](https://power.larc.nasa.gov/docs/services/api/) | `T2M`, `PRECTOTCORR`, `ALLSKY_SFC_SW_DWN` (monthly) | Free API, no key needed |

Map tiles come from OpenStreetMap.

## Tech stack

React, Vite, Tailwind CSS, Leaflet (map), and Recharts (charts). It is frontend only: the browser calls the NASA POWER API directly, with no backend.

## Getting started

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
npm install
npm run dev
```

Then open the local address that Vite prints (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                      Page layout, location state, NASA data loading
  lib/
    power.js                   NASA POWER API client and climate summaries
    rotation.js                Crop data and rotation scoring
  components/
    MapPicker.jsx              Interactive Leaflet map
    ClimatePanel.jsx           Stat tiles and charts
    RotationPanel.jsx          Priority sliders and ranked rotations
```



## Roadmap

- NASA SMAP soil moisture trends
- MODIS NDVI crop-health history
- GPM IMERG drought and flood risk
- Multi-year rotation simulator
- NEX-GDDP-CMIP6 climate stress testing
- NISAR radar integration
- Bangla and English AI advisor

## Team

**GreenOrbit**

- **Mohammad Arfat**: machine learning and full-stack development
- **Mizbahul Ali Minhaz**: backend
