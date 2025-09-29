const mongoose = require('mongoose');

const chatTimeSchema = new mongoose.Schema({
  sessionTime: {
    type: Number, // duration in seconds
    default: 0,
  },
  switchTime: {
    type: Number, // duration in seconds since last switch
    default: 0,
  }
});

module.exports = mongoose.model('ChatTime', chatTimeSchema);
