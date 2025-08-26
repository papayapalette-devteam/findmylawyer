
const mongoose = require('mongoose');


const consultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  issueDetails: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  chatSessionId: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  paidMinutes: Number,
  totalAmount: Number,
  rating: Number,
  review: String,
}, { timestamps: true });
