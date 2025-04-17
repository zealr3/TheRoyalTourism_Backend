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

router.delete('/:aid', async (req, res) => {
  const { aid } = req.params;
  console.log(`Delete request received for activity ID: ${aid}`);

  try {
    if (!Activity) {
      console.error('Activity model is undefined');
      return res.status(500).json({ error: 'Activity model is undefined' });
    }

    const activity = await Activity.findByPk(aid);
    if (!activity) {
      console.error(`Activity not found for ID: ${aid}`);
      return res.status(404).json({ error: `Activity not found for ID: ${aid}` });
    }

    await activity.destroy();
    console.log('Deleted activity ID:', aid);
    return res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Backend delete error:', {
      message: error.message,
      stack: error.stack,
      aid,
      user: req.user ? { id: req.user.id, isAdmin: req.user.isAdmin } : 'No user',
    });
    return res.status(500).json({ error: error.message || 'Failed to delete activity' });
  }
});

module.exports = router;