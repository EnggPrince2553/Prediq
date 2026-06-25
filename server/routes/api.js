import express from 'express';
import User from '../models/User.js';
import Prediction from '../models/Prediction.js';
import MatchBet from '../models/MatchBet.js';
import Waitlist from '../models/Waitlist.js';
import Community from '../models/Community.js';

const router = express.Router();

// 1. Waitlist Join
router.post('/waitlist', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ error: 'Email and username are required' });
    }

    // Check if username/email already in waitlist
    const existingWaitlist = await Waitlist.findOne({ $or: [{ email }, { username }] });
    if (existingWaitlist) {
      return res.status(400).json({ error: 'Email or username already registered' });
    }

    const waitlistEntry = new Waitlist({ email, username });
    await waitlistEntry.save();

    res.status(201).json({ message: 'Successfully registered for waitlist!', data: waitlistEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Auth: Login / Register
router.post('/auth/login-register', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    // Try finding existing user
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      // Create user if not exists
      user = new User({ username, email });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Predictions Feed - Get all predictions
router.get('/predictions', async (req, res) => {
  try {
    const dbPredictions = await Prediction.find().sort({ createdAt: -1 });
    res.status(200).json(dbPredictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Create Prediction
router.post('/predictions', async (req, res) => {
  try {
    const { username, category, categoryColor, title, confidence, stake } = req.body;
    if (!username || !category || !title || !confidence || !stake) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Deduct from user balance
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < stake) {
      return res.status(400).json({ error: 'Insufficient PCOIN balance' });
    }

    user.balance -= stake;
    await user.save();

    const newPred = new Prediction({
      username,
      category,
      categoryColor,
      title,
      confidence,
      stake,
      resolved: false,
      result: 'PENDING'
    });
    await newPred.save();

    res.status(201).json({ prediction: newPred, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Like Prediction
router.post('/predictions/:id/like', async (req, res) => {
  try {
    const pred = await Prediction.findById(req.params.id);
    if (!pred) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    pred.likes += 1;
    await pred.save();

    res.status(200).json(pred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Resolve Prediction
router.post('/predictions/:id/resolve', async (req, res) => {
  try {
    const { won } = req.body;
    const pred = await Prediction.findById(req.params.id);
    if (!pred) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    if (pred.resolved) {
      return res.status(400).json({ error: 'Prediction already resolved' });
    }

    pred.resolved = true;
    pred.result = won ? 'WON' : 'LOST';
    await pred.save();

    const user = await User.findOne({ username: pred.username });
    if (user) {
      if (won) {
        user.balance += pred.stake * 2;
        user.reputation += pred.stake * 5;
        user.streak += 1;
      } else {
        user.streak = 0;
      }
      await user.save();
    }

    res.status(200).json({ prediction: pred, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Place Match Bet
router.post('/bets', async (req, res) => {
  try {
    const { username, matchId, teamHome, teamAway, predictedOutcome, predictedStake, odds } = req.body;
    if (!username || !matchId || !teamHome || !teamAway || !predictedOutcome || !predictedStake || !odds) {
      return res.status(400).json({ error: 'All bet fields are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < predictedStake) {
      return res.status(400).json({ error: 'Insufficient balance for this bet' });
    }

    user.balance -= predictedStake;
    await user.save();

    const bet = new MatchBet({
      username,
      matchId,
      teamHome,
      teamAway,
      predictedOutcome,
      predictedStake,
      odds,
      resolved: false,
      won: false
    });
    await bet.save();

    res.status(201).json({ bet, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Leaderboard — Top users by reputation (must be before /:username)
router.get('/users/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ reputation: -1 })
      .limit(20)
      .lean();

    const leaderboard = users.map((u, idx) => ({
      rank: idx + 1,
      name: `@${u.username}`,
      avatar: '👤',
      reputation: u.reputation || 0,
      accuracy: u.accuracy || 85,
      streak: u.streak || 0,
      balance: u.balance || 0,
      level:
        (u.reputation || 0) >= 8000
          ? 'Expert'
          : (u.reputation || 0) >= 4000
          ? 'Advanced'
          : 'New Predictor',
      levelColor:
        (u.reputation || 0) >= 8000
          ? 'text-cyan-400'
          : (u.reputation || 0) >= 4000
          ? 'text-green-400'
          : 'text-slate-400',
      badges:
        (u.reputation || 0) >= 8000
          ? ['🏆', '🔥', '⭐']
          : (u.reputation || 0) >= 4000
          ? ['🥇', '🔥']
          : ['🏅'],
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Get User Profile Stats
router.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. List Communities (live member counts merged with mock names)
router.get('/communities', async (req, res) => {
  try {
    const dbCommunities = await Community.find().lean();
    res.status(200).json(dbCommunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Join Community (upsert member count)
router.post('/communities/:name/join', async (req, res) => {
  try {
    const communityName = decodeURIComponent(req.params.name);
    const community = await Community.findOneAndUpdate(
      { name: communityName },
      { $inc: { members: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
