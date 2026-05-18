const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};
    
    // Member only sees tasks from projects they belong to
    if (req.user.role !== 'Admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      query.project = { $in: projectIds };
    }
    
    if (projectId) {
      query.project = projectId;
    }
    
    const tasks = await Task.find(query)
      .populate('assignee', 'username email')
      .populate('comments.user', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const populated = await Task.findById(task._id)
      .populate('assignee', 'username email')
      .populate('comments.user', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Track completion timestamp for velocity charts
    if (req.body.status === 'done' && task.status !== 'done') {
      task.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'done') {
      task.completedAt = undefined;
    }
    
    Object.assign(task, req.body);
    await task.save();
    
    const populated = await Task.findById(task._id)
      .populate('assignee', 'username email')
      .populate('comments.user', 'username');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Not authorized' });

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    task.comments.push({ user: req.user._id, text: req.body.text });
    await task.save();
    
    const populated = await Task.findById(task._id)
      .populate('assignee', 'username email')
      .populate('comments.user', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
