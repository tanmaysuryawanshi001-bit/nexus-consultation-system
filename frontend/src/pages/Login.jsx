import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await authAPI.register({ name, email, password });
      } else {
        res = await authAPI.login({ email, password });
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/find-consultants');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-surface-container-low">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-xl p-8 border border-border-light">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {isRegister ? 'Sign up to connect with verified consultants' : 'Sign in to manage your consultation sessions'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-trust-blue text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-primary font-semibold hover:underline ml-1"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}