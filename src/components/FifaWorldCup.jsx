import { useState, useEffect } from 'react';

export default function FifaWorldCup({ balance, setBalance, setPredictionsList, showToast, user, freePredictionsUsed, setFreePredictionsUsed, freePredictionLimit }) {
  const canPredictFree = freePredictionsUsed < freePredictionLimit;
  const freeRemaining = freePredictionLimit - freePredictionsUsed;
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'outrights' | 'standings'
  const [activeGroup, setActiveGroup] = useState('Group A'); // For standings
  const [bettingMatch, setBettingMatch] = useState(null); // Match ID currently opening the stake panel
  const [selectedOutcome, setSelectedOutcome] = useState(''); // 'Home' | 'Away' | 'Draw'
  const [betStake, setBetStake] = useState(100);

  // Outrights State
  const [selectedChampion, setSelectedChampion] = useState('');
  const [selectedGoldenBoot, setSelectedGoldenBoot] = useState('');
  const [outrightStake, setOutrightStake] = useState(100);
  const [championBetPlaced, setChampionBetPlaced] = useState(false);
  const [goldenBootBetPlaced, setGoldenBootBetPlaced] = useState(false);

  // Live Match Events Feed
  const [eventLog, setEventLog] = useState([
    { id: 1, text: "📢 World Cup Group Stage Matchday 2 is fully underway!", time: "11:22 AM" },
    { id: 2, text: "🏟️ Match 1: USA vs Italy has kicked off at MetLife Stadium.", time: "74 mins ago" },
    { id: 3, text: "🏟️ Match 2: Mexico vs Germany has kicked off at Azteca Stadium.", time: "12 mins ago" },
  ]);

  // Matches list: USA vs Italy is live near end; Mexico vs Germany is live near start
  const [matches, setMatches] = useState([
    {
      id: 101,
      group: 'Group A',
      teamHome: 'USA',
      codeHome: 'us',
      flagHome: '🇺🇸',
      teamAway: 'Italy',
      codeAway: 'it',
      flagAway: '🇮🇹',
      status: 'LIVE',
      minute: 74,
      scoreHome: 1,
      scoreAway: 1,
      oddsHome: 2.80,
      oddsDraw: 3.10,
      oddsAway: 2.10,
      predicted: null, // 'Home' | 'Away' | 'Draw'
      predictedStake: 0,
    },
    {
      id: 102,
      group: 'Group A',
      teamHome: 'Mexico',
      codeHome: 'mx',
      flagHome: '🇲🇽',
      teamAway: 'Germany',
      codeAway: 'de',
      flagAway: '🇩🇪',
      status: 'LIVE',
      minute: 12,
      scoreHome: 0,
      scoreAway: 0,
      oddsHome: 3.20,
      oddsDraw: 3.40,
      oddsAway: 1.85,
      predicted: null,
      predictedStake: 0,
    },
    {
      id: 103,
      group: 'Group B',
      teamHome: 'Argentina',
      codeHome: 'ar',
      flagHome: '🇦🇷',
      teamAway: 'Netherlands',
      codeAway: 'nl',
      flagAway: '🇳🇱',
      status: 'TOMORROW',
      time: '15:00 UTC',
      scoreHome: null,
      scoreAway: null,
      oddsHome: 1.95,
      oddsDraw: 3.25,
      oddsAway: 3.50,
      predicted: null,
      predictedStake: 0,
    },
    {
      id: 104,
      group: 'Group B',
      teamHome: 'Canada',
      codeHome: 'ca',
      flagHome: '🇨🇦',
      teamAway: 'France',
      codeAway: 'fr',
      flagAway: '🇫🇷',
      status: 'TOMORROW',
      time: '20:00 UTC',
      scoreHome: null,
      scoreAway: null,
      oddsHome: 4.50,
      oddsDraw: 3.80,
      oddsAway: 1.55,
      predicted: null,
      predictedStake: 0,
    },
  ]);

  // Outright Predictions Pool
  const championCandidates = [
    { country: 'France', code: 'fr', flag: '🇫🇷', odds: 4.5 },
    { country: 'Brazil', code: 'br', flag: '🇧🇷', odds: 5.0 },
    { country: 'Spain', code: 'es', flag: '🇪🇸', odds: 6.0 },
    { country: 'Argentina', code: 'ar', flag: '🇦🇷', odds: 6.5 },
    { country: 'England', code: 'gb', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', odds: 7.0 },
    { country: 'Germany', code: 'de', flag: '🇩🇪', odds: 8.5 },
  ];

  const goldenBootCandidates = [
    { player: 'Kylian Mbappé', country: 'France', code: 'fr', flag: '🇫🇷', odds: 4.0 },
    { player: 'Erling Haaland', country: 'Norway', code: 'no', flag: '🇳🇴', odds: 5.5 },
    { player: 'Vinícius Jr.', country: 'Brazil', code: 'br', flag: '🇧🇷', odds: 7.0 },
    { player: 'Jude Bellingham', country: 'England', code: 'gb', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', odds: 9.0 },
    { player: 'Harry Kane', country: 'England', code: 'gb', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', odds: 10.0 },
  ];

  // Group Standings Mock Data
  const groupsStandings = {
    'Group A': [
      { rank: 1, team: 'Italy', code: 'it', flag: '🇮🇹', p: 1, w: 1, d: 0, l: 0, gd: '+2', pts: 3 },
      { rank: 2, team: 'USA', code: 'us', flag: '🇺🇸', p: 1, w: 0, d: 1, l: 0, gd: '0', pts: 1 },
      { rank: 3, team: 'Germany', code: 'de', flag: '🇩🇪', p: 1, w: 0, d: 1, l: 0, gd: '0', pts: 1 },
      { rank: 4, team: 'Mexico', code: 'mx', flag: '🇲🇽', p: 1, w: 0, d: 0, l: 1, gd: '-2', pts: 0 },
    ],
    'Group B': [
      { rank: 1, team: 'France', code: 'fr', flag: '🇫🇷', p: 1, w: 1, d: 0, l: 0, gd: '+3', pts: 3 },
      { rank: 2, team: 'Argentina', code: 'ar', flag: '🇦🇷', p: 1, w: 1, d: 0, l: 0, gd: '+1', pts: 3 },
      { rank: 3, team: 'Netherlands', code: 'nl', flag: '🇳🇱', p: 1, w: 0, d: 0, l: 1, gd: '-1', pts: 0 },
      { rank: 4, team: 'Canada', code: 'ca', flag: '🇨🇦', p: 1, w: 0, d: 0, l: 1, gd: '-3', pts: 0 },
    ],
  };

  function addLogEvent(text) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEventLog((prev) => [{ id: Date.now() + Math.random(), text, time: timeStr }, ...prev.slice(0, 19)]);
  }

  function getRandomScorer(team) {
    const scorers = {
      USA: ['Pulisic', 'Weah', 'Balogun', 'McKennie', 'Musah'],
      Italy: ['Chiesa', 'Retegui', 'Barella', 'Pellegrini', 'Dimarco'],
      Mexico: ['Gimenez', 'Quiñones', 'Lozano', 'Chavez', 'Alvarez'],
      Germany: ['Musiala', 'Wirtz', 'Havertz', 'Füllkrug', 'Gündogan'],
    };
    const list = scorers[team] || ['Striker', 'Midfielder', 'Winger'];
    return list[Math.floor(Math.random() * list.length)];
  }

  // Match event generator and clock incrementer
  useEffect(() => {
    const interval = setInterval(() => {
      let resolvedBets = [];
      let logEvents = [];
      let goalToasts = [];

      setMatches((prevMatches) => {
        const nextMatches = prevMatches.map((match) => {
          if (match.status !== 'LIVE') return match;

          // Increment minutes
          const nextMinute = match.minute + 1;
          
          if (nextMinute > 90) {
            // Match Finished!
            const finalStatus = 'FINISHED';
            
            // Log completion
            const finishText = `🏁 Full Time: ${match.flagHome} ${match.teamHome} ${match.scoreHome} - ${match.scoreAway} ${match.teamAway} ${match.flagAway}`;
            logEvents.push(finishText);

            // Resolve bet
            if (match.predicted) {
              let winner = 'Draw';
              if (match.scoreHome > match.scoreAway) winner = 'Home';
              if (match.scoreAway > match.scoreHome) winner = 'Away';

              const oddsMap = {
                Home: match.oddsHome,
                Draw: match.oddsDraw,
                Away: match.oddsAway,
              };

              resolvedBets.push({
                matchId: match.id,
                predicted: match.predicted,
                predictedStake: match.predictedStake,
                winner,
                odds: oddsMap[winner],
                teamHome: match.teamHome,
                teamAway: match.teamAway,
                flagHome: match.flagHome,
                flagAway: match.flagAway,
              });
            }

            return {
              ...match,
              status: finalStatus,
              minute: 90,
            };
          }

          // Random simulation events
          const rand = Math.random();
          let scoreHomeUpdate = match.scoreHome;
          let scoreAwayUpdate = match.scoreAway;

          if (rand < 0.04) {
            // Home Goal
            scoreHomeUpdate += 1;
            const scorer = getRandomScorer(match.teamHome);
            const goalText = `⚽ GOAL! ${match.flagHome} ${match.teamHome} ${scoreHomeUpdate} - ${scoreAwayUpdate} ${match.teamAway} ${match.flagAway} (${nextMinute}') - Scored by ${scorer}!`;
            logEvents.push(goalText);
            goalToasts.push(`🥅 GOAL! ${match.teamHome} scores against ${match.teamAway}! (${nextMinute}')`);
          } else if (rand < 0.08) {
            // Away Goal
            scoreAwayUpdate += 1;
            const scorer = getRandomScorer(match.teamAway);
            const goalText = `⚽ GOAL! ${match.flagHome} ${match.teamHome} ${scoreHomeUpdate} - ${scoreAwayUpdate} ${match.teamAway} ${match.flagAway} (${nextMinute}') - Scored by ${scorer}!`;
            logEvents.push(goalText);
            goalToasts.push(`🥅 GOAL! ${match.teamAway} scores against ${match.teamHome}! (${nextMinute}')`);
          } else if (rand < 0.12) {
            // Yellow Card
            const cardPlayer = getRandomScorer(Math.random() > 0.5 ? match.teamHome : match.teamAway);
            const cardText = `🟨 Yellow Card: ${cardPlayer} (${nextMinute}')`;
            logEvents.push(cardText);
          } else if (rand < 0.13) {
            // Corner kick / Danger play
            const dangerText = `🔥 Dangerous free kick opportunity for ${Math.random() > 0.5 ? match.teamHome : match.teamAway}! (${nextMinute}')`;
            logEvents.push(dangerText);
          }

          return {
            ...match,
            minute: nextMinute,
            scoreHome: scoreHomeUpdate,
            scoreAway: scoreAwayUpdate,
          };
        });

        // Trigger side-effects outside of state updater callback
        if (resolvedBets.length > 0 || logEvents.length > 0 || goalToasts.length > 0) {
          setTimeout(() => {
            logEvents.forEach((text) => addLogEvent(text));
            goalToasts.forEach((text) => showToast(text));
            resolvedBets.forEach((bet) => {
              if (bet.predicted === bet.winner) {
                const prize = Math.floor(bet.predictedStake * bet.odds);
                setBalance((prev) => prev + prize);
                showToast(`🏆 Bet Won! ${bet.teamHome} vs ${bet.teamAway} resolved: You earned +${prize} PCOIN!`);
                
                // Add success card to feed
                const feedWinnerCard = {
                  id: Date.now() + bet.matchId,
                  user: { name: user.username || 'Predictor', avatar: '🏆' },
                  category: 'Sports',
                  categoryColor: 'from-yellow-400 to-amber-500',
                  title: `🎉 WON BET: Correctly predicted ${bet.winner === 'Draw' ? 'Draw' : bet.winner === 'Home' ? bet.teamHome : bet.teamAway} on ${bet.teamHome} vs ${bet.teamAway}! Received ${prize} PCOIN.`,
                  confidence: 100,
                  streak: 2,
                  likes: 54,
                  comments: 11,
                  timeAgo: 'Just now',
                  stake: bet.predictedStake,
                  isUserOwned: true,
                };
                setPredictionsList((prev) => [feedWinnerCard, ...prev]);
              } else {
                showToast(`😢 Bet Lost! ${bet.teamHome} vs ${bet.teamAway} resolved. Lost ${bet.predictedStake} PCOIN stake.`);
              }
            });
          }, 0);
        }

        return nextMatches;
      });
    }, 5000); // 5 seconds = 1 minute of match time

    return () => clearInterval(interval);
  }, [setBalance, showToast, user, setPredictionsList]);

  const handleOpenBet = (match, outcome) => {
    if (match.predicted) {
      showToast("❌ You have already predicted this match!");
      return;
    }
    setBettingMatch(match);
    setSelectedOutcome(outcome);
  };

  const handlePlaceBet = (e) => {
    e.preventDefault();
    // If not logged in and free predictions exhausted, block
    if (!user.loggedIn && !canPredictFree) {
      showToast("🔑 You've used all 5 free predictions! Please sign up to continue.");
      setBettingMatch(null);
      const el = document.querySelector('#waitlist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (betStake <= 0) {
      showToast("❌ Please specify a valid stake amount!");
      return;
    }

    if (balance < betStake) {
      showToast("❌ Insufficient PCOIN balance!");
      return;
    }

    // Deduct Balance
    setBalance((prev) => prev - betStake);

    // Increment free prediction counter if not logged in
    if (!user.loggedIn) {
      setFreePredictionsUsed((prev) => prev + 1);
    }

    // Update Match Object
    setMatches((prevMatches) =>
      prevMatches.map((m) =>
        m.id === bettingMatch.id
          ? { ...m, predicted: selectedOutcome, predictedStake: betStake }
          : m
      )
    );

    // Create Prediction description
    const predictedText =
      selectedOutcome === 'Home'
        ? `${bettingMatch.teamHome} to win`
        : selectedOutcome === 'Away'
        ? `${bettingMatch.teamAway} to win`
        : `Draw between ${bettingMatch.teamHome} and ${bettingMatch.teamAway}`;

    const newPred = {
      id: Date.now(),
      user: { name: user.loggedIn ? user.username : 'Guest Predictor', avatar: '⚽' },
      category: 'Sports',
      categoryColor: 'from-green-400 to-emerald-500',
      title: `🏆 FIFA World Cup: Staked ${betStake} PCOIN on ${predictedText}`,
      confidence: 75,
      streak: 1,
      likes: 12,
      comments: 2,
      timeAgo: 'Just now',
      stake: betStake,
      isUserOwned: true,
    };

    setPredictionsList((prev) => [newPred, ...prev]);

    if (!user.loggedIn) {
      const remaining = freeRemaining - 1;
      showToast(`🏆 Bet placed: ${predictedText} for ${betStake} PCOINS! (${remaining} free left)`);
    } else {
      showToast(`🏆 Bet placed: ${predictedText} for ${betStake} PCOINS!`);
    }
    setBettingMatch(null);
  };

  const handlePlaceChampionBet = () => {
    if (!user.loggedIn && !canPredictFree) {
      showToast("🔑 You've used all 5 free predictions! Please sign up to continue.");
      const el = document.querySelector('#waitlist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!selectedChampion) {
      showToast("❌ Select a champion country first!");
      return;
    }
    if (balance < outrightStake) {
      showToast("❌ Insufficient PCOIN balance!");
      return;
    }

    setBalance((prev) => prev - outrightStake);
    setChampionBetPlaced(true);

    if (!user.loggedIn) {
      setFreePredictionsUsed((prev) => prev + 1);
    }

    const newPred = {
      id: Date.now(),
      user: { name: user.loggedIn ? user.username : 'Guest Predictor', avatar: '🏆' },
      category: 'Sports',
      categoryColor: 'from-green-400 to-emerald-500',
      title: `🏆 Outright: Staked ${outrightStake} PCOIN on ${selectedChampion} to win the FIFA World Cup 2026`,
      confidence: 85,
      streak: 1,
      likes: 24,
      comments: 4,
      timeAgo: 'Just now',
      stake: outrightStake,
      isUserOwned: true,
    };

    setPredictionsList((prev) => [newPred, ...prev]);
    if (!user.loggedIn) {
      showToast(`🔮 Placed: ${selectedChampion} to win the World Cup! (${freeRemaining - 1} free left)`);
    } else {
      showToast(`🔮 Placed: ${selectedChampion} to win the World Cup!`);
    }
  };

  const handlePlaceGoldenBootBet = () => {
    if (!user.loggedIn && !canPredictFree) {
      showToast("🔑 You've used all 5 free predictions! Please sign up to continue.");
      const el = document.querySelector('#waitlist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!selectedGoldenBoot) {
      showToast("❌ Select a player first!");
      return;
    }
    if (balance < outrightStake) {
      showToast("❌ Insufficient PCOIN balance!");
      return;
    }

    setBalance((prev) => prev - outrightStake);
    setGoldenBootBetPlaced(true);

    if (!user.loggedIn) {
      setFreePredictionsUsed((prev) => prev + 1);
    }

    const newPred = {
      id: Date.now(),
      user: { name: user.loggedIn ? user.username : 'Guest Predictor', avatar: '👟' },
      category: 'Sports',
      categoryColor: 'from-green-400 to-emerald-500',
      title: `🏆 Golden Boot: Staked ${outrightStake} PCOIN on ${selectedGoldenBoot} to win the FIFA World Cup Golden Boot`,
      confidence: 80,
      streak: 1,
      likes: 19,
      comments: 3,
      timeAgo: 'Just now',
      stake: outrightStake,
      isUserOwned: true,
    };

    setPredictionsList((prev) => [newPred, ...prev]);
    if (!user.loggedIn) {
      showToast(`🔮 Placed: ${selectedGoldenBoot} to win Golden Boot! (${freeRemaining - 1} free left)`);
    } else {
      showToast(`🔮 Placed: ${selectedGoldenBoot} to win Golden Boot!`);
    }
  };

  return (
    <section id="worldcup" className="relative section-padding overflow-hidden bg-dark-800/40 border-t border-b border-white/5">
      <div className="blob-cyan -bottom-20 left-10 opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 text-sm border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-xs">Live Match Update System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            FIFA <span className="text-emerald-400">World Cup 2026</span> Hub
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            The World Cup is running live! Keep an eye on live scores below — they update dynamically in real time. Place predictions and collect your payouts automatically when the clock hits 90'!
          </p>
        </div>

        {/* Layout Grid: Left Tab content, Right Live commentary stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Tournament Tabbed Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Controls — padded to 44px on mobile */}
            <div className="flex mb-4">
              <div className="glass p-1 rounded-xl flex gap-1 border border-white/5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'matches'
                      ? 'bg-emerald-500 text-dark-900 shadow-lg font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  📅 Matches & Odds
                </button>
                <button
                  onClick={() => setActiveTab('outrights')}
                  className={`flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'outrights'
                      ? 'bg-emerald-500 text-dark-900 shadow-lg font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  👑 Outrights
                </button>
                <button
                  onClick={() => setActiveTab('standings')}
                  className={`flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'standings'
                      ? 'bg-emerald-500 text-dark-900 shadow-lg font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  📊 Standings
                </button>
              </div>
            </div>

            {/* Tab Contents: Matches */}
            {activeTab === 'matches' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <div key={match.id} className="glass rounded-2xl p-5 border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col justify-between hover:border-emerald-500/35 transition-all duration-300">
                    <div>
                      {/* Status header */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{match.group}</span>
                        {match.status === 'LIVE' ? (
                          <span className="bg-red-500/15 text-red-500 border border-red-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                            LIVE - {match.minute}'
                          </span>
                        ) : match.status === 'FINISHED' ? (
                          <span className="bg-slate-500/15 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            FINISHED
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                            {match.status} {match.time && `• ${match.time}`}
                          </span>
                        )}
                      </div>

                      {/* Teams Score Area */}
                      <div className="flex items-center justify-between my-4 px-2">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                          <img
                            src={`https://flagcdn.com/w80/${match.codeHome}.png`}
                            alt={match.teamHome}
                            className="w-11 h-7 object-cover rounded shadow border border-white/10 filter drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                          <span className="font-bold text-white tracking-wide text-xs sm:text-sm">{match.teamHome}</span>
                        </div>

                        {/* Score / VS Display */}
                        <div className="flex flex-col items-center gap-1 w-1/3">
                          {match.scoreHome !== null ? (
                            <div className="flex gap-2.5 text-xl sm:text-2xl font-black text-white bg-dark-900/50 px-3.5 py-1 rounded-xl border border-white/5 font-mono">
                              <span>{match.scoreHome}</span>
                              <span className="text-slate-600">:</span>
                              <span>{match.scoreAway}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold bg-dark-900/50 px-3 py-1 rounded-xl border border-white/5 tracking-wider">VS</span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                          <img
                            src={`https://flagcdn.com/w80/${match.codeAway}.png`}
                            alt={match.teamAway}
                            className="w-11 h-7 object-cover rounded shadow border border-white/10 filter drop-shadow-sm transition-transform group-hover:scale-105"
                          />
                          <span className="font-bold text-white tracking-wide text-xs sm:text-sm">{match.teamAway}</span>
                        </div>
                      </div>
                    </div>

                    {/* Betting Options — padded to 44px touch height on mobile */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[10px] text-slate-500 font-semibold mb-2">Outcome Odds:</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => handleOpenBet(match, 'Home')}
                          disabled={match.status !== 'LIVE' || !!match.predicted}
                          className={`py-3 sm:py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                            match.predicted === 'Home'
                              ? 'bg-emerald-500 text-dark-900 scale-95 shadow-inner'
                              : match.status !== 'LIVE'
                              ? 'bg-dark-900/20 text-slate-600 border border-white/5 cursor-not-allowed'
                              : 'bg-dark-900/60 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20'
                          }`}
                        >
                          <span className="text-[10px] opacity-75 font-medium truncate max-w-full">1</span>
                          <span className="text-emerald-400 font-mono font-extrabold">{match.oddsHome.toFixed(2)}</span>
                        </button>
                        <button
                          onClick={() => handleOpenBet(match, 'Draw')}
                          disabled={match.status !== 'LIVE' || !!match.predicted}
                          className={`py-3 sm:py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                            match.predicted === 'Draw'
                              ? 'bg-emerald-500 text-dark-900 scale-95 shadow-inner'
                              : match.status !== 'LIVE'
                              ? 'bg-dark-900/20 text-slate-600 border border-white/5 cursor-not-allowed'
                              : 'bg-dark-900/60 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20'
                          }`}
                        >
                          <span className="text-[10px] opacity-75 font-medium">X</span>
                          <span className="text-emerald-400 font-mono font-extrabold">{match.oddsDraw.toFixed(2)}</span>
                        </button>
                        <button
                          onClick={() => handleOpenBet(match, 'Away')}
                          disabled={match.status !== 'LIVE' || !!match.predicted}
                          className={`py-3 sm:py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                            match.predicted === 'Away'
                              ? 'bg-emerald-500 text-dark-900 scale-95 shadow-inner'
                              : match.status !== 'LIVE'
                              ? 'bg-dark-900/20 text-slate-600 border border-white/5 cursor-not-allowed'
                              : 'bg-dark-900/60 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20'
                          }`}
                        >
                          <span className="text-[10px] opacity-75 font-medium truncate max-w-full">2</span>
                          <span className="text-emerald-400 font-mono font-extrabold">{match.oddsAway.toFixed(2)}</span>
                        </button>
                      </div>

                      {match.predicted && (
                        <div className="mt-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 flex items-center justify-between text-[11px] text-emerald-400">
                          <span className="font-semibold">🔮 Predicted: {match.predicted === 'Home' ? match.teamHome : match.predicted === 'Away' ? match.teamAway : 'Draw'}</span>
                          <span className="font-bold">🪙 {match.predictedStake} PCOIN</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Contents: Outrights */}
            {activeTab === 'outrights' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Predict Champion Outright */}
                <div className="glass rounded-2xl p-5 border border-white/5">
                  <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                    <span>🏆</span> Predict World Cup Winner
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4">Lock in your outright prediction for the champion.</p>
                  
                  <div className="space-y-1.5 mb-4 max-h-52 overflow-y-auto pr-1">
                    {championCandidates.map((c) => (
                      <button
                        key={c.country}
                        onClick={() => !championBetPlaced && setSelectedChampion(c.country)}
                        disabled={championBetPlaced}
                        className={`w-full flex items-center justify-between py-3 px-2.5 sm:p-2 rounded-lg border text-xs font-bold transition-all ${
                          selectedChampion === c.country
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : 'bg-dark-900/40 border-white/5 hover:border-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/w40/${c.code}.png`}
                            alt={c.country}
                            className="w-6 h-4 object-cover rounded border border-white/10 shadow-sm"
                          />
                          <span>{c.country}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">odds {c.odds.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>

                  {championBetPlaced ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-center font-bold text-xs">
                      🔮 Picked: {selectedChampion} • 🪙 {outrightStake} PCOIN Locked
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 glass px-2 py-1.5 rounded-lg border border-white/5">
                        <span className="text-[9px] text-slate-500 font-bold">STAKE</span>
                        <input
                          type="number"
                          value={outrightStake}
                          onChange={(e) => setOutrightStake(Math.max(1, parseInt(e.target.value) || 0))}
                          className="bg-transparent text-white font-bold text-xs focus:outline-none w-12 text-center"
                        />
                      </div>
                      <button
                        onClick={handlePlaceChampionBet}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold py-3 sm:py-2 px-3 rounded-lg text-xs transition-all"
                      >
                        Place Bet
                      </button>
                    </div>
                  )}
                </div>

                {/* Predict Golden Boot Outright */}
                <div className="glass rounded-2xl p-5 border border-white/5">
                  <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                    <span>👟</span> Golden Boot Top Scorer
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4">Predict the individual top goalscorer.</p>

                  <div className="space-y-1.5 mb-4 max-h-52 overflow-y-auto pr-1">
                    {goldenBootCandidates.map((gb) => (
                      <button
                        key={gb.player}
                        onClick={() => !goldenBootBetPlaced && setSelectedGoldenBoot(gb.player)}
                        disabled={goldenBootBetPlaced}
                        className={`w-full flex items-center justify-between py-3 px-2.5 sm:p-2 rounded-lg border text-xs font-bold transition-all ${
                          selectedGoldenBoot === gb.player
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : 'bg-dark-900/40 border-white/5 hover:border-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/w40/${gb.code}.png`}
                            alt={gb.country}
                            className="w-6 h-4 object-cover rounded border border-white/10 shadow-sm"
                          />
                          <div className="text-left">
                            <p className="font-bold text-white text-xs">{gb.player}</p>
                            <p className="text-[9px] text-slate-500">{gb.country}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">odds {gb.odds.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>

                  {goldenBootBetPlaced ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-center font-bold text-xs">
                      🔮 Picked: {selectedGoldenBoot} • 🪙 {outrightStake} PCOIN Locked
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 glass px-2 py-1.5 rounded-lg border border-white/5">
                        <span className="text-[9px] text-slate-500 font-bold">STAKE</span>
                        <input
                          type="number"
                          value={outrightStake}
                          onChange={(e) => setOutrightStake(Math.max(1, parseInt(e.target.value) || 0))}
                          className="bg-transparent text-white font-bold text-xs focus:outline-none w-12 text-center"
                        />
                      </div>
                      <button
                        onClick={handlePlaceGoldenBootBet}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold py-3 sm:py-2 px-3 rounded-lg text-xs transition-all"
                      >
                        Place Bet
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab Contents: Standings */}
            {activeTab === 'standings' && (
              <div className="glass rounded-2xl p-5 border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
                {/* Group stand switch */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white">Group Stage Standings</h3>
                  <div className="flex gap-1.5">
                    {['Group A', 'Group B'].map((grp) => (
                      <button
                        key={grp}
                        onClick={() => setActiveGroup(grp)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          activeGroup === grp
                            ? 'bg-emerald-500/15 border border-emerald-500 text-emerald-400'
                            : 'bg-dark-900/60 border border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {grp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Standings Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
                        <th className="pb-2 pl-2">Pos</th>
                        <th className="pb-2 pl-2">Team</th>
                        <th className="pb-2 text-center">P</th>
                        <th className="pb-2 text-center">W</th>
                        <th className="pb-2 text-center">D</th>
                        <th className="pb-2 text-center">L</th>
                        <th className="pb-2 text-center">GD</th>
                        <th className="pb-2 pr-2 text-right">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs font-medium">
                      {groupsStandings[activeGroup].map((row) => (
                        <tr key={row.team} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 pl-2 font-mono font-bold text-slate-400">{row.rank}</td>
                          <td className="py-2 pl-2 flex items-center gap-2 font-bold text-white">
                            <img
                              src={`https://flagcdn.com/w40/${row.code}.png`}
                              alt={row.team}
                              className="w-5.5 h-4 object-cover rounded border border-white/10 shadow-sm"
                            />
                            {row.team}
                          </td>
                          <td className="py-2 text-center text-slate-300 font-mono">{row.p}</td>
                          <td className="py-2 text-center text-slate-300 font-mono">{row.w}</td>
                          <td className="py-2 text-center text-slate-300 font-mono">{row.d}</td>
                          <td className="py-2 text-center text-slate-300 font-mono">{row.l}</td>
                          <td className={`py-2 text-center font-mono font-semibold ${row.gd.startsWith('+') ? 'text-green-400' : row.gd === '0' ? 'text-slate-400' : 'text-red-400'}`}>{row.gd}</td>
                          <td className="py-2 pr-2 text-right font-mono font-black text-emerald-400">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live Commentary Event Log Stream */}
          <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col h-[420px] justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Live Match Feed</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-bold font-mono">TICKER CLOCK</span>
              </div>
              
              {/* Event Scroller */}
              <div className="space-y-3.5 overflow-y-auto max-h-[300px] pr-1.5 scrollbar-thin">
                {eventLog.map((log) => (
                  <div key={log.id} className="text-xs border-l-2 border-emerald-500/40 pl-3 py-0.5 animate-fade-in-up">
                    <p className="text-white font-medium leading-relaxed">{log.text}</p>
                    <span className="text-[9px] text-slate-500 font-mono font-semibold">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-dark-900/50 rounded-xl px-3 py-2 text-[10px] text-slate-500 border border-white/5 text-center font-semibold">
              🔄 Live commentary updates automatically every few seconds.
            </div>
          </div>

        </div>

      </div>

      {/* Stake Modal Overlay */}
      {bettingMatch && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass rounded-3xl p-6 border border-emerald-500/20 max-w-md w-full animate-fade-in-up max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Confirm Prediction</span>
                <h4 className="text-lg font-black text-white mt-1">Place Match Prediction</h4>
              </div>
              <button
                onClick={() => setBettingMatch(null)}
                className="text-slate-500 hover:text-white transition-colors p-2.5 -m-2.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-dark-900/50 rounded-2xl p-4 border border-white/5 mb-5 text-sm">
              <div className="flex justify-between font-semibold text-slate-400 mb-2">
                <span>Match:</span>
                <span className="text-white">{bettingMatch.teamHome} vs {bettingMatch.teamAway}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-400 mb-2">
                <span>Your Pick:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedOutcome === 'Home'
                    ? `${bettingMatch.teamHome} Wins`
                    : selectedOutcome === 'Away'
                    ? `${bettingMatch.teamAway} Wins`
                    : 'Draw'}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-400">
                <span>Odds:</span>
                <span className="text-white font-mono font-bold">
                  {selectedOutcome === 'Home'
                    ? bettingMatch.oddsHome.toFixed(2)
                    : selectedOutcome === 'Away'
                    ? bettingMatch.oddsAway.toFixed(2)
                    : bettingMatch.oddsDraw.toFixed(2)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePlaceBet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stake (PCOIN)</label>
                <div className="flex gap-2 mb-3">
                  {[50, 100, 200, 500].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setBetStake(amt)}
                      className={`flex-1 py-3 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                        betStake === amt
                          ? 'bg-emerald-500 text-dark-900'
                          : 'bg-dark-900/60 border border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">🪙</span>
                  <input
                    type="number"
                    value={betStake}
                    onChange={(e) => setBetStake(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full glass bg-dark-900/40 rounded-xl py-3 pl-9 pr-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter custom stake"
                    min="1"
                    required
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
                  <span>Your Balance: 🪙{balance}</span>
                  <span>Est. Return: 🪙{Math.floor(betStake * (selectedOutcome === 'Home' ? bettingMatch.oddsHome : selectedOutcome === 'Away' ? bettingMatch.oddsAway : bettingMatch.oddsDraw))}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBettingMatch(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/10"
                >
                  Confirm Prediction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
