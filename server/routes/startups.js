const express = require('express');
const Startup = require('../models/Startup');
const router = express.Router();

// Create startup profile
router.post('/', async (req, res) => {
  try {
    const startup = new Startup(req.body);
    await startup.save();
    res.status(201).json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all startups
router.get('/', async (req, res) => {
  try {
    const startups = await Startup.find();
    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get startup by ID
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update startup
router.put('/:id', async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete startup
router.delete('/:id', async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json({ message: 'Startup deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 