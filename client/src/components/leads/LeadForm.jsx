import { Save } from 'lucide-react';
import { useState } from 'react';
import { agentOptions, budgetLabels, purposeLabels, questionLabels, stageLabels, timelineLabels } from '../../utils/formatters';
import GlassCard from '../ui/GlassCard';

const today = new Date().toISOString().slice(0, 10);

const initialValues = {
  name: '',
  phone: '',
  budgetRange: '50_lakhs_1_crore',
  timeline: 'within_1_month',
  purpose: 'own_house',
  preferredLocation: '',
  questionsAsked: '2_4',
  siteVisitInterest: 'yes',
  assignedAgent: 'Ramesh',
  followUpDate: today,
  stage: 'new',
  notes: ''
};

export default function LeadForm({ initialLead, onSubmit, submitting = false }) {
  const [form, setForm] = useState({ ...initialValues, ...initialLead });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <GlassCard className="p-5 sm:p-7">
      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-2">
        <Field label="Customer Name" name="name" value={form.name} onChange={updateField} placeholder="Customer name" />
        <Field label="Phone Number" name="phone" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" />
        <Select label="Budget Range" name="budgetRange" value={form.budgetRange} onChange={updateField} options={budgetLabels} />
        <Select label="Buying Timeline" name="timeline" value={form.timeline} onChange={updateField} options={timelineLabels} />
        <Select label="Purpose" name="purpose" value={form.purpose} onChange={updateField} options={purposeLabels} />
        <Field label="Preferred Location" name="preferredLocation" value={form.preferredLocation} onChange={updateField} placeholder="Kokapet, Tellapur, Mokila" />
        <Select label="Questions Asked" name="questionsAsked" value={form.questionsAsked} onChange={updateField} options={questionLabels} />
        <Select label="Site Visit Interest" name="siteVisitInterest" value={form.siteVisitInterest} onChange={updateField} options={{ yes: 'Yes', no: 'No' }} />
        <label className="block">
          <span className="label">Assigned Agent</span>
          <select className="input" name="assignedAgent" value={form.assignedAgent} onChange={updateField}>
            {agentOptions.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
          </select>
        </label>
        <Field label="Follow-up Date" name="followUpDate" type="date" value={form.followUpDate} onChange={updateField} />
        <Select label="Lead Stage" name="stage" value={form.stage} onChange={updateField} options={stageLabels} />
        <label className="block lg:col-span-2">
          <span className="label">Notes</span>
          <textarea className="input min-h-32 resize-y" name="notes" value={form.notes || ''} onChange={updateField} placeholder="Capture preferences, objections, visit timing, and next steps." />
        </label>
        <div className="lg:col-span-2">
          <button disabled={submitting} className="inline-flex items-center gap-2 rounded-2xl bg-gold-gradient px-5 py-3 font-bold text-obsidian shadow-glow transition hover:scale-[1.01] disabled:opacity-60">
            <Save size={18} />
            {submitting ? 'Saving lead...' : 'Save lead'}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className="input" {...props} />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className="input" {...props}>
        {Object.entries(options).map(([value, labelText]) => <option key={value} value={value}>{labelText}</option>)}
      </select>
    </label>
  );
}
