// models/FirstChatLog.js
const mongoose = require('mongoose');

const firstChatLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true // ensures one entry per user
  },
  timeToFirstChatMs: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FirstChatLog', firstChatLogSchema);
