import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultantAPI, bookingAPI } from '../services/api';

export default function FindConsultants() {
  const [consultants, setConsultants] = useState([]);
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [sessionDate, setSessionDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = {};
        if (category) params.category = category;
        if (submittedSearch) params.search = submittedSearch;

        const res = await consultantAPI.getAll(params);
        if (!ignore) {
          setConsultants(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load consultants:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [category, submittedSearch]);

  const handleBookClick = (consultant) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setSelectedConsultant(consultant);
    setBookingMessage(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!sessionDate) return;

    try {
      setBookingLoading(true);
      await bookingAPI.create({
        consultantId: selectedConsultant.id,
        sessionDate,
        durationMinutes: 60,
        notes,
      });

      setBookingMessage({ type: 'success', text: 'Session successfully booked!' });
      setTimeout(() => {
        setSelectedConsultant(null);
        setSessionDate('');
        setNotes('');
      }, 1800);
    } catch (err) {
      setBookingMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to complete booking. Please try again.',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="pt-28 max-w-container-max mx-auto px-6 pb-16">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-on-surface mb-2">
            Find your <span className="text-primary">Match</span>
          </h1>
          <p className="text-on-surface-variant">Connect with top-rated experts in career, education, and personal growth.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setSubmittedSearch(search);
          }}
          className="flex gap-2 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search skills, names, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-surface-container-low border border-border-light rounded-lg outline-none focus:ring-2 focus:ring-primary w-full md:w-72 text-sm"
          />
          <button type="submit" className="bg-primary hover:bg-trust-blue text-white px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-sm">
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {['', 'career', 'education', 'personal'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setLoading(true);
              setCategory(cat);
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              category === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat === '' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Consultant Cards */}
      {loading ? (
        <div className="text-center py-20 text-on-surface-variant">Loading verified consultants...</div>
      ) : consultants.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-on-surface-variant mb-4">No consultants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((c) => (
            <div
              key={c.id}
              className="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col border border-border-light"
            >
              <div className="h-48 w-full bg-surface-container-low relative">
                <img
                  src={c.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-amber-gold text-sm font-bold">star</span>
                  <span className="text-xs font-bold">{c.rating_avg}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-on-surface">{c.name}</h3>
                <p className="text-xs text-primary font-semibold mb-2">{c.headline}</p>
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">{c.bio}</p>

                <div className="flex flex-wrap gap-1.5 my-auto pb-4">
                  {c.skills &&
                    c.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-surface-container-low text-on-surface-variant text-[11px] font-medium px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-border-light flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-on-surface">${Number(c.hourly_rate).toFixed(0)}</span>
                    <span className="text-xs text-on-surface-variant font-normal">/hr</span>
                  </div>
                  <button
                    onClick={() => handleBookClick(c)}
                    className="bg-amber-gold hover:bg-amber-gold/90 text-on-surface font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-sm"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedConsultant && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-border-light p-6 relative">
            <button
              onClick={() => setSelectedConsultant(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-on-surface mb-1">Book Consultation</h2>
            <p className="text-sm text-on-surface-variant mb-4">
              with <span className="font-semibold text-primary">{selectedConsultant.name}</span> (${selectedConsultant.hourly_rate}/hr)
            </p>

            {bookingMessage && (
              <div
                className={`p-3 rounded-lg text-sm mb-4 ${
                  bookingMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {bookingMessage.text}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Select Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm border border-border-light"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Topics or Questions for the Session</label>
                <textarea
                  rows={3}
                  placeholder="Outline what you want to discuss..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm border border-border-light"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedConsultant(null)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2 bg-primary hover:bg-trust-blue text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}