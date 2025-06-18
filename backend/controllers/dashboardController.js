const Attendance = require('../models/Attendance.js');
const User = require('../models/User.js');
const Leave = require('../models/Leave.js');
const Reimbursement = require('../models/Reimbursement');

exports.getManagerDashboardSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalEmployees = await User.countDocuments({ role: 'karyawan' });

    const presentToday = await Attendance.countDocuments({ date: today });

    const onLeaveToday = await Leave.countDocuments({
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: 'Approved',
    });

    const absentToday = totalEmployees - presentToday - onLeaveToday;

    res.json({
      totalEmployees,
      presentToday,
      onLeaveToday,
      absentToday,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getRecentRequests = async (req, res) => {
  try {
    // Ambil 5 leave terakhir
    const leaveRequests = await Leave.find()
      .populate('employeeId', 'name')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // Format data leave
    const formattedLeave = leaveRequests.map((leave) => ({
      id: leave._id,
      name: leave.employeeId?.name || 'Unknown',
      type: 'Leave',
      status: capitalize(leave.status),
      createdAt: leave.createdAt,
    }));

    // Ambil 5 reimbursement terakhir
    const reimbursementRequests = await Reimbursement.find()
      .populate('employeeId', 'name')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // Format data reimbursement
    const formattedReimbursements = reimbursementRequests.map((rmb) => ({
      id: rmb._id,
      name: rmb.employeeId?.name || 'Unknown',
      type: 'Reimbursement',
      status: capitalize(rmb.status),
      createdAt: rmb.createdAt,
    }));

    // Gabungkan dan urutkan
    const recentRequests = [...formattedLeave, ...formattedReimbursements].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(recentRequests);
  } catch (err) {
    console.error('Error fetching recent requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fungsi bantu untuk kapitalisasi huruf depan
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}