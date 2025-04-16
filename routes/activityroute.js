const express = require('express');
const { Activity } = require('../models');
const router = express.Router();

// POST - Add activity
router.post('/', async (req, res) => {
  try {
    const { adetail, alocation, aactivity, aimg, best_time, did } = req.body;
    if (!adetail || !alocation || !aactivity || !aimg || !best_time || !did) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newActivity = await Activity.create({
      adetail,
      alocation,
      aactivity,
      aimg,
      best_time,
      did,
    });

    res.status(201).json({ message: 'Activity added successfully', activity: newActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - List all activities
router.get('/list', async (req, res) => {
  try {
    const { did } = req.query;
    const where = did ? { did } : {};
    const activities = await Activity.findAll({ where, order: [['aid', 'ASC']] });
    res.json({ count: activities.length, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
