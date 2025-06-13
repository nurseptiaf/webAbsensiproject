const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String } // Bisa kosong jika belum check-out
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);