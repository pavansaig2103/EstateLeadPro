export const budgetLabels = {
  below_25_lakhs: 'Below 25 Lakhs',
  '25_50_lakhs': '25-50 Lakhs',
  '50_lakhs_1_crore': '50 Lakhs-1 Crore',
  above_1_crore: 'Above 1 Crore'
};

export const timelineLabels = {
  immediately: 'Immediately',
  within_1_month: 'Within 1 Month',
  within_3_months: 'Within 3 Months',
  just_exploring: 'Just Exploring'
};

export const purposeLabels = {
  investment: 'Investment',
  own_house: 'Own House',
  resale: 'Resale',
  commercial: 'Commercial'
};

export const questionLabels = {
  '0_1': '0-1',
  '2_4': '2-4',
  '5_plus': '5+'
};

export const agentOptions = ['Ramesh', 'Priya', 'Arjun', 'Neha'];

export const stageLabels = {
  new: 'New',
  contacted: 'Contacted',
  site_visit_scheduled: 'Site Visit Scheduled',
  negotiation: 'Negotiation',
  converted: 'Converted',
  lost: 'Lost'
};

export const funnelStages = ['new', 'contacted', 'site_visit_scheduled', 'negotiation', 'converted', 'lost'];

export function formatDate(value) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function isFollowUpDue(lead) {
  if (!lead?.followUpDate || ['converted', 'lost'].includes(lead.stage)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${lead.followUpDate}T00:00:00`) <= today;
}

export function isOverdue(lead) {
  if (!lead?.followUpDate || ['converted', 'lost'].includes(lead.stage)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${lead.followUpDate}T00:00:00`) < today;
}

export function statusClasses(status) {
  if (status === 'Hot') return 'border-rose-400/40 bg-rose-500/15 text-rose-100';
  if (status === 'Warm') return 'border-amber-300/40 bg-amber-400/15 text-amber-100';
  return 'border-sky-300/40 bg-sky-400/15 text-sky-100';
}
