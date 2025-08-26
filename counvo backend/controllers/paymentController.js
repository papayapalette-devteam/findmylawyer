const razorpay = require('../utils/razorpayInstance');
const Consultation = require('../models/Consultation');

exports.createPayment = async (req, res) => {
  const { consultationId, ratePerMinute } = req.body;

  try {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation || consultation.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid consultation' });
    }

    const amount = ratePerMinute * 5 * 100; // 5 minutes buffer, in paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${consultationId}_${Date.now()}`
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  const { consultationId } = req.body;

  try {
    const updated = await Consultation.findByIdAndUpdate(consultationId, {
      status: 'active',
      startTime: new Date()
    }, { new: true });

    res.json({ success: true, consultation: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
