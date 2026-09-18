# Optiora version comparison

The three supplied archives were reviewed before selecting the final frontend base.

| Version | What it does well | Trade-offs | Decision |
|---|---|---|---|
| `optiora.zip` | Most extensive CRUD-oriented page implementations; strong Products/Customers flows and a more detailed dashboard | Older light-shell architecture and several pages depend on an internal `AppShell` pattern, making the UI less consistent | Reused as the functional reference |
| `Optiora_2.0.zip` | Strong shared component structure, consistent routing/auth flow, polished dashboard and analytics | Some product documentation was out of sync with the actual dark UI | Used as a structural reference |
| `Optioraai_2.0.zip` | Best cohesive visual system, dark Optiora branding, `BrandLogo`, shared theme, polished dashboard + AI Insights | Still uses localStorage as its data/auth implementation; AI insights are heuristic placeholders rather than real ML | **Selected as the final base** |

## Final merge decisions

The final frontend keeps the cohesive shell and visual system from `Optioraai_2.0`
while preserving its complete CRUD screens and analytics layer. It also adds:

- `src/config/app.js` for product-wide settings
- `src/services/dataService.js` as the UI-to-data boundary
- `src/services/api.js` as the future backend HTTP client
- `.env.example` for API configuration
- `ErrorBoundary` for safer production-like failure handling
- `ARCHITECTURE.md` and this decision log for maintainability
- deterministic, documented frontend demo behavior

The backend and ML system should be added behind the service boundary rather than
rewriting the page components.
