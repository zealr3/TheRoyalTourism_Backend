const express = require('express');
const { Activity } = require('../models');
const router = express.Router();

// Debug: Log to verify model
console.log('Activity model:', Activity);

// Add a new activity
router.post('/', async (req, res) => {
  try {
    const { adetail, alocation, aactivity, aimg, best_time, did } = req.body;

    // Validation
    if (!adetail || !alocation || !aactivity || !aimg || !best_time || !did) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure Activity model is defined
    if (!Activity) {
      throw new Error('Activity model is undefined');
    }

    const newActivity = await Activity.create({
      adetail,
      alocation,
      aactivity,
      aimg,
      best_time,
      did,
    });

    res.status(201).json({
      message: 'Activity added successfully',
      activity: newActivity,
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get activities, optionally filtered by did
router.get('/', async (req, res) => {
  try {
    const { did } = req.query;
    const where = did ? { did } : {};
    if (!Activity) {
      throw new Error('Activity model is undefined');
    }
    const activities = await Activity.findAll({ where });
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// List all activity data
router.get('/list', async (req, res) => {
  try {
    const { did } = req.query;
    if (!Activity) {
      throw new Error('Activity model is undefined');
    }
    const where = did ? { did } : {};
    const activities = await Activity.findAll({
      where,
      attributes: ['aid', 'adetail', 'alocation', 'aactivity', 'aimg', 'best_time', 'did'],
      order: [['aid', 'ASC']],
    });
    console.log('Fetched activities:', activities);
    res.status(200).json({
      message: 'Activity data retrieved successfully',
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error('Error listing activity data:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;