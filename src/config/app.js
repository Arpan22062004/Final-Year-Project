/**
 * Product-level configuration.
 * Change business-wide behavior here instead of editing individual pages.
 */
export const appConfig = {
  name: 'Optiora',
  tagline: 'AI business intelligence for growing teams',
  currency: 'USD',
  locale: 'en-US',
  lowStockThreshold: 5,
  // Keep `local` while the backend/ML services are being built.
  // Switch to `api` when the production API contract is ready.
  dataMode: import.meta.env.VITE_DATA_MODE || 'local',
};
