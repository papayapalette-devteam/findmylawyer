const express = require('express');
const router = express.Router();
const systemSettingsController = require('../controllers/systemSettingsController');

router.get('/', systemSettingsController.getSystemSettings);
router.post('/', systemSettingsController.updateSystemSettings);

module.exports = router;
