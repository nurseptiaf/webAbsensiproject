const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role, name, position, email } = req.body;

  if (!username || !password || !role || !name || !email) {
    return res.status(400).json({ message: 'Harap isi semua data yang wajib' });
  }

  if (!['karyawan', 'manajer'].includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid' });
  }

  try {
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    if (existingEmail) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    const user = new User({
      username,
      password,
      role,
      name,
      position: position || '', // opsional
      email,
    });

    await user.save();

    res.status(201).json({ message: 'User berhasil terdaftar' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    console.log("User tidak ditemukan");
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Debugging: log password input dan hash
  console.log("Password input:", password);
  console.log("Password di database:", user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Hasil compare:", isMatch);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, role: user.role, username: user.username });
};
