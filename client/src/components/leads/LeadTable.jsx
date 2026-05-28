import { Edit3, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { budgetLabels, formatDate, isOverdue, purposeLabels, stageLabels, timelineLabels } from '../../utils/formatters';
import Badge from '../ui/Badge';

export default function LeadTable({ leads, onDelete }) {
  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
        <p className="text-lg font-semibold text-white">No leads found</p>
        <p className="mt-2 text-sm text-slate-300">Clear filters or add a new property enquiry.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-[1380px] w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[.16em] text-champagne/75">
            <tr>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Phone</th>
              <th className="px-4 py-4">Budget Range</th>
              <th className="px-4 py-4">Timeline</th>
              <th className="px-4 py-4">Purpose</th>
              <th className="px-4 py-4">Score</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Agent</th>
              <th className="px-4 py-4">Stage</th>
              <th className="px-4 py-4">Follow-up Date</th>
              <th className="px-4 py-4">Next Action</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {leads.map((lead) => (
              <tr key={lead.id} className={`transition hover:bg-white/[.07] ${isOverdue(lead) ? 'bg-rose-500/[.09]' : 'bg-white/[.025]'}`}>
                <td className="px-4 py-4">
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.preferredLocation}</p>
                </td>
                <td className="px-4 py-4 text-slate-300">{lead.phone}</td>
                <td className="px-4 py-4 text-champagne">{budgetLabels[lead.budgetRange]}</td>
                <td className="px-4 py-4 text-slate-300">{timelineLabels[lead.timeline]}</td>
                <td className="px-4 py-4 text-slate-300">{purposeLabels[lead.purpose]}</td>
                <td className="px-4 py-4"><span className="text-lg font-black text-white">{lead.score}</span></td>
                <td className="px-4 py-4"><Badge status={lead.status}>{lead.status}</Badge></td>
                <td className="px-4 py-4 text-slate-300">{lead.assignedAgent}</td>
                <td className="px-4 py-4"><Badge>{stageLabels[lead.stage]}</Badge></td>
                <td className="px-4 py-4">
                  <span className={isOverdue(lead) ? 'font-semibold text-rose-100' : 'text-slate-300'}>{formatDate(lead.followUpDate)}</span>
                </td>
                <td className="max-w-[260px] px-4 py-4 text-slate-300">{lead.nextAction}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <IconLink to={`/leads/${lead.id}`} label="View"><Eye size={16} /></IconLink>
                    <IconLink to={`/leads/${lead.id}/edit`} label="Edit"><Edit3 size={16} /></IconLink>
                    <button onClick={() => onDelete(lead)} className="icon-btn text-rose-100" aria-label={`Delete ${lead.name}`}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IconLink({ to, label, children }) {
  return <Link to={to} className="icon-btn" aria-label={label}>{children}</Link>;
}
