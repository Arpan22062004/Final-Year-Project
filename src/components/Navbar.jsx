import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Search, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#040712]/95 px-4 text-white backdrop-blur-md lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <BrandLogo compact className="sm:hidden" />
        <button type="button" onClick={onMenuClick} aria-label="Open navigation menu" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30 lg:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
          <input type="search" placeholder="Search your workspace..." aria-label="Search" className="w-64 rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 transition focus:border-indigo-400/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30">
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#040712]" />
        </button>

        <div className="relative">
          <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-haspopup="menu" aria-label="Open user menu" className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-400/30">
            <div aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-400/15">{userInitial}</div>
            <span className="hidden max-w-32 truncate text-sm font-medium text-slate-300 sm:block">{userName}</span>
            <ChevronDown className={`hidden h-4 w-4 text-slate-600 transition-transform duration-200 sm:block ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              <button type="button" aria-label="Close user menu" className="fixed inset-0 z-10 h-full w-full cursor-default" onClick={() => setMenuOpen(false)} />
              <div role="menu" aria-label="User menu" className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0b1020] py-1 shadow-2xl shadow-black/30">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">{userName}</p>
                  {userEmail && <p className="mt-0.5 truncate text-xs text-slate-500">{userEmail}</p>}
                </div>
                <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/settings'); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:outline-none">
                  <UserIcon className="h-4 w-4 text-slate-600" aria-hidden="true" /> Settings
                </button>
                <button type="button" role="menuitem" onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 focus:bg-red-500/10 focus:outline-none">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
