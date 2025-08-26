const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

router.get('/users', adminUserController.getUsers);
router.put('/users/:id/status', adminUserController.updateUserStatus);

module.exports = router;
