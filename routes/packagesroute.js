const express = require("express");
const models = require("../models");
const requireAuth = require("../middleware/requireauth");
const requireAdmin = require("../middleware/requireadmin");

const router = express.Router();

// Create a new package (Admin Only)
router.post("/", [requireAuth, requireAdmin], async (req, res) => {
  console.log("POST /api/packages/ received:", req.body);
  const { name, price, description, image, destinationId } = req.body;

  if (!name || !price || !description || !image || !destinationId) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    console.log('Package model for create:', typeof models.Package.create);
    const destination = await models.Destination.findByPk(destinationId);
    if (!destination) {
      return res.status(400).json({ error: "Invalid destinationId: Destination not found" });
    }

    const newPackage = await models.Package.create({
      name,
      price,
      description,
      image,
      destinationId,
    });
    console.log('Created package:', newPackage.toJSON());
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (error) {
    console.error("Add package error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get packages by destination
router.get('/by-destination/:destinationId', async (req, res) => {
  try {
    console.log('Package model:', models.Package, typeof models.Package.findAll);
    if (typeof models.Package.findAll !== 'function') {
      throw new Error('Package.findAll is not a function');
    }
    const { destinationId } = req.params;
    console.log(`Fetching packages for destinationId: ${destinationId}`);
    const packages = await models.Package.findAll({
      where: { destinationId: parseInt(destinationId) },
    });
    console.log('Fetched packages:', packages.map(p => p.toJSON()));
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch packages', details: error.message });
  }
});

// Get all packages
router.get("/", async (req, res) => {
  try {
    console.log('Package model for findAll:', typeof models.Package.findAll);
    const packages = await models.Package.findAll({ 
      include: [{ model: models.Destination, as: "destination" }] 
    });
    console.log('Fetched all packages:', packages.map(p => p.toJSON()));
    res.status(200).json(packages);
  } catch (error) {
    console.error("Fetch packages error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get package by ID
router.get("/:id", async (req, res) => {
  try {
    console.log('Package model for findByPk:', typeof models.Package.findByPk);
    const pkg = await models.Package.findByPk(req.params.id, {
      include: [{ model: models.Destination, as: "destination" }],
    });
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    console.log('Fetched package:', pkg.toJSON());
    res.status(200).json(pkg);
  } catch (error) {
    console.error("Fetch package error:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Update package by ID (Admin Only)
router.put("/:id", [requireAuth, requireAdmin], async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image, destinationId } = req.body;

  try {
    console.log('Package model for findByPk:', typeof models.Package.findByPk);
    const pkg = await models.Package.findByPk(id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    await pkg.update({ name, price, description, image, destinationId });
    console.log('Updated package:', pkg.toJSON());
    res.status(200).json({ message: "Package updated successfully", package: pkg });
  } catch (error) {
    console.error("Update package error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete package by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Delete request received for package ID: ${id}`);
  
  try {
    console.log('Package model for findByPk:', typeof models.Package.findByPk);
    const pkg = await models.Package.findByPk(id);
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }
    
    await pkg.destroy();
    console.log('Deleted package ID:', id);
    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Backend delete error:", error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;