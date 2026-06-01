import { leaderboard } from '../data/mockData';

export default function Leaderboard() {
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const rankColors = [
    'from-yellow-400 to-amber-500',   // Gold
    'from-slate-300 to-slate-400',     // Silver
    'from-amber-600 to-orange-700',    // Bronze
  ];

  const rankBorders = [
    'border-yellow-500/40',
    'border-slate-400/30',
    'border-amber-600/30',
  ];

  const rankGlows = [
    'shadow-yellow-500/10',
    'shadow-slate-400/10',
    'shadow-amber-600/10',
  ];

  return (
    <section id="leaderboard" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="blob-purple -bottom-40 left-0 opacity-30" />
      <div className="blob-cyan top-20 right-1/4 opacity-15" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Top Predictors</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            The most accurate minds on Prediq. Climb the ranks with consistency and conviction.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {topThree.map((user, i) => (
            <div
              key={user.rank}
              className={`glass rounded-3xl p-6 text-center card-hover border ${rankBorders[i]} shadow-lg ${rankGlows[i]} ${
                i === 0 ? 'sm:order-2 sm:-mt-4' : i === 1 ? 'sm:order-1' : 'sm:order-3'
              }`}
            >
              {/* Rank Badge */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[i]} flex items-center justify-center text-dark-900 font-extrabold text-sm mx-auto mb-3`}>
                #{user.rank}
              </div>

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-dark-700 border-2 border-white/10 flex items-center justify-center text-3xl mx-auto mb-3">
                {user.avatar}
              </div>

              {/* Name & Level */}
              <h3 className="text-white font-bold text-lg mb-1">{user.name}</h3>
              <p className={`text-xs font-semibold ${user.levelColor} mb-3`}>{user.level}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-3">
                <div>
                  <p className="text-lg font-bold text-neon-cyan">{user.reputation.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Rep</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-neon-purple">{user.accuracy}%</p>
                  <p className="text-xs text-slate-500">Accuracy</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-400">{user.streak}🔥</p>
                  <p className="text-xs text-slate-500">Streak</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex justify-center gap-1.5">
                {user.badges.map((badge, j) => (
                  <span key={j} className="text-lg">{badge}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Rankings */}
        <div className="glass rounded-2xl overflow-hidden">
          {rest.map((user, i) => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${
                i !== rest.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {/* Rank */}
              <span className="text-sm font-bold text-slate-500 w-8 text-center">
                #{user.rank}
              </span>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {user.avatar}
              </div>

              {/* Name & Level */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <p className={`text-xs ${user.levelColor}`}>{user.level}</p>
              </div>

              {/* Stats — hidden on mobile, shown on sm+ */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-neon-cyan">{user.reputation.toLocaleString()}</p>
                  <p className="text-xs text-slate-600">Rep</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-neon-purple">{user.accuracy}%</p>
                  <p className="text-xs text-slate-600">Acc</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-orange-400">{user.streak}🔥</p>
                  <p className="text-xs text-slate-600">Streak</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-1">
                {user.badges.map((badge, j) => (
                  <span key={j} className="text-base">{badge}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
