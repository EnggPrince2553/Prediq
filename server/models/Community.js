import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  members: {
    type: Number,
    default: 0,
  },
  activePredictions: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Community = mongoose.model('Community', communitySchema);
export default Community;
