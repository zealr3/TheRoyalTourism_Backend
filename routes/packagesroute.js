const express = require("express");
const Package = require("../models/package");
const Destination = require("../models/destination");
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
    const destination = await Destination.findByPk(destinationId);
    if (!destination) {
      return res.status(400).json({ error: "Invalid destinationId: Destination not found" });
    }

    const newPackage = await Package.create({
      name,
      price,
      description,
      image,
      destinationId,
    });
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (error) {
    console.error("Add package error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Add this below the other routes
router.get("/by-destination/:destinationId", async (req, res) => {
  try {
    const { destinationId } = req.params;
    const packages = await Package.findAll({
      where: { destinationId },
    });

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages by destination:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.findAll({ include: [{ model: Destination, as: "destination" }] });
    res.status(200).json(packages);
  } catch (error) {
    console.error("Fetch packages error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get package by ID
router.get("/:id", async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id, {
      include: [{ model: Destination, as: "destination" }],
    });
    if (!package) return res.status(404).json({ error: "Package not found" });
    res.status(200).json(package);
  } catch (error) {
    console.error("Fetch package error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update package by ID (Admin Only)
router.put("/:id", [requireAuth, requireAdmin], async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image, destinationId } = req.body;

  try {
    const pkg = await Package.findByPk(id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    await pkg.update({ name, price, description, image, destinationId });

    res.status(200).json({ message: "Package updated successfully", package: pkg });
  } catch (error) {
    console.error("Update package error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Delete request received for package ID: ${id}`);
  
  try {
    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }
    
    await pkg.destroy();
    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Backend delete error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;