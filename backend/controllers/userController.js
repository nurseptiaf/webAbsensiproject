const User = require('../models/User.js');

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
