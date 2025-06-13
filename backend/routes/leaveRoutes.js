const express = require('express');
const { requestLeave, approveLeave, rejectLeave, getMyLeaves, getAllLeaves } = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apply', authMiddleware, requestLeave);
router.put('/approve/:id', authMiddleware, approveLeave);
router.put('/reject/:id', authMiddleware, rejectLeave);
router.get('/my', authMiddleware, getMyLeaves);
router.get('/all', authMiddleware, getAllLeaves);

module.exports = router;
