const mongoose = require('mongoose');
const config = require('../../config');

// MongoDB Schema (infrastructure concern)
const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true 
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: String
}, {
  timestamps: true
});

// Compound index for common queries
activitySchema.index({ userId: 1, timestamp: -1 });

const ActivityModel = mongoose.model('Activity', activitySchema);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, ActivityModel };