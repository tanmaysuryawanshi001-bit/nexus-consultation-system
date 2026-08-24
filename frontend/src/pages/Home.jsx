import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
          <span className="text-xs uppercase tracking-widest text-primary font-bold bg-blue-100 px-3 py-1 rounded-full">
            Elevate Your Path
          </span>
          <h1 className="text-5xl font-extrabold text-on-surface leading-tight">
            Find Your Perfect Consultant
          </h1>
          <p className="text-lg text-on-surface-variant max-w-lg">
            Connect with verified experts across career, education, and personal growth. Get the personalized guidance you need to succeed.
          </p>
          <div className="flex gap-4">
            <Link to="/find-consultants" className="bg-primary hover:bg-trust-blue text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all">
              Find Match
            </Link>
            <Link to="/become-a-consultant" className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-8 py-3 rounded-lg font-semibold transition-all">
              Join as an Expert
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-xl border border-border-light overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7QA2eROgl5MNtH_xe_2cdDsLxUQjFBAOkhrI1Q-Ga9eWi5yb2GaxwT91Z61V7CHvskKbcmsi5_Ysx3jNlCIl7TgCkNaUpChpgWEB917KpYfVnGq3Cods6l7mTNWF78FUtxiLPTrjDUHtz67UDbismL8RHT3yiMAggZgGZkJPxc933TJWMm5dtt5JzL-komYIPHANhMoi8IYrLcwkZskvJD5kPUnfhA4wO8IOi2_WkNjh6oXEDOXEpiA" 
              alt="Consulting preview" 
              className="rounded-2xl w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}