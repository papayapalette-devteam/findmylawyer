const mongoose = require('mongoose');

const chatTimeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Correct ObjectId type
    ref: 'User', // Name of the User model as a string
    required: true
  },
  sessionTime: {
    type: Number, // duration in seconds
    default: 0,
  },
  switchTime: {
    type: Number, // duration in seconds since last switch
    default: 0,
  }
}, { timestamps: true }); // optional: adds createdAt and updatedAt

module.exports = mongoose.model('ChatTime', chatTimeSchema);
