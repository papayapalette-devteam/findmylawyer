const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatSessionId: String,
  sender: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    role: String
  },
  message: String,
  messageType: { type: String, enum: ['text', 'file'], default: 'text' },
  fileUrl: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
