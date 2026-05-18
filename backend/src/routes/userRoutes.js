const express = require('express');
const { 
  getUsers, 
  updateUserRole, 
  deleteUser, 
  inviteUser,
  updateProfile,
  updatePassword
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getUsers)
  .post(protect, inviteUser);

router.route('/profile').put(protect, updateProfile);
router.route('/password').put(protect, updatePassword);

router.route('/:id').put(protect, updateUserRole).delete(protect, deleteUser);

module.exports = router;
