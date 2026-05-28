import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/http';
import LeadTable from '../components/leads/LeadTable';
import GlassCard from '../components/ui/GlassCard';
import Loading from '../components/ui/Loading';
import { agentOptions, stageLabels } from '../utils/formatters';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', agent: '', stage: '', dueToday: false });

  function loadLeads() {
    setLoading(true);
    api.get('/leads', {
      params: {
        search: filters.search || undefined,
        status: filters.status || undefined,
        agent: filters.agent || undefined,
        stage: filters.stage || undefined,
        dueToday: filters.dueToday ? 'true' : undefined
      }
    })
      .then((res) => setLeads(res.data.leads))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(loadLeads, 250);
    return () => clearTimeout(timeout);
  }, [filters.search, filters.status, filters.agent, filters.stage, filters.dueToday]);

  const sortedLeads = useMemo(() => [...leads].sort((a, b) => b.score - a.score), [leads]);

  async function deleteLead(lead) {
    if (!window.confirm(`Delete ${lead.name}? This cannot be undone.`)) return;
    await api.delete(`/leads/${lead.id}`);
    setToast(`${lead.name} deleted.`);
    loadLeads();
    setTimeout(() => setToast(''), 2400);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="page-title">Leads</h2>
          <p className="page-subtitle">Prioritize buyers, route agents, and track the next follow-up action.</p>
        </div>
        <Link to="/leads/new" className="inline-flex items-center gap-2 rounded-2xl bg-gold-gradient px-5 py-3 font-bold text-obsidian shadow-glow">
          <Plus size={18} /> Add Lead
        </Link>
      </div>

      {toast && <div className="rounded-2xl border border-emerald/30 bg-emerald/15 px-4 py-3 text-sm text-emerald">{toast}</div>}

      <GlassCard className="p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_160px_160px_220px_190px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-3.5 text-gold" size={18} />
            <input className="input pl-12" placeholder="Search name, phone, location, or agent" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          </div>
          <select className="input" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All statuses</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
          <select className="input" value={filters.agent} onChange={(event) => setFilters({ ...filters, agent: event.target.value })}>
            <option value="">All agents</option>
            {agentOptions.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
          </select>
          <select className="input" value={filters.stage} onChange={(event) => setFilters({ ...filters, stage: event.target.value })}>
            <option value="">All stages</option>
            {Object.entries(stageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-200">
            <input type="checkbox" checked={filters.dueToday} onChange={(event) => setFilters({ ...filters, dueToday: event.target.checked })} />
            Due today or overdue
          </label>
        </div>
      </GlassCard>

      <GlassCard className="p-3 sm:p-5">
        {loading ? <Loading label="Loading lead pipeline..." /> : <LeadTable leads={sortedLeads} onDelete={deleteLead} />}
      </GlassCard>
    </div>
  );
}
