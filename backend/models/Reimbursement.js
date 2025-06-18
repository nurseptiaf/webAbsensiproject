const mongoose = require('mongoose');

const ReimbursementSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, 
{ timestamps: true });

module.exports = mongoose.model('Reimbursement', ReimbursementSchema);
