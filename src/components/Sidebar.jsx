
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Sparkles,
  FileBarChart,
  Settings,
  X,
} from 'lucide-react';
import { classNames } from '@/lib/utils';
import BrandLogo from '@/components/BrandLogo';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-label="Main navigation"
        className={classNames(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300',
          'shadow-[4px_0_24px_rgba(15,23,42,0.03)]',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <BrandLogo
            to="/dashboard"
            compact
            className="max-w-44.5"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => classNames(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={classNames(
                        'h-5 w-5 shrink-0 transition-colors',
                        isActive
                          ? 'text-indigo-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      )}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Help Section */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Need help?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Check our docs or contact support.
            </p>

            <button
              type="button"
              className="mt-3 text-xs font-semibold text-indigo-700 transition-colors hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              View docs <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
