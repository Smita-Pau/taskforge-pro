const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, addComment } = require('../controllers/taskController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

router.route('/:id/comments')
  .post(protect, addComment);

module.exports = router;
