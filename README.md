# Sinfonik Regional Impact Dashboard

A Next.js public-facing dashboard that models the regional economic impact of Sinfonik adoption — starting with New York City and designed to generalize to any region.

## Architecture

Three-layer system per Ivan Reidel's specification:

1. **Public presentation layer** — interactive charts, sliders, scenario comparisons at `/dashboard` and `/scenario-lab`
2. **Private modeling layer** — economic logic in `lib/model.ts`, executed server-side via API routes, formulas never sent to browser
3. **Data layer** — regional inputs in `lib/data/nyc.ts`, designed to scale to a Postgres database

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero and NYC stats |
| `/dashboard` | NYC region dashboard with headline metrics + charts |
| `/scenario-lab` | Interactive scenario explorer with all public inputs |
| `/methodology` | Model transparency page |

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/region/[region]/baseline` | GET | Baseline data for a region |
| `/api/region/[region]/run-scenario` | POST | Run a scenario with custom inputs |
| `/api/compare` | GET | Compare two scenario types side by side |

## Model Modules

- **A — Business Adoption**: How many venues/entities adopt Sinfonik?
- **B — Music Exposure**: How much exposure do local artists get?
- **C — Royalty/Income Transmission**: How does exposure convert to income?
- **D — Regional Economic Impact**: GDP delta, jobs, tourism spillover, tax ROI
- **E — Distributional Impact**: Gini, poverty rates, songwriter income distribution

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` and configure the service
5. Click **Deploy**

The app uses Next.js standalone output mode for efficient Render deployment.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Hosting**: Render (via `render.yaml`)
- **Code**: GitHub

## Security Notes

- Model formulas and coefficients live in `lib/model.ts` (server-side only)
- Private `_private` fields in regional data are stripped before API responses
- Rate limiting on `/run-scenario` (30 req/min per IP)
- API never returns hidden coefficients, elasticities, or calibration notes
- Add `ADMIN_SECRET` env var to protect `/api/admin/*` routes in production

## Extending to Other Regions

1. Add a new entry to `lib/data/nyc.ts` (or split into separate files)
2. Calibrate the baseline numbers for the new region
3. The scenario engine in `lib/model.ts` handles any region automatically

## Next Steps (Internal Version)

- Postgres DB for saving/comparing scenarios over time
- Auth for admin tools
- Editable weights + calibration settings UI
- Export to PDF / slide-ready charts
- Version history for model changes
- Python service for heavier distributional modeling

---

Built by Claude for Sinfonik. Questions: ivanreidel@sinfonik.com
