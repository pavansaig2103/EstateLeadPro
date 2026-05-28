import { motion } from 'framer-motion';
import { Building2, Crown, KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@estateleads.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-luxury text-white">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,7,12,.92),rgba(8,13,24,.68)),url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-emerald/10" />
      <main className="relative grid min-h-screen items-center px-5 py-10 lg:grid-cols-[1.05fr_.95fr] lg:px-14">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-black/25 px-4 py-2 text-sm text-champagne backdrop-blur">
            <Crown size={17} />
            Premium real-estate lead intelligence
          </div>
          <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">EstateLead Pro</h1>
          <p className="mt-6 max-w-xl text-xl leading-8 text-slate-200">Prioritise high-value property leads with intelligent scoring.</p>
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {['Hot buyer routing', 'Site visit priority', 'Luxury CRM polish'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-sm font-semibold text-champagne">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.form initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleSubmit} className="glass mx-auto mt-10 w-full max-w-md rounded-[2rem] border border-white/10 p-7 shadow-premium lg:mt-0">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-obsidian">
              <Building2 />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <p className="text-sm text-slate-300">Secure command center access</p>
            </div>
          </div>
          {error && <div className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</div>}
          <label className="block">
            <span className="label">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-3.5 text-gold" size={18} />
              <input className="input pl-12" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </label>
          <label className="mt-4 block">
            <span className="label">Password</span>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-3.5 text-gold" size={18} />
              <input className="input pl-12" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </label>
          <button disabled={loading} className="mt-6 w-full rounded-2xl bg-gold-gradient px-5 py-4 font-black text-obsidian shadow-glow transition hover:scale-[1.01] disabled:opacity-70">
            {loading ? 'Opening dashboard...' : 'Enter EstateLead Pro'}
          </button>
          <p className="mt-5 text-center text-xs text-slate-400">Demo: admin@estateleads.com / admin123</p>
        </motion.form>
      </main>
    </div>
  );
}
