import { ArrowLeft, CalendarClock, Edit3, PhoneCall, UserRoundCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/http';
import Badge from '../components/ui/Badge';
import GlassCard from '../components/ui/GlassCard';
import Loading from '../components/ui/Loading';
import { budgetLabels, formatDate, purposeLabels, questionLabels, stageLabels, timelineLabels } from '../utils/formatters';

export default function LeadDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/leads/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError('Lead not found or unavailable.'));
  }, [id]);

  if (error) return <div className="error-box">{error}</div>;
  if (!data) return <Loading label="Opening lead dossier..." />;

  const { lead, breakdown, recommendedAction } = data;
  const maxScore = 130;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (lead.score / maxScore) * circumference;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"><ArrowLeft size={17} /> Back to leads</Link>
        <Link to={`/leads/${lead.id}/edit`} className="inline-flex items-center gap-2 rounded-2xl bg-gold-gradient px-5 py-3 font-bold text-obsidian shadow-glow"><Edit3 size={18} /> Edit Lead</Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <GlassCard className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.25em] text-champagne/70">Customer summary</p>
              <h2 className="mt-2 text-3xl font-black text-white">{lead.name}</h2>
              <p className="mt-2 text-slate-300">{lead.phone}</p>
              <p className="text-slate-300">{lead.preferredLocation}</p>
            </div>
            <Badge status={lead.status}>{lead.status}</Badge>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info label="Budget Range" value={budgetLabels[lead.budgetRange]} />
            <Info label="Buying Timeline" value={timelineLabels[lead.timeline]} />
            <Info label="Purpose" value={purposeLabels[lead.purpose]} />
            <Info label="Questions Asked" value={questionLabels[lead.questionsAsked]} />
            <Info label="Site Visit Interest" value={lead.siteVisitInterest === 'yes' ? 'Yes' : 'No'} />
            <Info label="Lead Stage" value={stageLabels[lead.stage]} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <div className="relative mx-auto h-40 w-40">
              <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,.1)" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="54" stroke="url(#scoreGradient)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
                <defs>
                  <linearGradient id="scoreGradient" x1="0" x2="1">
                    <stop offset="0%" stopColor="#d6a84f" />
                    <stop offset="100%" stopColor="#1fc99a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-4xl font-black text-white">{lead.score}</p>
                  <p className="text-xs text-slate-400">Lead score</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="section-title">Recommended Next Action</h3>
              <div className="mt-4 rounded-2xl border border-emerald/25 bg-emerald/10 p-4">
                <div className="flex gap-3">
                  <PhoneCall className="mt-1 shrink-0 text-emerald" size={20} />
                  <p className="leading-7 text-slate-100">{recommendedAction}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniFact icon={UserRoundCheck} label="Assigned Agent" value={lead.assignedAgent} />
                <MiniFact icon={CalendarClock} label="Follow-up Date" value={formatDate(lead.followUpDate)} />
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-6">
          <h3 className="section-title">Score Breakdown</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <ScorePart label="Budget" value={breakdown.budget} detail={budgetLabels[lead.budgetRange]} />
            <ScorePart label="Timeline" value={breakdown.timeline} detail={timelineLabels[lead.timeline]} />
            <ScorePart label="Purpose" value={breakdown.purpose} detail={purposeLabels[lead.purpose]} />
            <ScorePart label="Questions" value={breakdown.questions} detail={questionLabels[lead.questionsAsked]} />
            <ScorePart label="Site Visit" value={breakdown.siteVisit} detail={lead.siteVisitInterest === 'yes' ? 'Yes' : 'No'} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="section-title">Notes</h3>
          <p className="mt-3 leading-7 text-slate-300">{lead.notes || 'No notes added yet.'}</p>
        </GlassCard>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[.18em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}

function MiniFact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <Icon className="text-gold" size={18} />
      <p className="mt-3 text-xs uppercase tracking-[.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function ScorePart({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-3 text-2xl font-black text-champagne">+{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
