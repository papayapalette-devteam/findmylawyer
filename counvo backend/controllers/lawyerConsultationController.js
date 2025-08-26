const Consultation = require('../models/Consultation');
const mongoose = require('mongoose');

// GET /api/lawyer/consultations/pending
exports.getPendingConsultations = async (req, res) => {
  try {
    const lawyerId = req.query.lawyerId;

    if (!lawyerId) return res.status(400).json({ error: 'Lawyer ID is required' });

    const consultations = await Consultation.find({
      lawyerId,
      status: 'pending'
    }).populate('userId', 'name email');

    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/lawyer/consultations/:id/accept
exports.acceptConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    consultation.status = 'active';
    consultation.startTime = new Date();
    await consultation.save();

    // Notify client via WebSocket
    const io = req.app.get('io');
    io.to(consultation.userId.toString()).emit('consultation-accepted', consultation);

    res.json({ success: true, message: 'Consultation accepted', consultation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/lawyer/consultations/:id/reject
exports.rejectConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    consultation.status = 'rejected';
    await consultation.save();

    // Notify client via WebSocket
    const io = req.app.get('io');
    io.to(consultation.userId.toString()).emit('consultation-rejected', consultation);

    res.json({ success: true, message: 'Consultation rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/lawyer/earning
exports.getLawyerEarnings = async (req, res) => {
  try {
    const { lawyerId } = req.query;

    if (!lawyerId) return res.status(400).json({ error: 'Lawyer ID is required' });

    const consultations = await Consultation.find({
      lawyerId,
      status: 'completed'
    });

    const totalEarnings = consultations.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
    const totalMinutes = consultations.reduce((sum, c) => sum + (c.paidMinutes || 0), 0);

    res.json({ success: true, totalEarnings, totalMinutes, completedSessions: consultations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
