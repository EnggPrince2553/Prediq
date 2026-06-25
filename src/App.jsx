/* global gtag */
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveFeed from './components/LiveFeed';
import Features from './components/Features';
import ProofCam from './components/ProofCam';
import Communities from './components/Communities';
import Leaderboard from './components/Leaderboard';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';
import FifaWorldCup from './components/FifaWorldCup';
import { predictions as initialPredictions } from './data/mockData';

function App() {
  // Global States
  const [user, setUser] = useState({ loggedIn: false, username: '', email: '' });
  const [balance, setBalance] = useState(5000);
  const [predictionsList, setPredictionsList] = useState(initialPredictions);
  const [likedCards, setLikedCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [freePredictionsUsed, setFreePredictionsUsed] = useState(0);
  const FREE_PREDICTION_LIMIT = 5;

  // Scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      section.classList.add('scroll-animate');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // GA tracking logic preserved
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'Prediq Landing Page',
        page_location: window.location.href,
      });
    }
  }, []);

  // Helper to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Sync predictions from backend DB
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/predictions');
        if (res.ok) {
          const dbPreds = await res.json();
          const mappedDbPreds = dbPreds.map((pred) => ({
            id: pred._id,
            user: { name: pred.username, avatar: '👤' },
            category: pred.category,
            categoryColor: pred.categoryColor,
            title: pred.title,
            confidence: pred.confidence,
            streak: 0,
            likes: pred.likes || 0,
            comments: pred.comments || 0,
            timeAgo: pred.createdAt ? formatTimeAgo(new Date(pred.createdAt)) : 'Just now',
            stake: pred.stake,
            isUserOwned: user.loggedIn && pred.username === user.username,
            resolved: pred.resolved,
            result: pred.result,
          }));

          const filteredMocks = initialPredictions.filter(
            (mock) => !mappedDbPreds.some((db) => db.title === mock.title)
          );
          setPredictionsList([...mappedDbPreds, ...filteredMocks]);
        }
      } catch (err) {
        console.error('Failed to sync predictions feed:', err);
      }
    };
    fetchPredictions();
  }, [user.loggedIn, user.username]);

  // Load user session and sync balance from backend
  useEffect(() => {
    const localSession = localStorage.getItem('prediq_user');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        if (parsed.username) {
          fetch(`http://localhost:5000/api/users/${parsed.username}`)
            .then((res) => {
              if (res.ok) return res.json();
              throw new Error('User sync failed');
            })
            .then((dbUser) => {
              setUser({ loggedIn: true, username: dbUser.username, email: dbUser.email });
              setBalance(dbUser.balance);
            })
            .catch(() => {
              localStorage.removeItem('prediq_user');
            });
        }
      } catch (err) {
        console.error('Error parsing local user session:', err);
      }
    }
  }, []);

  // Sync prediction likes to backend DB
  const handleLike = async (id) => {
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));

    if (typeof id === 'string' && id.length === 24) {
      try {
        await fetch(`http://localhost:5000/api/predictions/${id}/like`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Failed to sync like:', err);
      }
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      const btn = e.target.closest('a, button');
      if (!btn) return;

      const label =
        btn.textContent?.trim().substring(0, 50) ||
        btn.getAttribute('aria-label') ||
        'unknown';

      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: label,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Toast helper
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Award Coins (ProofCam check-in reward)
  const awardCoins = (amount, msg) => {
    setBalance((prev) => prev + amount);
    showToast(msg || `🎉 +${amount} PCOIN Earned!`);
  };

  // Register user from WaitlistForm
  const logInUser = (dbUser) => {
    setUser({ loggedIn: true, username: dbUser.username, email: dbUser.email });
    setBalance(dbUser.balance);
    localStorage.setItem('prediq_user', JSON.stringify({ username: dbUser.username, email: dbUser.email }));
    showToast(`Welcome @${dbUser.username}! Loaded your balance of ${dbUser.balance.toLocaleString()} PCOIN. 🚀`);
  };

  // Handle new prediction creation
  const handleCreatePrediction = async (predictionData) => {
    if (!user.loggedIn) {
      showToast("🔒 Please sign up / log in to place predictions!");
      return;
    }

    if (balance < predictionData.stake) {
      showToast("❌ Insufficient PCOIN balance!");
      return;
    }

    const categoryGradients = {
      Crypto: 'from-yellow-500 to-orange-500',
      Sports: 'from-green-400 to-emerald-500',
      Fitness: 'from-pink-500 to-rose-500',
      Startups: 'from-blue-400 to-indigo-500',
      Entertainment: 'from-purple-400 to-fuchsia-500',
      Tech: 'from-cyan-400 to-blue-500',
    };

    try {
      const res = await fetch('http://localhost:5000/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          category: predictionData.category,
          categoryColor: categoryGradients[predictionData.category] || 'from-emerald-400 to-green-500',
          title: predictionData.title,
          confidence: parseInt(predictionData.confidence),
          stake: parseInt(predictionData.stake),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to create prediction');
      }

      const result = await res.json();
      const newPred = {
        id: result.prediction._id,
        user: { name: user.username, avatar: '👤' },
        category: result.prediction.category,
        categoryColor: result.prediction.categoryColor,
        title: result.prediction.title,
        confidence: result.prediction.confidence,
        streak: 0,
        likes: 0,
        comments: 0,
        timeAgo: 'Just now',
        stake: result.prediction.stake,
        isUserOwned: true,
      };

      setPredictionsList((prev) => [newPred, ...prev]);
      setBalance(result.user.balance);
      setIsModalOpen(false);
      showToast(`🔮 Prediction created! Staked ${predictionData.stake} PCOIN.`);
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  // Resolve prediction (Win/Loss)
  const resolvePrediction = async (id, won) => {
    // If it's a mock prediction (numeric ID from Date.now), resolve client-side only
    if (typeof id === 'number') {
      const pred = predictionsList.find((p) => p.id === id);
      if (!pred) return;
      if (won) {
        const reward = pred.stake * 2;
        setBalance((prev) => prev + reward);
        showToast(`🏆 You won! Earned +${reward} PCOIN on prediction.`);
      } else {
        showToast(`😢 Prediction resolved as Loss. Lost ${pred.stake} PCOIN stake.`);
      }
      setPredictionsList((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/predictions/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ won }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to resolve prediction');
      }

      const result = await res.json();
      setBalance(result.user.balance);
      setPredictionsList((prev) => prev.filter((p) => p.id !== id));

      if (won) {
        showToast(`🏆 You won! Earned +${result.prediction.stake * 2} PCOIN.`);
      } else {
        showToast(`😢 Prediction resolved as Loss. Lost ${result.prediction.stake} PCOIN.`);
      }
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  const handleJoinClick = (e) => {
    e?.preventDefault();
    const el = document.querySelector('#waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.querySelector('#waitlist-email');
        if (input) {
          input.focus();
          input.classList.add('ring-2', 'ring-neon-cyan');
          setTimeout(() => input.classList.remove('ring-2', 'ring-neon-cyan'), 1500);
        }
      }, 800);
    }
  };

  const handleClaimClick = (e) => {
    e?.preventDefault();
    const el = document.querySelector('#waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.querySelector('#waitlist-username');
        if (input) {
          input.focus();
          input.classList.add('ring-2', 'ring-neon-cyan');
          setTimeout(() => input.classList.remove('ring-2', 'ring-neon-cyan'), 1500);
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar
        user={user}
        balance={balance}
        openModal={() => setIsModalOpen(true)}
      />
      
      <main>
        <Hero onJoinClick={handleJoinClick} onClaimClick={handleClaimClick} />
        
        <LiveFeed
          predictionsList={predictionsList}
          likedCards={likedCards}
          setLikedCards={setLikedCards}
          resolvePrediction={resolvePrediction}
          user={user}
          onLike={handleLike}
        />
        
        <FifaWorldCup
          balance={balance}
          setBalance={setBalance}
          setPredictionsList={setPredictionsList}
          showToast={showToast}
          user={user}
          freePredictionsUsed={freePredictionsUsed}
          setFreePredictionsUsed={setFreePredictionsUsed}
          freePredictionLimit={FREE_PREDICTION_LIMIT}
        />
        
        <Features />
        
        <ProofCam awardCoins={awardCoins} />
        
        <Communities />
        
        <Leaderboard user={user} balance={balance} />
        
        <WaitlistForm user={user} logInUser={logInUser} />
      </main>
      
      <Footer />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
          <div className="glass px-6 py-4 rounded-2xl border border-neon-cyan/30 shadow-2xl flex items-center gap-3 backdrop-blur-2xl">
            <span className="text-lg">💰</span>
            <p className="text-sm font-semibold text-white">{toast}</p>
          </div>
        </div>
      )}

      {/* Create Prediction Modal */}
      {isModalOpen && (
        <ModalForm
          balance={balance}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePrediction}
        />
      )}
    </div>
  );
}

// Inner Modal Form Component
function ModalForm({ balance, onClose, onSubmit }) {
  const [category, setCategory] = useState('Crypto');
  const [title, setTitle] = useState('');
  const [confidence, setConfidence] = useState(75);
  const [stake, setStake] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (stake > balance) {
      alert("Stake cannot exceed current balance!");
      return;
    }
    onSubmit({ category, title, confidence, stake: parseInt(stake) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Modal card — responsive max-height and overflow scroll to prevent clipping */}
      <div className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl glow-border max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">🔮 Create Prediction</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2.5 -m-2.5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 text-sm"
            >
              <option value="Crypto">Crypto & Finance</option>
              <option value="Sports">Sports</option>
              <option value="Fitness">Fitness & Health</option>
              <option value="Startups">Startups & Tech</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Tech">General Tech</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Your prediction</label>
            <textarea
              required
              rows="3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Apple stock beats market expectations in Q3..."
              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50 text-sm"
            />
          </div>

          {/* Confidence Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidence</label>
              <span className="text-sm font-bold text-neon-cyan">{confidence}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="99"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="w-full accent-neon-cyan bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Stake Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stake Amount (PCOIN)</label>
              <span className="text-xs text-slate-500">Max: {balance} PCOIN</span>
            </div>
            <input
              type="number"
              min="10"
              max={balance}
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              required
              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 text-sm font-semibold"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2"
          >
            🚀 Submit Prediction
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
