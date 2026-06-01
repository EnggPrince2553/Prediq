import { useState } from 'react';
import { waitlistCategories } from '../data/mockData';

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    category: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Track with GA
    if (typeof gtag !== 'undefined') {
      gtag('event', 'waitlist_signup', {
        event_category: 'engagement',
        event_label: formData.category,
        value: 1,
      });
    }

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="waitlist" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="blob-cyan top-1/4 -left-20 opacity-30" />
      <div className="blob-purple bottom-0 right-0 opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Reserve Your Spot</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-3">
            Be among the first to build your prediction reputation on Prediq.
          </p>
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm">
            <span className="text-lg">🏅</span>
            <span className="text-neon-cyan font-semibold">First 500 signups get the Founder Badge</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-6 sm:p-10 max-w-xl mx-auto glow-border">
          {submitted ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-400/50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list! 🎉</h3>
              <p className="text-slate-400 mb-4">
                Welcome to the Prediq community, <span className="text-neon-cyan font-semibold">@{formData.username || 'predictor'}</span>
              </p>
              <div className="glass rounded-xl px-5 py-3 inline-block">
                <p className="text-xs text-slate-500 mb-1">Your Badge</p>
                <p className="text-lg">🏅 <span className="text-neon-cyan font-bold">Early Founder</span></p>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="waitlist-name" className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  id="waitlist-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                />
              </div>

              {/* Username */}
              <div>
                <label htmlFor="waitlist-username" className="block text-sm font-medium text-slate-400 mb-2">Choose Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm">@</span>
                  <input
                    type="text"
                    id="waitlist-username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="username"
                    className="w-full bg-dark-800 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="waitlist-email" className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@email.com"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="waitlist-category" className="block text-sm font-medium text-slate-400 mb-2">Favorite Category</label>
                <select
                  id="waitlist-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-600">Select a category</option>
                  {waitlistCategories.map((cat, i) => (
                    <option key={i} value={cat} className="bg-dark-800">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Reserving...
                  </>
                ) : (
                  '🚀 Reserve My Spot'
                )}
              </button>

              <p className="text-center text-xs text-slate-600">
                Free forever for beta users. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
