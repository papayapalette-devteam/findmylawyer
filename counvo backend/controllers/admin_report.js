const CaseType = require('../models/admin_report');
const ChatTime = require('../models/session_time');

// POST /api/v1/admin-log
exports.CaseType = async (req, res) => {
  try {
    const { type_of_case } = req.body;
   
    if (!type_of_case) {
      return res.status(400).json({ error: "type_of_case is required" });
    }

    // find existing record
    let log = await CaseType.findOne({ type_of_case });

    if (log) {
      // increment count
      log.total_number = (log.total_number || 0) + 1;
      await log.save();
    } else {
      // create new record
      log = await CaseType.create({
        type_of_case,
        total_number: 1
      });
    }

    return res.status(200).json({ message: "Logged successfully", data: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET /api/v1/admin-log
exports.getcase_type = async (req, res) => {
  try {
    const casetype = await CaseType.find().sort({ total_number: -1 });
    res.status(200).json(casetype);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};





exports.session_time = async (req, res) => {
  try {
    const { user,sessionTime, switchTime } = req.body;

    // Create a new record
    const record = await ChatTime.create({
      user,
      sessionTime,
      switchTime
    });

    res.status(200).send({ success: true, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.get_session_time = async (req, res) => {
 try {
    const sessionAvg = await ChatTime.aggregate([
      { $match: { sessionTime: { $gt: 0 } } },
      { $group: { _id: null, avgSessionTime: { $avg: "$sessionTime" } } }
    ]);

    const switchAvg = await ChatTime.aggregate([
      { $match: { switchTime: { $gt: 0 } } },
      { $group: { _id: null, avgSwitchTime: { $avg: "$switchTime" } } }
    ]);

    const avgSessionSec = sessionAvg[0]?.avgSessionTime || 0;
    const avgSwitchSec = switchAvg[0]?.avgSwitchTime || 0;

    // Convert seconds to minutes (rounded to 2 decimals)
    const averagesInMinutes = {
      avgSessionTime: +(avgSessionSec / 60).toFixed(2),
      avgSwitchTime: +(avgSwitchSec / 60).toFixed(2)
    };

    res.status(200).json({ success: true, data: averagesInMinutes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

