const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileupload');
const {
  registerUser,
  loginUser,
  resetPassword,
  sendResetEmail,
  setNewPassword,
  getUserDetails,
  getuser,
  updateuserprofile,
} = require('../controllers/user.controller');

// Register a new user
router.post('/', registerUser);

// Login
router.post('/login', loginUser);

// Forgot password: send email
router.post('/forgot-password', sendResetEmail);

// Set new password after reset link
router.post('/set-new-password', setNewPassword);

// Reset password (authenticated user) 
router.put('/password', resetPassword);

// Get user details by ID
router.get('/:_id', getUserDetails);

router.get('/', getuser);

router.put('/updateuserprofile/:_id',upload.any(), updateuserprofile);

module.exports = router;
