/**
 * Optiora design tokens.
 * Keep product-wide colors here so the UI can be rebranded without editing
 * individual pages and components.
 */
export const theme = {
  colors: {
    brand: '#6366f1',
    brandStrong: '#4f46e5',
    brandSoft: '#eef2ff',
    accent: '#22d3ee',
    surface: '#0b1020',
    page: '#050816',
    border: '#1e293b',
    text: '#f8fafc',
    muted: '#94a3b8',
  },
  chart: ['#0f766e', '#2563eb', '#0d9488', '#d97706', '#475569', '#0891b2'],
};

export const ui = {
  panel: 'rounded-2xl border border-white/10 bg-[#0b1020] shadow-lg shadow-black/10',
  panelHeader: 'flex items-start justify-between gap-4 px-5 pt-5',
  input: 'rounded-lg border border-white/10 bg-white/5 text-slate-100 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/15',
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-teal-600/30',
};
