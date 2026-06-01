import { heroCards } from '../data/mockData';

export default function Hero() {
  const handleScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
      {/* Background Blobs */}
      <div className="blob-cyan -top-40 -left-40" />
      <div className="blob-purple top-1/3 -right-20" />
      <div className="blob-cyan bottom-0 left-1/3 w-[300px] h-[300px]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-800/50 via-dark-900/80 to-dark-900 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-sm">
              <span className="w-2 h-2 rounded-full bg-neon-cyan pulse-dot" />
              <span className="text-slate-400">Now in Early Access</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="gradient-text">Predict Smarter.</span>
              <br />
              <span className="text-white">Build Credibility.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Turn predictions, challenges, and real-world goals into social reputation. 
              Join the network where your foresight builds your brand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#waitlist"
                onClick={(e) => handleScroll(e, '#waitlist')}
                className="btn-primary text-base px-8 py-3.5 text-center"
              >
                🚀 Join Early Access
              </a>
              <a
                href="#waitlist"
                onClick={(e) => handleScroll(e, '#waitlist')}
                className="btn-secondary text-base px-8 py-3.5 text-center"
              >
                @ Claim Username
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {['🧑‍💻', '🏏', '💪', '🚀'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-900 flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="text-neon-cyan font-semibold">2,400+</span> early predictors joined
              </p>
            </div>
          </div>

          {/* Right — Floating Cards */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
            <div className="relative h-[400px] sm:h-[450px]">
              {heroCards.map((card, i) => {
                const positions = [
                  'top-0 left-0 sm:left-4',
                  'top-4 right-0 sm:right-4',
                  'bottom-16 left-4 sm:left-0',
                  'bottom-0 right-4 sm:right-0',
                ];
                const animations = [
                  'animate-float',
                  'animate-float-delayed',
                  'animate-float-slow',
                  'animate-float',
                ];
                return (
                  <div
                    key={i}
                    className={`absolute ${positions[i]} ${animations[i]} w-[160px] sm:w-[180px]`}
                  >
                    <div
                      className={`glass rounded-2xl p-4 border ${card.borderColor} card-hover cursor-default`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{card.emoji}</span>
                        <span className="text-xs text-slate-500 font-medium">{card.category}</span>
                      </div>
                      <p className="text-sm font-semibold text-white mb-3">{card.title}</p>
                      <div className="confidence-bar">
                        <div
                          className="confidence-bar-fill"
                          style={{ width: `${card.confidence}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">{card.confidence}% confidence</p>
                    </div>
                  </div>
                );
              })}

              {/* Center Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
}
