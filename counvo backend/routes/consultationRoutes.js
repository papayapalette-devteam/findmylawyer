const express = require('express');
const router = express.Router();
const { startConsultation } = require('../controllers/consultationController');

router.post('/start', startConsultation);

module.exports = router;
const {
  endConsultation,
  rateConsultation
} = require('../controllers/consultationController');

router.post('/:id/end', endConsultation);
router.post('/:id/rate', rateConsultation);
