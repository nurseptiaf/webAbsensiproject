const User = require('../models/User.js');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createUser = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { username, name, email, position, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email atau username sudah terdaftar' });
        }

        const newUser = new User({
            username,
            name,
            email,
            position,
            password,
            role: "karyawan"
        });

        await newUser.save();
        res.status(201).json({ message: 'Karyawan berhasil ditambahkan' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    if (req.user.role !== 'manajer') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, email, position } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, position },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User tidak ditemukan' });

        res.json({ message: 'Data karyawan diperbarui', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: 'Gagal mengambil profil user' });
  }
};
exports.updateCurrentUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();
    res.json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Update profil error:', error);
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah' });

    user.password = newPassword; // jangan hash di sini
    await user.save(); // pre('save') akan hash otomatis

    console.log("Password baru setelah save:", user.password);

    res.json({ message: 'Password berhasil diganti' });
  } catch (error) {
    console.error('Gagal ganti password:', error);
    res.status(500).json({ message: 'Gagal mengganti password' });
  }
};
