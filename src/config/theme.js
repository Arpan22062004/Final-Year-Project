
/**
 * Optiora design tokens.
 * Premium light theme with consistent product-wide colors.
 */
export const theme = {
  colors: {
    brand: '#6366f1',
    brandStrong: '#4f46e5',
    brandSoft: '#eef2ff',
    accent: '#0891b2',

    surface: '#ffffff',
    page: '#f8fafc',
    border: '#e2e8f0',

    text: '#0f172a',
    muted: '#64748b',
  },

  chart: [
    '#4f46e5',
    '#0f766e',
    '#0891b2',
    '#d97706',
    '#9333ea',
    '#475569',
  ],
};

export const ui = {
  panel:
    'rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50',

  panelHeader:
    'flex items-start justify-between gap-4 px-5 pt-5',

  input:
    'rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',

  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
};
