const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'username email role');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'username email role');
    }

    // Compute real progress from tasks in the database
    const allTasks = await Task.find({});
    const enhancedProjects = projects.map(p => {
      const doc = p.toObject();
      const projectTasks = allTasks.filter(t => t.project.toString() === p._id.toString());
      const doneTasks = projectTasks.filter(t => t.status === 'done').length;
      doc.progress = projectTasks.length > 0 ? Math.round((doneTasks / projectTasks.length) * 100) : 0;
      doc.taskCount = projectTasks.length;
      return doc;
    });

    res.json(enhancedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, members, status } = req.body;
    const project = await Project.create({
      name,
      description,
      members,
      status: status || 'Active',
      createdBy: req.user._id
    });
    const populated = await Project.findById(project._id).populate('members', 'username email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Admin only
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Not authorized' });

    Object.assign(project, req.body);
    await project.save();
    const populated = await Project.findById(project._id).populate('members', 'username email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Not authorized' });

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
