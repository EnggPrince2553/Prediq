import mongoose from 'mongoose';

const matchBetSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  matchId: {
    type: Number,
    required: true
  },
  teamHome: {
    type: String,
    required: true
  },
  teamAway: {
    type: String,
    required: true
  },
  predictedOutcome: {
    type: String,
    enum: ['Home', 'Away', 'Draw'],
    required: true
  },
  predictedStake: {
    type: Number,
    required: true
  },
  odds: {
    type: Number,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  won: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const MatchBet = mongoose.model('MatchBet', matchBetSchema);
export default MatchBet;
