import { communities } from '../data/mockData';

export default function Communities({ onCommunityClick }) {
  return (
    <section id="communities" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="blob-cyan top-0 right-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Trending Communities</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join prediction rooms where your niche meets your knowledge. Compete, collaborate, and climb.
          </p>
        </div>

        {/* Community Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((community, i) => (
            <div
              key={i}
              onClick={() => onCommunityClick && onCommunityClick(community.name)}
              className={`glass rounded-3xl p-6 card-hover border ${community.borderColor} group cursor-pointer`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center text-2xl border border-white/5`}>
                  {community.emoji}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${community.textColor} group-hover:brightness-125 transition-all`}>
                    {community.name}
                  </h3>
                  <p className="text-xs text-slate-500">{community.members} members</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 py-3 border-y border-white/5">
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-white">{community.activePredictions}</p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-white">
                    {Math.round(community.activePredictions * 0.65)}
                  </p>
                  <p className="text-xs text-slate-500">Resolved</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-neon-cyan">
                    {Math.round(community.activePredictions * 0.12)}
                  </p>
                  <p className="text-xs text-slate-500">Trending</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Join hint */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500">Join community</span>
                <svg className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
