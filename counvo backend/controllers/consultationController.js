const mongoose = require('mongoose');


const Consultation = require('../models/Consultation');
const LawyerModel = require('../models/lawyer.model');
const { v4: uuidv4 } = require('uuid');

exports.startConsultation = async (req, res) => {
  const { userId, issueDetails } = req.body;

  if (!userId || !issueDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const availableLawyer = await LawyerModel.findOne(); // Add filters if needed

    if (!availableLawyer) {
      return res.status(503).json({ error: 'No available lawyers' });
    }

    const chatSessionId = uuidv4();

    const consultation = await Consultation.create({
      userId,
      lawyerId: availableLawyer._id,
      issueDetails,
      chatSessionId,
      startTime: new Date(),
      status: 'active'
    });

    // Notify lawyer via WebSocket if connected
    const io = req.app.get('io');
    io.to(availableLawyer._id.toString()).emit('new-consultation', consultation);

    res.status(201).json({
      message: 'Consultation started',
      consultationId: consultation._id,
      chatSessionId,
      lawyerId: availableLawyer._id
    });

  } catch (error) {
    console.error('Start consultation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.endConsultation = async (req, res) => {
  const { id } = req.params;
  const { ratePerMinute } = req.body;

  try {
    const consultation = await Consultation.findById(id);
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    const endTime = new Date();
    const durationMs = endTime - consultation.startTime;
    const paidMinutes = Math.ceil(durationMs / 60000);
    const totalAmount = paidMinutes * ratePerMinute;

    consultation.endTime = endTime;
    consultation.status = 'completed';
    consultation.paidMinutes = paidMinutes;
    consultation.totalAmount = totalAmount;

    await consultation.save();

    res.json({ success: true, paidMinutes, totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rateConsultation = async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  try {
    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { rating, review },
      { new: true }
    );

    res.json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
