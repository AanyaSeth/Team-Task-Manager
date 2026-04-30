const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// GET /api/projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching projects' });
  }
});

// POST /api/projects (Admin only)
router.post('/', auth, roleCheck('ADMIN'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      name,
      createdBy: req.user.id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating project' });
  }
});

module.exports = router;
