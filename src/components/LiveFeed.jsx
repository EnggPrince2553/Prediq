export default function LiveFeed({ predictionsList, likedCards, setLikedCards, resolvePrediction, user, activeCategory, setActiveCategory }) {
  const toggleLike = (id) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard! Share the prediction with friends.");
  };

  return (
    <section id="livefeed" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="blob-purple -top-40 right-0 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            <span className="text-slate-400">Live Feed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Live Prediction Feed</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See what the community is predicting right now. Bold calls, tracked transparently.
          </p>
        </div>

        {/* Category Filter Indicator */}
        {activeCategory && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Filtering by:</span>
            <span className="text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full flex items-center gap-2">
              📂 {activeCategory}
              <button
                onClick={() => setActiveCategory(null)}
                className="text-emerald-400/60 hover:text-emerald-400 transition-colors ml-1.5"
                title="Clear Filter"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        )}

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictionsList.map((pred) => (
            <div
              key={pred.id}
              className="glass rounded-2xl p-5 card-hover glow-border group cursor-default flex flex-col justify-between"
            >
              <div>
                {/* Top Row — Category + Time */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${pred.categoryColor} text-white`}
                    >
                      {pred.category}
                    </span>
                    {pred.stake && (
                      <span className="text-[11px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                        🪙 {pred.stake} PCOIN
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-600">{pred.timeAgo}</span>
                </div>

                {/* User Row */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-base border border-white/10">
                    {pred.user.avatar}
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {pred.isUserOwned ? `@${user.username}` : pred.user.name}
                  </span>
                  {pred.streak >= 10 && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                      🔥 {pred.streak}
                    </span>
                  )}
                  {pred.isUserOwned && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      YOU
                    </span>
                  )}
                </div>

                {/* Prediction Title */}
                <p className="text-white font-semibold text-base mb-4 leading-snug group-hover:text-neon-cyan transition-colors duration-300">
                  {pred.title}
                </p>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Confidence</span>
                    <span className="text-neon-cyan font-semibold">{pred.confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-bar-fill"
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                {/* Bottom Row — Interactions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <button
                    onClick={() => toggleLike(pred.id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      likedCards[pred.id]
                        ? 'text-neon-pink'
                        : 'text-slate-500 hover:text-neon-pink'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={likedCards[pred.id] ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {likedCards[pred.id] ? pred.likes + 1 : pred.likes}
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {pred.comments}
                  </div>
                  <button onClick={handleShare} className="flex items-center gap-1 text-xs text-slate-500 hover:text-neon-cyan transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>

                {/* Resolve Box */}
                {pred.isUserOwned && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => resolvePrediction(pred.id, true)}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/35 text-green-400 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      🏆 Resolve Win
                    </button>
                    <button
                      onClick={() => resolvePrediction(pred.id, false)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/35 text-red-400 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      😢 Resolve Loss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
