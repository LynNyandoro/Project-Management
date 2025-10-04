const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /projects
// @desc    Get all projects for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .populate('tasks')
      .sort({ createdAt: -1 });

    // Calculate completion percentage for each project
    const projectsWithStats = projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(task => task.status === 'Done').length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...project.toObject(),
        completionPercentage,
        totalTasks,
        completedTasks
      };
    });

    res.json(projectsWithStats);
  } catch (error) {
    console.error('Get projects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Calculate completion percentage
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      ...project.toObject(),
      completionPercentage,
      totalTasks,
      completedTasks
    });
  } catch (error) {
    console.error('Get project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /projects
// @desc    Create new project
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const project = new Project({
      name,
      description: description || '',
      createdBy: req.user._id,
      tasks: []
    });

    await project.save();

    res.status(201).json({
      ...project.toObject(),
      completionPercentage: 0,
      totalTasks: 0,
      completedTasks: 0
    });
  } catch (error) {
    console.error('Create project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Project name cannot be empty'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true }
    ).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Calculate completion percentage
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      ...project.toObject(),
      completionPercentage,
      totalTasks,
      completedTasks
    });
  } catch (error) {
    console.error('Update project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /projects/:id
// @desc    Delete project and all its tasks
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find project first to ensure user owns it
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
