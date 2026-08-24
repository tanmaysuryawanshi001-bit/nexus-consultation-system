import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isActive = (path) => location.pathname === path ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-border-light">
      <div className="h-20 max-w-container-max mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
          <span className="text-xl font-bold text-primary">ConnecT</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm transition-colors ${isActive('/')}`}>Home</Link>
          <Link to="/find-consultants" className={`text-sm transition-colors ${isActive('/find-consultants')}`}>Find Consultants</Link>
          <Link to="/become-a-consultant" className={`text-sm transition-colors ${isActive('/become-a-consultant')}`}>Become a Consultant</Link>
        </nav>
        <div className="flex items-center gap-4">
          {token ? (
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }} 
              className="text-sm font-medium text-on-surface-variant hover:text-primary"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-trust-blue transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}