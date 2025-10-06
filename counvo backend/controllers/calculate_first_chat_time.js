
const FirstChatLog = require('../models/calculate_first_chat_time');

const save_first_time_chat=async(req, res) => {
  try {
    const { userId, timeToFirstChatMs } = req.body;
    if (!userId || timeToFirstChatMs === undefined) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // ✅ Save only if this user doesn't already have a record
    const existing = await FirstChatLog.findOne({ userId });
    if (existing) {
      return res.json({ success: true, message: 'First chat time already exists' });
    }

    const newLog = new FirstChatLog({
      userId,
      timeToFirstChatMs
    });

    await newLog.save();

    res.json({ success: true, message: 'First chat time saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const get_first_chat_time = async (req, res) => {
  try {
    const firstChatTimes = await FirstChatLog.find();

    if (!firstChatTimes.length) {
      return res.status(200).json({
        success: true,
        averageTimeMs: 0,
        averageTimeMinutes: 0,
        count: 0,
        message: "No chat time data found",
      });
    }

    // Sum all chat times
    const totalTime = firstChatTimes.reduce(
      (sum, record) => sum + (record.timeToFirstChatMs || 0),
      0
    );

    // Calculate average
    const averageTimeMs = totalTime / firstChatTimes.length;
    const averageTimeMinutes = (averageTimeMs / 60000).toFixed(2); // convert to minutes

    res.status(200).json({
      success: true,
      count: firstChatTimes.length,
      averageTimeMs,
      averageTimeMinutes,
      message: "Average time to first chat calculated successfully",
    });
  } catch (err) {
    console.error("❌ Error calculating average chat time:", err);
    res.status(500).json({ error: "Server Error" });
  }
};





module.exports = {save_first_time_chat,get_first_chat_time};
