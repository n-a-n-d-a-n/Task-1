const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getProfile);

router.get('/:id', protect, getUserById);

router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name is required.'),
    body('email').optional().isEmail().withMessage('Valid email is required.'),
    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
  ],
  updateUser
);

router.delete('/:id', protect, deleteUser);

module.exports = router;
