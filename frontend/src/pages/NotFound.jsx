import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 pt-20">
      <div className="max-w-xl text-center">
        <p className="text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold text-on-surface">Page not found</h1>
        <p className="mt-3 text-on-surface-variant">
          We couldn’t find <span className="font-semibold break-all">{location.pathname}</span>. The page may have moved or the link may be incorrect.
        </p>
        <Link to="/" className="inline-block mt-8 bg-primary hover:bg-trust-blue text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all">
          Return home
        </Link>
      </div>
    </section>
  );
}
