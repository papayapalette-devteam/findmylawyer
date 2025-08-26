const SystemSettings = require('../models/systemSettings.model');

exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    if (!settings) return res.status(404).json({ error: 'Settings not found' });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
};

exports.updateSystemSettings = async (req, res) => {
  const { maintenanceMode, maxUsers } = req.body;

  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings({ maintenanceMode, maxUsers });
    } else {
      settings.maintenanceMode = maintenanceMode;
      settings.maxUsers = maxUsers;
    }

    await settings.save();
    res.json({ message: 'System settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
