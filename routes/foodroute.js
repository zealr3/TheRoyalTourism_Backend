const express = require('express');
const { Food } = require('../models');
const router = express.Router();

// Debug: Log to verify model
console.log('Food model:', Food);

// Add a new food item
router.post('/', async (req, res) => {
  try {br
    const { fdetail, fimg, did } = req.body;

    // Validation
    if (!fdetail || !fimg || !did) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure Food model is defined
    if (!Food) {
      throw new Error('Food model is undefined');
    }

    const newFood = await Food.create({
      fdetail,
      fimg,
      did,
    });

    res.status(201).json({
      message: 'Food added successfully',
      food: newFood,
    });
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get foods, optionally filtered by did (for destination page)
router.get('/', async (req, res) => {
  try {
    const { did } = req.query;
    const where = did ? { did } : {};
    if (!Food) {
      throw new Error('Food model is undefined');
    }
    const foods = await Food.findAll({ where });
    res.status(200).json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// List all food data
router.get('/list', async (req, res) => {
  try {
    const { did } = req.query;
    if (!Food) {
      throw new Error('Food model is undefined');
    }
    const where = did ? { did } : {};
    const foods = await Food.findAll({
      where,
      attributes: ['fid', 'fdetail', 'fimg', 'did'],
      order: [['fid', 'ASC']],
    });
    console.log('Fetched foods:', foods); // Debug log
    res.status(200).json({
      message: 'Food data retrieved successfully',
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.error('Error listing food data:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;  