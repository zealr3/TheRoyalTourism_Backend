const express = require('express');
const router = express.Router();
const models = require('../models');

// Debug: Log models at route initialization
console.log('placeRoutes initialized with models:', {
  Place: !!models.Place,
  Food: !!models.Food,
  Activity: !!models.Activity,
});

// Debug: Log models per request
router.use((req, res, next) => {
  console.log(`[${req.method} ${req.originalUrl}] Models available:`, {
    Place: !!models.Place,
    PlaceFindAll: models.Place ? !!models.Place.findAll : false,
  });
  next();
});

// Add a new place
router.post('/', async (req, res) => {
  try {
    if (!models.Place) {
      throw new Error('Place model is undefined');
    }
    if (!models.Place.create) {
      throw new Error('Place.create is undefined');
    }
    const { pl_detail, pl_best_time, pl_location, pl_img, did } = req.body;

    // Validation
    if (!pl_detail || !pl_best_time || !pl_location || !pl_img || !did) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPlace = await models.Place.create({
      pl_detail,
      pl_best_time,
      pl_location,
      pl_img,
      did,
    });

    console.log('Created place:', newPlace.toJSON());
    res.status(201).json({
      message: 'Place added successfully',
      place: newPlace,
    });
  } catch (error) {
    console.error('Error adding place:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get places, optionally filtered by did
router.get('/', async (req, res) => {
  try {
    if (!models.Place) {
      throw new Error('Place model is undefined');
    }
    if (!models.Place.findAll) {
      throw new Error('Place.findAll is undefined');
    }
    const { did } = req.query;
    const where = did ? { did } : {};
    const places = await models.Place.findAll({ where });
    console.log('Fetched places (/):', places.map(p => p.toJSON()));
    res.status(200).json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// List all place data
router.get('/list', async (req, res) => {
  try {
    if (!models.Place) {
      throw new Error('Place model is undefined');
    }
    if (!models.Place.findAll) {
      throw new Error('Place.findAll is undefined');
    }
    const { did } = req.query;
    const where = did ? { did } : {};
    const places = await models.Place.findAll({
      where,
      attributes: ['pl_id', 'pl_detail', 'pl_best_time', 'pl_location', 'pl_img', 'did'],
      order: [['pl_id', 'ASC']],
    });
    console.log('Fetched places (/list):', places.map(p => p.toJSON()));
    res.status(200).json({
      message: 'Place data retrieved successfully',
      count: places.length,
      places,
    });
  } catch (error) {
    console.error('Error listing place data:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;