import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/http';
import LeadForm from '../components/leads/LeadForm';
import Loading from '../components/ui/Loading';

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/leads/${id}`)
      .then((res) => setLead(res.data.lead))
      .catch(() => setError('Unable to load lead for editing.'));
  }, [id]);

  async function submitLead(payload) {
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/leads/${id}`, payload);
      navigate(`/leads/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update lead.');
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !lead) return <div className="error-box">{error}</div>;
  if (!lead) return <Loading label="Preparing editable lead record..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Edit Lead</h2>
        <p className="page-subtitle">Update buyer details and recalculate priority scoring instantly.</p>
      </div>
      {error && <div className="error-box">{error}</div>}
      <LeadForm initialLead={lead} onSubmit={submitLead} submitting={submitting} />
    </div>
  );
}
