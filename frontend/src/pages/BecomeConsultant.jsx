import { useState } from 'react';
import { consultantAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function BecomeConsultant() {
  const [formData, setFormData] = useState({
    headline: '',
    hourlyRate: 100,
    experienceYears: 3,
    bio: '',
    linkedinUrl: '',
    category: 'career',
    skills: 'Strategy, Interview Prep'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await consultantAPI.apply({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      });
      setMessage('Application submitted successfully! Redirecting...');
      setTimeout(() => navigate('/find-consultants'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 max-w-container-max mx-auto px-6">
      <div className="max-w-2xl mx-auto bg-surface-container-lowest p-8 rounded-2xl shadow-lg border border-border-light">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Join as an Expert</h1>
        <p className="text-on-surface-variant mb-6">Create your consultant profile and start accepting bookings.</p>

        {message && <div className="mb-4 p-3 bg-blue-50 text-primary rounded-lg text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Headline</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Senior Software Architect at Top Tech"
              value={formData.headline}
              onChange={e => setFormData({...formData, headline: e.target.value})}
              className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Hourly Rate ($)</label>
              <input 
                type="number" 
                required 
                value={formData.hourlyRate}
                onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Years of Experience</label>
              <input 
                type="number" 
                required 
                value={formData.experienceYears}
                onChange={e => setFormData({...formData, experienceYears: Number(e.target.value)})}
                className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm capitalize"
            >
              <option value="career">Career</option>
              <option value="education">Education</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Skills (comma-separated)</label>
            <input 
              type="text" 
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
              className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Bio & Experience</label>
            <textarea 
              rows={4}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Describe your background and what clients can expect..."
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-trust-blue text-white font-semibold rounded-lg shadow-md transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Consultant Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}