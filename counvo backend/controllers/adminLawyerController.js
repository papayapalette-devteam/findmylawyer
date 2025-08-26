const Lawyer = require('../models/lawyer.model');
const AdminLog = require('../models/adminLog.model'); // For admin action logging

// GET /api/admin/lawyers/pending
exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find(
      { verificationStatus: 'pending' },
      'name email createdAt'
    );
    res.json({ success: true, lawyers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/admin/lawyers/:id
exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    res.json({ success: true, lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/lawyers/:id/verify
exports.verifyLawyer = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const lawyer = await Lawyer.findById(id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    // Update verification status and flag
    lawyer.verificationStatus = status;
    lawyer.isVerified = (status === 'approved');

    // Optional: Maintain verification history
    lawyer.verificationHistory.push({
      adminId: req.adminId, // Middleware should set this
      action: status,
      reason
    });

    await lawyer.save();

    // Log the action
    await AdminLog.create({
      adminId: req.adminId,
      action: `Verified lawyer (${status})`,
      targetId: lawyer._id,
      targetType: 'Lawyer',
      reason
    });

    // Optional: Send email
    // await sendEmail(lawyer.email, `Your account was ${status}`, `Reason: ${reason || 'N/A'}`);

    res.json({ success: true, message: `Lawyer ${status}`, lawyer });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
};
