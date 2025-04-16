const express = require('express');
const { Place } = require('../models');
const router = express.Router();

// POST - Add place
router.post('/', async (req, res) => {
  try {
    const { pl_detail, pl_best_time, pl_location, pl_img, did } = req.body;
    if (!pl_detail || !pl_best_time || !pl_location || !pl_img || !did) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPlace = await Place.create({
      pl_detail,
      pl_best_time,
      pl_location,
      pl_img,
      did,
    });

    res.status(201).json({ message: 'Place added successfully', place: newPlace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - List all places
router.get('/list', async (req, res) => {
  try {
    const { did } = req.query;
    const where = did ? { did } : {};
    const places = await Place.findAll({ where, order: [['pl_id', 'ASC']] });
    res.json({ count: places.length, places });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
