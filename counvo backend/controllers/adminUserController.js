const User = require('../models/user.model');
const AdminLog = require('../models/adminLog.model');

exports.getUsers = async (req, res) => {
  try {
    const { status, email, username } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (email) filters.email = new RegExp(email, 'i');
    if (username) filters.username = new RegExp(username, 'i');

    const users = await User.find(filters).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  if (!['active', 'suspended', 'deleted'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.status = status;
    await user.save();

    await AdminLog.create({
      adminId: req.adminId || null,
      action: `Changed user status to ${status}`,
      targetId: user._id,
      targetType: 'User',
      reason
    });

    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};
