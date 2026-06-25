import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  categoryColor: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  stake: {
    type: Number,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  result: {
    type: String,
    enum: ['WON', 'LOST', 'PENDING'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
