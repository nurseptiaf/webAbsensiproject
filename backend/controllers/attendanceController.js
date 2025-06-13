const Attendance = require('../models/Attendance.js');

exports.checkIn = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    // Cek apakah sudah check-in hari ini
    const existingAttendance = await Attendance.findOne({ employeeId: req.user.id, date: today });
    if (existingAttendance) return res.status(400).json({ message: 'Already checked in today' });

    // Simpan data check-in
    const attendance = new Attendance({ 
        employeeId: req.user.id, 
        date: today, 
        checkInTime: new Date().toISOString() 
    });

    await attendance.save();
    res.status(201).json({ message: 'Checked In', attendance });
};

exports.checkOut = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    // Cari data absensi hari ini yang belum checkout
    const attendance = await Attendance.findOne({ 
        employeeId: req.user.id, 
        date: today, 
        checkOutTime: null 
    });

    if (!attendance) return res.status(400).json({ message: 'No active check-in found' });

    // Update data check-out
    attendance.checkOutTime = new Date().toISOString();
    await attendance.save();

    res.json({ message: 'Checked Out', attendance });
};

exports.getAttendanceRecords = async (req, res) => {
    const records = await Attendance.find({ employeeId: req.user.id }).sort({ date: -1 });
    res.json(records);
};

exports.getTodayAttendanceForManager = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const users = await User.find({ role: 'employee' });

    const attendanceData = await Promise.all(users.map(async user => {
      const attendance = await Attendance.findOne({ employeeId: user._id, date: today });
      const leave = await Leave.findOne({ employeeId: user._id, date: today });

      let status = 'Absent';
      let checkInTime = null;

      if (attendance) {
        status = 'Present';
        checkInTime = new Date(attendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (leave) {
        status = 'On Leave';
      }

      return {
        name: user.name,
        checkInTime: checkInTime || 'No Entry',
        status,
      };
    }));

    res.json(attendanceData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get attendance data' });
  }
};
// Pastikan hanya manajer bisa akses
exports.getAllAttendanceRecords = async (req, res) => {
  if (req.user.role !== 'manajer') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const records = await Attendance.find()
      .populate('employeeId', 'name')
      .sort({ date: -1 });

    const formatted = records.map((rec) => {
      const formatTime = (timeStr) => {
        if (!timeStr) return null;
        const date = new Date(timeStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      return {
        name: rec.employeeId.name,
        date: rec.date,
        status: rec.checkOutTime
          ? "Hadir"
          : rec.checkInTime
          ? "Hadir (belum check-out)"
          : "Tidak Hadir",
        checkInTime: formatTime(rec.checkInTime),
        checkOutTime: formatTime(rec.checkOutTime),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


