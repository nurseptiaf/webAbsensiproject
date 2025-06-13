const Leave = require('../models/Leave.js');

exports.requestLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const leave = new Leave({
            employeeId: req.user.id,  // bukan req.user.userId
            startDate,
            endDate,
            reason
          });
          
        await leave.save();
        res.json({ message: 'Leave request submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveLeave = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.json({ message: 'Leave approved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rejectLeave = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'rejected' });
        res.json({ message: 'Leave rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user.id });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllLeaves = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const leaves = await Leave.find().populate('employeeId', 'name email');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
