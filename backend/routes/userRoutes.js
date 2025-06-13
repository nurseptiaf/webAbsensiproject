const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Buang '/users' karena sudah dipakai di app.use('/api/users', userRoutes)
router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
