const User = require('../models/user.model');
const Lawyer = require('../models/lawyer.model');
const Consultation = require('../models/Consultation');

exports.getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User Stats
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Lawyer Stats
    const totalLawyers = await Lawyer.countDocuments();
    const activeLawyers = await Lawyer.countDocuments({ isActive: true });
    const inactiveLawyers = totalLawyers - activeLawyers;

    // Consultation Stats
    const totalConsultations = await Consultation.countDocuments();
    const consultationsByStatus = await Consultation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue Stats
    const revenueData = await Consultation.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalMinutes: { $sum: '$paidMinutes' }
        }
      }
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalMinutes: 0 };

    // System Health (mocked for now)
    const systemHealth = {
      uptime: process.uptime(), // in seconds
      serverTime: new Date(),
    };

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
        },
        lawyers: {
          total: totalLawyers,
          active: activeLawyers,
          inactive: inactiveLawyers,
        },
        consultations: {
          total: totalConsultations,
          byStatus: consultationsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        revenue: {
          totalAmount: revenue.totalRevenue,
          totalMinutes: revenue.totalMinutes,
        },
        systemHealth,
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
