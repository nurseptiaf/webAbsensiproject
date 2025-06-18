const express = require('express');
const router = express.Router();
const { getManagerDashboardSummary, getRecentRequests} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/manager-summary', authMiddleware, getManagerDashboardSummary);
router.get('/recent-requests', authMiddleware, getRecentRequests);

module.exports = router;
