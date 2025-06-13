const express = require('express');
const {
  requestReimbursement,
  approveReimbursement,
  rejectReimbursement,
  getMyReimbursements,
  getAllReimbursements
} = require('../controllers/reimbursementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apply', authMiddleware, requestReimbursement);
router.put('/approve/:id', authMiddleware, approveReimbursement);
router.put('/reject/:id', authMiddleware, rejectReimbursement);
router.get('/my', authMiddleware, getMyReimbursements);
router.get('/all', authMiddleware, getAllReimbursements);

module.exports = router;
