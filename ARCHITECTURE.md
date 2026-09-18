# Optiora Frontend Architecture

## Design goals

1. **Readable:** prefer small components and descriptive names.
2. **Changeable:** product-wide settings live in config files.
3. **Replaceable data layer:** UI does not know whether data comes from localStorage or an API.
4. **Backend-ready:** API communication is centralized in `services/api.js`.
5. **ML-ready:** AI Insights currently consumes frontend analytics; later it can consume backend ML responses through the same service boundary.

## Page dependency direction

`pages → services → lib/data adapter`

Avoid this:

`pages → localStorage`

This keeps the frontend stable when the backend is introduced.

## Suggested production modules

- `/api/auth` — authentication/session endpoints
- `/api/products` — catalog and inventory
- `/api/customers` — customer records
- `/api/sales` — transactions
- `/api/reports` — report generation/export
- `/api/insights` — AI/ML insight requests
- `/api/forecasts` — demand/revenue forecasting

The exact API contract should be finalized before switching `VITE_DATA_MODE` to
an API-backed implementation.
