const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// GET /api/tasks (Filter by logged-in user if MEMBER, all if ADMIN)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'MEMBER') {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// POST /api/tasks (Admin only)
router.post('/', auth, roleCheck('ADMIN'), async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    if (!title || !description || !assignedTo || !projectId) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
    });

    await task.save();
    
    // Populate before returning so frontend has full data immediately
    await task.populate('assignedTo', 'name email');
    await task.populate('projectId', 'name');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating task' });
  }
});

// PUT /api/tasks/:id (Update status, MEMBERs can only update their own tasks)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Role check: If MEMBER, ensure they are assigned to this task
    if (req.user.role === 'MEMBER' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task' });
  }
});

module.exports = router;
