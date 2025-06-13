const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { checkIn, checkOut, getAttendanceRecords, getTodayAttendanceForManager, getAllAttendanceRecords } = require('../controllers/attendanceController.js');

const router = express.Router();

router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);
router.get('/records', authMiddleware, getAttendanceRecords);
router.get('/manager/today', authMiddleware, getTodayAttendanceForManager);
router.get('/all', authMiddleware, getAllAttendanceRecords);

module.exports = router;
