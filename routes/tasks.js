const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /projects/:projectId/tasks
// @desc    Get all tasks for a specific project
// @access  Private
router.get('/:projectId/tasks', auth, async (req, res) => {
  try {
    // Verify that the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /projects/:projectId/tasks/:taskId
// @desc    Get single task
// @access  Private
router.get('/:projectId/tasks/:taskId', auth, async (req, res) => {
  try {
    // Verify that the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /projects/:projectId/tasks
// @desc    Create new task
// @access  Private
router.post('/:projectId/tasks', [
  auth,
  body('title').trim().isLength({ min: 1 }).withMessage('Task title is required'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify that the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, dueDate, status } = req.body;

    const task = new Task({
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      status: status || 'To Do',
      project: req.params.projectId,
      createdBy: req.user._id
    });

    await task.save();

    // Add task to project's tasks array
    await Project.findByIdAndUpdate(
      req.params.projectId,
      { $push: { tasks: task._id } }
    );

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /projects/:projectId/tasks/:taskId
// @desc    Update task
// @access  Private
router.put('/:projectId/tasks/:taskId', [
  auth,
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Task title cannot be empty'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify that the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, dueDate, status } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (status !== undefined) updateData.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, project: req.params.projectId },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /projects/:projectId/tasks/:taskId
// @desc    Delete task
// @access  Private
router.delete('/:projectId/tasks/:taskId', auth, async (req, res) => {
  try {
    // Verify that the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove task from project's tasks array
    await Project.findByIdAndUpdate(
      req.params.projectId,
      { $pull: { tasks: task._id } }
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /tasks/overdue
// @desc    Get overdue tasks for the authenticated user
// @access  Private
router.get('/overdue', auth, async (req, res) => {
  try {
    // Get all projects for the user
    const userProjects = await Project.find({ createdBy: req.user._id });
    const projectIds = userProjects.map(project => project._id);

    // Find overdue tasks
    const overdueTasks = await Task.find({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' }
    }).populate('project', 'name');

    res.json(overdueTasks);
  } catch (error) {
    console.error('Get overdue tasks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
