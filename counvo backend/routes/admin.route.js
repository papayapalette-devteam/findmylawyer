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
const  {getchathistory,getallchathistory, uploaddocument, getallchathistoryforrecentchat, getChatSummary, getUserChatSummary}  = require('../controllers/chathistory');
const { addfeedback, addlawyerfeedback } = require('../controllers/feedback');
const { CaseType, getcase_type, session_time, get_session_time } = require('../controllers/admin_report');
const { save_first_time_chat, get_first_chat_time } = require('../controllers/calculate_first_chat_time');


// Admin dashboard route
router.get('/dashboard', getAdminDashboard);

// Lawyer-related admin routes
router.get('/lawyers/pending', getPendingLawyers);
router.get('/lawyers/:id', getLawyerById);
router.post('/lawyers/:id/verify', verifyLawyer);

router.get('/chathistory/:user1Id/:user2Id',getchathistory);
router.get('/chathistory',getallchathistory);
router.get('/chathistoryforrecentchat',getallchathistoryforrecentchat);
router.get('/chat-summary',getChatSummary);
router.get('/user-chat-summary',getUserChatSummary);

router.post('/document', chatupload.single('file'),uploaddocument)


router.post('/addfeedback',addfeedback)
router.post('/addlawyerfeedback',addlawyerfeedback)


// ===========================for report=========================================
router.post('/case-type',CaseType)
router.get('/case-type',getcase_type)

router.post('/session-time',session_time)
router.get('/session-time',get_session_time)

router.post('/first_chat_time',save_first_time_chat)
router.get('/first_chat_time',get_first_chat_time)


module.exports = router;
