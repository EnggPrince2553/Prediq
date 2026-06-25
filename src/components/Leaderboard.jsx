import { useState, useEffect } from 'react';
import { leaderboard as mockLeaderboard } from '../data/mockData';

export default function Leaderboard({ user, balance }) {
  const [liveList, setLiveList] = useState(null); // null = loading
  const [error, setError]       = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchLeaderboard() {
      try {
        const res = await fetch('http://localhost:5000/api/users/leaderboard');
        if (!res.ok) throw new Error('Bad response');
        const data = await res.json();
        if (!cancelled) setLiveList(data);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    fetchLeaderboard();
    return () => { cancelled = true; };
  }, []);

  // Build the display list
  let list = liveList
    ? [...liveList]         // use live DB data
    : [...mockLeaderboard]; // fallback to mock while loading

  // Always inject / update the current logged-in user in the list
  if (user && user.loggedIn) {
    const userRep = user.reputation ?? Math.max(5000 + (balance - 1000) * 5, 0);
    const userRecord = {
      rank: null,
      name: `@${user.username}`,
      avatar: '👤',
      reputation: userRep,
      accuracy: user.accuracy ?? 85,
      streak: user.streak ?? 0,
      badges: userRep >= 8000 ? ['🏆', '🔥', '⭐'] : userRep >= 4000 ? ['🥇', '🔥'] : ['🏅'],
      level: userRep >= 8000 ? 'Expert' : userRep >= 4000 ? 'Advanced' : 'New Predictor',
      levelColor:
        userRep >= 8000 ? 'text-cyan-400' : userRep >= 4000 ? 'text-green-400' : 'text-slate-400',
    };
    // Remove stale entry for this user (if any) before inserting fresh one
    list = list.filter((item) => item.name !== `@${user.username}`);
    list.push(userRecord);
  }

  // Sort by reputation descending & re-rank
  list.sort((a, b) => b.reputation - a.reputation);
  const rankedList = list.map((item, idx) => ({ ...item, rank: idx + 1 }));

  const topThree = rankedList.slice(0, 3);
  const rest     = rankedList.slice(3);

  const rankColors  = [
    'from-yellow-400 to-amber-500',
    'from-slate-300 to-slate-400',
    'from-amber-600 to-orange-700',
  ];
  const rankBorders = ['border-yellow-500/40', 'border-slate-400/30', 'border-amber-600/30'];
  const rankGlows   = ['shadow-yellow-500/10', 'shadow-slate-400/10', 'shadow-amber-600/10'];

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
          {/* Live / Loading badge */}
          <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
            error
              ? 'bg-red-500/10 text-red-400'
              : liveList === null
              ? 'bg-slate-700/50 text-slate-400'
              : 'bg-green-500/10 text-green-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              error ? 'bg-red-400' : liveList === null ? 'bg-slate-500 animate-pulse' : 'bg-green-400'
            }`} />
            {error ? 'Using cached data' : liveList === null ? 'Loading live data…' : 'Live rankings'}
          </span>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {topThree.map((u, i) => (
            <div
              key={u.rank}
              className={`glass rounded-3xl p-6 text-center card-hover border ${rankBorders[i]} shadow-lg ${rankGlows[i]} ${
                i === 0 ? 'sm:order-2 sm:-mt-4' : i === 1 ? 'sm:order-1' : 'sm:order-3'
              } ${u.name === `@${user?.username}` ? 'ring-2 ring-neon-cyan/40' : ''}`}
            >
              {/* Rank Badge */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[i]} flex items-center justify-center text-dark-900 font-extrabold text-sm mx-auto mb-3`}>
                #{u.rank}
              </div>

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-dark-700 border-2 border-white/10 flex items-center justify-center text-3xl mx-auto mb-3">
                {u.avatar}
              </div>

              {/* Name & Level */}
              <h3 className="text-white font-bold text-lg mb-1">{u.name}</h3>
              <p className={`text-xs font-semibold ${u.levelColor} mb-3`}>{u.level}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-3">
                <div>
                  <p className="text-lg font-bold text-neon-cyan">{u.reputation.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Rep</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-neon-purple">{u.accuracy}%</p>
                  <p className="text-xs text-slate-500">Accuracy</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-400">{u.streak}🔥</p>
                  <p className="text-xs text-slate-500">Streak</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex justify-center gap-1.5">
                {u.badges.map((badge, j) => (
                  <span key={j} className="text-lg">{badge}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Rankings */}
        <div className="glass rounded-2xl overflow-hidden">
          {rest.map((u, i) => (
            <div
              key={u.rank}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${
                i !== rest.length - 1 ? 'border-b border-white/5' : ''
              } ${u.name === `@${user?.username}` ? 'bg-neon-cyan/5' : ''}`}
            >
              {/* Rank */}
              <span className="text-sm font-bold text-slate-500 w-8 text-center">#{u.rank}</span>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {u.avatar}
              </div>

              {/* Name & Level */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                <p className={`text-xs ${u.levelColor}`}>{u.level}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-neon-cyan">{u.reputation.toLocaleString()}</p>
                  <p className="text-xs text-slate-600">Rep</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-neon-purple">{u.accuracy}%</p>
                  <p className="text-xs text-slate-600">Acc</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-orange-400">{u.streak}🔥</p>
                  <p className="text-xs text-slate-600">Streak</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-1">
                {u.badges.map((badge, j) => (
                  <span key={j} className="text-base">{badge}</span>
                ))}
              </div>
            </div>
          ))}

          {rest.length === 0 && (
            <p className="text-center text-slate-500 py-10 text-sm">
              No other predictors yet — be the first to rise through the ranks! 🚀
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
