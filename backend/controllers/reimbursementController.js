const Reimbursement = require('../models/Reimbursement.js');

exports.requestReimbursement = async (req, res) => {
    try {
        const { amount, reason } = req.body;
        const reimbursement = new Reimbursement({
                    employeeId: req.user.id,  
                    amount,
                    reason
                  });
        await reimbursement.save();
        res.json({ message: 'Reimbursement request submitted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveReimbursement = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        await Reimbursement.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.json({ message: 'Reimbursement approved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rejectReimbursement = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        await Reimbursement.findByIdAndUpdate(req.params.id, { status: 'rejected' });
        res.json({ message: 'Reimbursement rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyReimbursements = async (req, res) => {
    try {
      const reimbursements = await Reimbursement.find({ employeeId: req.user.id });
      res.json(reimbursements);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.getAllReimbursements = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const reimbursements = await Reimbursement.find().populate('employeeId', 'name email position');
        res.json(reimbursements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

  