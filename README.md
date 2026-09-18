# Optiora — Frontend Foundation

Optiora is an AI-assisted business intelligence workspace for sales, customers,
inventory, reporting, and business insights.

This repository is the **frontend phase** of the product. It is intentionally
structured so the backend and ML services can be added later without forcing a
rewrite of the UI.

## What is included

- Professional responsive marketing site and authenticated app shell
- Dashboard with revenue, sales, customer, profit, inventory and trend views
- Product CRUD: create, edit, delete, search and category filtering
- Customer management and segmentation-ready UI
- Sales CRUD with product/customer relationships and status filtering
- AI Insights page using deterministic frontend analytics as a placeholder
- Reports and settings pages
- Reusable buttons, cards, modal, navigation, loading states and brand logo
- Local demo data so the product can be explored without a backend
- Centralized frontend data boundary for the future API/ML integration

## Architecture

```text
src/
├── components/       # Reusable UI building blocks
├── config/            # Brand and product-wide configuration
├── context/           # Authentication/session state
├── lib/               # Local data + pure analytics utilities
├── pages/             # Route-level screens
└── services/          # Data/API boundary used by the UI
```

### Important rule

Pages should import business data from `src/services/dataService.js`, not from
`src/lib/db.js`. The current implementation delegates to localStorage. When the
backend is ready, the data service becomes the adapter between React and the
production API.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Backend + ML handoff

The intended production split is:

```text
React frontend
      │
      ▼
Optiora API (auth, users, products, customers, sales, reports)
      │
      ├── PostgreSQL / production database
      ├── background jobs / analytics
      └── ML service (forecasting, anomaly detection, recommendations)
```

`src/services/api.js` is the centralized HTTP client. Keep endpoint-specific
logic in the data-service layer so UI pages remain focused on presentation and
user interaction.

## Demo data and security

The current local adapter is for frontend development only. It stores demo data
and demo credentials in the browser. **Do not ship the local authentication or
localStorage database to production.** Production authentication, authorization,
password hashing, validation, audit logs, rate limiting, and data persistence
belong in the backend.

## Easy-change checklist

- Brand/name/colors → `src/config/theme.js` and `src/config/app.js`
- Navigation → `src/components/Sidebar.jsx`
- API base URL → `.env` / `VITE_API_BASE_URL`
- Data source → `src/services/dataService.js`
- Analytics calculations → `src/lib/analytics.js`
- Page UI → `src/pages/`
