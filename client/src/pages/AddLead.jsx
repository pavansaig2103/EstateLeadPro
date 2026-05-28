import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/http';
import LeadForm from '../components/leads/LeadForm';

export default function AddLead() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submitLead(payload) {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/leads', payload);
      navigate(`/leads/${data.lead.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create lead.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Add Premium Lead</h2>
        <p className="page-subtitle">Capture buyer intent and let EstateLead Pro calculate the score automatically.</p>
      </div>
      {error && <div className="error-box">{error}</div>}
      <LeadForm onSubmit={submitLead} submitting={submitting} />
    </div>
  );
}
