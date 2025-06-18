const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser, getCurrentUser, updateCurrentUser, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Buang '/users' karena sudah dipakai di app.use('/api/users', userRoutes)
router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/me', authMiddleware, updateCurrentUser);
router.put('/me/password', authMiddleware, changePassword);

module.exports = router;
