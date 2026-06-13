import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────
//  SETUP:  Connect a real email backend in 60 seconds (free):
//  1. Go to https://formspree.io  →  sign up (free)
//  2. Create a new form  →  copy the endpoint URL
//  3. Add to your .env file:   VITE_FORMSPREE_URL=https://formspree.io/f/YOUR_ID
//  4. Redeploy on Vercel (add the env var in Project → Settings → Environment Variables)
//  Without this, signups are still saved to localStorage as a local backup.
// ─────────────────────────────────────────────────────────────────
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL;

// Username rules: 3–20 chars, letters / numbers / underscores only, no spaces
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export default function WaitlistForm({ user, logInUser }) {
  const [formData, setFormData] = useState({ email: '', username: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ── Validate username ──────────────────────────────────────────
    const trimmedUsername = formData.username.trim();
    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setError('Username must be 3–20 characters: letters, numbers, or underscores only. No spaces.');
      return;
    }

    setLoading(true);

    try {
      // ── Send to Formspree (real email collection) ────────────────
      if (FORMSPREE_URL) {
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            username: trimmedUsername,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || 'Submission failed. Please try again.');
        }
      }

      // ── localStorage backup (always runs) ────────────────────────
      try {
        const existing = JSON.parse(localStorage.getItem('prediq_signups') || '[]');
        existing.push({
          email: formData.email,
          username: trimmedUsername,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('prediq_signups', JSON.stringify(existing));
      } catch {
        // localStorage unavailable — not a blocking error
      }

      // ── GA event ─────────────────────────────────────────────────
      if (typeof gtag !== 'undefined') {
        gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: trimmedUsername,
          value: 1,
        });
      }

      setSubmitted(true);
      logInUser(trimmedUsername, formData.email);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <div className="glass rounded-3xl p-6 sm:p-8 max-w-md mx-auto glow-border">
          {user.loggedIn || submitted ? (
            /* ── Success State ── */
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-400/50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list! 🎉</h3>
              <p className="text-slate-400 mb-4">
                Welcome to the Prediq community,{' '}
                <span className="text-neon-cyan font-semibold">@{user.username || formData.username}</span>
              </p>
              <div className="glass rounded-xl px-5 py-3 inline-block">
                <p className="text-xs text-slate-500 mb-1">Your Badge</p>
                <p className="text-lg">🏅 <span className="text-neon-cyan font-bold">Early Founder</span></p>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                />
              </div>

              {/* Username */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                <input
                  type="text"
                  id="waitlist-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={20}
                  placeholder="Choose username  (3–20 chars, no spaces)"
                  className="w-full bg-dark-800/80 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                />
              </div>

              {/* Inline error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-sm mt-0.5">⚠️</span>
                  <p className="text-red-400 text-sm leading-snug">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <p className="text-center text-xs text-slate-600 pt-2">
                Free forever for beta users. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
