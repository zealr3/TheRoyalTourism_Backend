// routes/tourroutes.js
const express = require('express');
const router = express.Router();
const models = require('../models');
const requireAuth = require('../middleware/requireauth');
const requireAdmin = require('../middleware/requireadmin');

// Get all tour details (for admin)
router.get('/details', [requireAuth, requireAdmin], async (req, res) => {
  try {
    if (!models.TourDetails || !models.Itineraries) {
      throw new Error('TourDetails or Itineraries model is undefined');
    }
    const tourDetails = await models.TourDetails.findAll({
      include: [{
        model: models.Itineraries,
        as: 'itineraries',
        required: false,
      }],
    });
    res.status(200).json(tourDetails);
  } catch (error) {
    console.error('Error fetching all tours:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get tour details by package_id (for user)
router.get('/details/:package_id', async (req, res) => {
  try {
    if (!models.TourDetails || !models.Itineraries) {
      throw new Error('TourDetails or Itineraries model is undefined');
    }
    const { package_id } = req.params;
    console.log(`Fetching tours for package_id: ${package_id}`);
    const tourDetails = await models.TourDetails.findAll({
      where: { package_id: parseInt(package_id) },
      include: [{
        model: models.Itineraries,
        as: 'itineraries',
        required: false,
      }],
    });
    console.log(`Found tours: ${JSON.stringify(tourDetails)}`);
    if (!tourDetails || tourDetails.length === 0) {
      return res.status(404).json({ message: 'No tour details found for this package' });
    }
    res.status(200).json(tourDetails);
  } catch (error) {
    console.error('Error fetching tour details:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Add new tour (for admin)
router.post('/details', [requireAuth, requireAdmin], async (req, res) => {
  try {
    if (!models.TourDetails) {
      throw new Error('TourDetails model is undefined');
    }
    const { tname, tday, tpickup, timg1, timg2, timg3, timg4, toverview, thighlights, package_id } = req.body;
    if (!tname || !tday || !tpickup || !timg1 || !timg2 || !timg3 || !timg4 || !toverview || !thighlights || !package_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const packageExists = await models.Package.findByPk(package_id);
    if (!packageExists) {
      return res.status(400).json({ error: 'Invalid package_id: Package not found' });
    }
    const newTour = await models.TourDetails.create({
      tname,
      tday: parseInt(tday),
      tpickup,
      timg1,
      timg2,
      timg3,
      timg4,
      toverview,
      thighlights,
      package_id: parseInt(package_id),
    });
    res.status(201).json({ message: 'Tour added successfully', tour: newTour });
  } catch (error) {
    console.error('Error adding tour:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Add new itinerary (for admin)
router.post('/itineraries', [requireAuth, requireAdmin], async (req, res) => {
  try {
    if (!models.Itineraries) {
      throw new Error('Itineraries model is undefined');
    }
    const { iname, iday1, iday2, iday3, iday4, iday5, iday6, iday7, tid } = req.body;
    if (!iname || !tid) {
      return res.status(400).json({ error: 'Itinerary name and tour ID are required' });
    }
    const tourExists = await models.TourDetails.findByPk(tid);
    if (!tourExists) {
      return res.status(400).json({ error: 'Invalid tid: Tour not found' });
    }
    const newItinerary = await models.Itineraries.create({
      iname,
      iday1,
      iday2,
      iday3,
      iday4,
      iday5,
      iday6,
      iday7,
      tid: parseInt(tid),
    });
    console.log(`Added itinerary with tid: ${tid}`);
    res.status(201).json({ message: 'Itinerary added successfully', itinerary: newItinerary });
  } catch (error) {
    console.error('Error adding itinerary:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;