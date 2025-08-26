
const express = require('express');
const router = express.Router();

// Controllers
const lawyerController = require('../controllers/lawyer.controller');
const {
  getPendingConsultations,
  acceptConsultation,
  rejectConsultation,
  getLawyerEarnings
} = require('../controllers/lawyerConsultationController');

// Middlewares
const upload = require('../middlewares/fileupload');
const uploadFields=require('../middlewares/multiuploads')
const authMiddleware = require('../middlewares/auth');

// ---------- Public Endpoints ----------

// Add a new lawyer (basic info)
//router.post('/', lawyerController.addLawyer);

// Search lawyers by name or specialization
router.get('/search', lawyerController.searchLawyers);

// Lawyer login
router.post('/login', lawyerController.loginLawyer);

// Register lawyer with multi-file upload for documents
// ✅ Correct route
router.post('/register/lawyer',upload.any('documents', 5), lawyerController.registerLawyer);



// ---------- Protected Lawyer Actions (requires auth) ----------

//router.get('/profile', authMiddleware, lawyerController.getProfile);
router.put('/profile', authMiddleware, lawyerController.updateProfile);
router.put('/availability', authMiddleware, lawyerController.updateAvailability);
router.post('/availability/toggle', authMiddleware, lawyerController.toggleOnlineStatus);

// ---------- Lawyer Consultation Routes ----------

router.get('/consultations/pending', authMiddleware, getPendingConsultations);
router.post('/consultations/:id/accept', authMiddleware, acceptConsultation);
router.post('/consultations/:id/reject', authMiddleware, rejectConsultation);
router.get('/earning', authMiddleware, getLawyerEarnings);


router.get('/getalllawyerprofile',lawyerController.getallProfile);
router.put('/approvedlawyer/:_id',lawyerController.approveProfile);
router.get('/getlawyer/:_id',lawyerController.getallProfilebyid);
router.put('/updatelawyerprofile/:_id',uploadFields,lawyerController.updatelawyerprofile);



const { getProfile,remove_lawyer } = require('../controllers/lawyer.controller');
const authenticateLawyer = require('../middlewares/auth');

router.get('/profile', authenticateLawyer, getProfile);

router.delete('/removelawyer/:_id', remove_lawyer);

module.exports = router;
