import { CalendarClock, CheckCircle2, Flame, Snowflake, Target, ThermometerSun, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/http';
import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import Loading from '../components/ui/Loading';
import { formatDate, funnelStages, stageLabels } from '../utils/formatters';

const funnelLabels = {
  ...stageLabels,
  site_visit_scheduled: 'Site Visit'
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stats/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Unable to load dashboard intelligence.'));
  }, []);

  const funnel = useMemo(() => {
    const counts = Object.fromEntries((data?.funnel || []).map((item) => [item.stage, item.count]));
    return funnelStages.map((stage) => ({ stage: funnelLabels[stage], leads: counts[stage] || 0 }));
  }, [data]);

  if (error) return <div className="error-box">{error}</div>;
  if (!data) return <Loading />;

  const stats = [
    ['Total Leads', data.summary.totalLeads, Users],
    ['Hot Leads', data.summary.hotLeads, Flame],
    ['Warm Leads', data.summary.warmLeads, ThermometerSun],
    ['Cold Leads', data.summary.coldLeads, Snowflake],
    ['Follow-ups Due Today', data.summary.followUpsDueToday, CalendarClock],
    ['Site Visit Interested', data.summary.siteVisitInterested, Target],
    ['Conversion Ready', data.summary.conversionReady, CheckCircle2]
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <GlassCard key={label} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-4xl font-black text-white">{value}</p>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-obsidian shadow-glow">
                <Icon size={22} />
              </div>
            </div>
          </GlassCard>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <GlassCard className="p-5">
          <h2 className="section-title">Today's Priority Leads</h2>
          <div className="mt-4 space-y-3">
            {data.priorityLeads.length ? data.priorityLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />) : <Empty label="No priority leads yet." />}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="section-title">Urgent Follow-ups</h2>
          <div className="mt-4 space-y-3">
            {data.urgentFollowUps.length ? data.urgentFollowUps.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{lead.name}</p>
                    <p className="text-sm text-slate-400">{lead.assignedAgent} - {formatDate(lead.followUpDate)}</p>
                  </div>
                  <Badge status={lead.status}>{lead.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-rose-50">{lead.nextAction}</p>
              </div>
            )) : <Empty label="No due or overdue follow-ups." />}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <GlassCard className="p-5">
          <h2 className="section-title">Lead Funnel</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer>
              <BarChart data={funnel}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                <XAxis dataKey="stage" stroke="#94a3b8" interval={0} tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, color: '#fff' }} />
                <Bar dataKey="leads" fill="#d6a84f" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="section-title">Agent Workload</h2>
          <div className="mt-4 space-y-4">
            {data.agentWorkload.map((item) => (
              <div key={item.agent}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{item.agent}</span>
                  <span className="text-champagne">{item.count} leads</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold to-emerald" style={{ width: `${Math.max(12, (item.count / Math.max(1, data.summary.totalLeads)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function LeadRow({ lead }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{lead.name}</p>
          <p className="text-sm text-slate-400">{lead.assignedAgent} - {lead.preferredLocation} - {stageLabels[lead.stage]}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-champagne">{lead.score}</span>
          <Badge status={lead.status}>{lead.status}</Badge>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{lead.nextAction}</p>
    </div>
  );
}

function Empty({ label }) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">{label}</div>;
}
