import { Bell, Building2, Home, LogOut, Menu, PlusCircle, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/leads/new', label: 'Add Lead', icon: PlusCircle }
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-white/10 bg-black/25 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-obsidian shadow-glow">
          <Building2 size={25} />
        </div>
        <div>
          <p className="text-lg font-bold text-white">EstateLead Pro</p>
          <p className="text-xs text-champagne/80">Royal CRM Suite</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-gold-gradient text-obsidian shadow-glow' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-emerald/20 bg-emerald/10 p-4">
        <p className="text-sm font-semibold text-emerald">Priority Engine</p>
        <p className="mt-1 text-xs leading-5 text-slate-300">Scores budget, timeline, purpose, questions, and site visit intent.</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-luxury text-white">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-72">{sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-label="Close navigation" />
          <div className="relative h-full w-80 max-w-[85vw]">{sidebar}</div>
        </div>
      )}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-obsidian/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button className="rounded-xl border border-white/10 p-2 text-slate-200 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              {open ? <X /> : <Menu />}
            </button>
            <div>
              <p className="text-xs uppercase tracking-[.32em] text-champagne/70">Premium property intelligence</p>
              <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">Prioritise high-value property leads</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">
                <Bell size={17} className="text-gold" />
                <span className="text-sm text-slate-200">{user?.name || 'Admin'}</span>
              </div>
              <button onClick={handleLogout} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
