const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'fromModel',
  },
  fromModel: {
    type: String,
    required: true,
    enum: ['User', 'Lawyer'],
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'toModel',
  },
  toModel: {
    type: String,
    required: true,
    enum: ['User', 'Lawyer'],
  },
  message: {
    type: String,
    required: false, // <-- Now optional!
  },
  fileUrl: String,
  fileName: String,
  fileType: String,
    read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
