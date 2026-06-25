import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  balance: {
    type: Number,
    default: 5000
  },
  reputation: {
    type: Number,
    default: 5000
  },
  streak: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 85,
    min: 0,
    max: 100
  },
  badges: {
    type: [String],
    default: ['🏅']
  },
  level: {
    type: String,
    default: 'New Predictor'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
