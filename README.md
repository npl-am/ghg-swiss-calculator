# Swiss Household GHG Footprint Calculator

An interactive web calculator for estimating the annual greenhouse gas footprint of a Swiss household by canton, using a consumption-based accounting approach consistent with BAFU and GHG Protocol methodology.

## What it does

- Estimates household CO2e emissions across four categories: **home energy**, **mobility**, **food**, and **goods & consumption**
- Lets users select their **canton**, **household type**, **heating fuel**, **diet**, car use, public transport, flights, and monthly spending
- Shows a live breakdown and benchmark comparison against the Swiss average, global average, and the 1.5°C-aligned target
- Includes a **/methodology** route listing all emission factors, their values, units, notes, and source links

## Tech stack

- **React 18** with functional components and hooks
- **Vite** for development and bundling
- **react-router-dom v6** for client-side routing (`/` calculator, `/methodology` table)

## Data sources

| Category | Source |
|---|---|
| Electricity emission factor | Peer-reviewed Swiss electricity trade study (ScienceDirect, 2024) |
| Heating fuels (gas, oil, wood) | BAFU CO2 statistics (annual release) |
| Car and public transport | mobitool v3.0 |
| Flights | Swiss Climate AG / DEFRA RFI 2.0 methodology |
| Diet emission factors | ESU-services — Eco-profile of dietary styles |
| Goods & consumption | FSO household expenditure data (spend-based derivation) |
| Canton heating mix | BFS Gebäude- und Wohnungsstatistik 2023 |
| Food consumption baseline | menuCH national dietary survey |
| Benchmarks | BAFU/BFS (Swiss average), IPCC / C40 (1.5°C target) |

See `/methodology` in the running app for the full table with URLs.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Limitations

- Heating is modelled as a single dominant fuel; the canton mix drives the default only
- Flights use a blended proxy (700 kg CO2e/trip); the underlying Excel model distinguishes short- vs long-haul
- Goods & consumption uses a spend-based factor — the weakest estimation tier
- Some heating fuel factors are placeholders pending BAFU verification (flagged in the methodology table)

This calculator is for illustrative and educational purposes only.
