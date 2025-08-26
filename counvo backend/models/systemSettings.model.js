// models/systemSettings.model.js
const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  maxUsers: { type: Number, default: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
