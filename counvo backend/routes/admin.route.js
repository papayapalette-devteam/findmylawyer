const express = require('express');
const router = express.Router();
const Message = require('../models/chathistory'); // Adjust path if needed

const {
  getPendingLawyers,
  getLawyerById,
  verifyLawyer
} = require('../controllers/adminLawyerController');

const chatupload=require('../middlewares/chatupload')
const { getAdminDashboard } = require('../controllers/adminController');
const  {getchathistory,getallchathistory, uploaddocument, getallchathistoryforrecentchat}  = require('../controllers/chathistory');
const { addfeedback, addlawyerfeedback } = require('../controllers/feedback');
const { CaseType, getcase_type, switch_time } = require('../controllers/admin_report');
const session_time = require('../models/session_time');

// Admin dashboard route
router.get('/dashboard', getAdminDashboard);

// Lawyer-related admin routes
router.get('/lawyers/pending', getPendingLawyers);
router.get('/lawyers/:id', getLawyerById);
router.post('/lawyers/:id/verify', verifyLawyer);

router.get('/chathistory/:user1Id/:user2Id',getchathistory);
router.get('/chathistory',getallchathistory);
router.get('/chathistoryforrecentchat',getallchathistoryforrecentchat);
router.post('/document', chatupload.single('file'),uploaddocument)


router.post('/addfeedback',addfeedback)
router.post('/addlawyerfeedback',addlawyerfeedback)


// ===========================for report=========================================
router.post('/case-type',CaseType)
router.get('/case-type',getcase_type)

router.post('/session-time',session_time)


module.exports = router;
