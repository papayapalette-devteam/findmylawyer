const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: mongoose.Schema.Types.ObjectId,
  action: String,
  targetId: mongoose.Schema.Types.ObjectId,
  targetType: String, // e.g. 'Lawyer'
  reason: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
