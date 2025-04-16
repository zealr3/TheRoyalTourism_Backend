const express = require("express");
const models = require("../models");
const requireAuth = require("../middleware/requireauth");
const requireAdmin = require("../middleware/requireadmin");

const router = express.Router();

router.post("/", [requireAuth, requireAdmin], async (req, res) => {
  console.log("POST /api/foods received:", req.body);
  const { fdetail, fimg, did } = req.body;

  if (!fdetail || !fimg || !did) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    console.log('Food model for create:', typeof models.Food.create);
    const destination = await models.Destination.findByPk(did);
    if (!destination) {
      return res.status(400).json({ error: "Invalid destinationId: Destination not found" });
    }

    const newFood = await models.Food.create({
      fdetail,
      fimg,
      did,
    });
    console.log('Created food:', newFood.toJSON());
    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (error) {
    console.error("Add food error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  const { did } = req.query;
  try {
    console.log('Food model for findAll:', typeof models.Food.findAll);
    const where = did ? { did: parseInt(did) } : {};
    const foods = await models.Food.findAll({ 
      where,
      include: [{ model: models.Destination, as: "destination" }],
    });
    console.log('Fetched foods:', foods.map(f => f.toJSON()));
    res.status(200).json(foods);
  } catch (error) {
    console.error("Fetch foods error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log('Food model for findByPk:', typeof models.Food.findByPk);
    const food = await models.Food.findByPk(req.params.id, {
      include: [{ model: models.Destination, as: "destination" }],
    });
    if (!food) return res.status(404).json({ error: "Food not found" });
    console.log('Fetched food:', food.toJSON());
    res.status(200).json(food);
  } catch (error) {
    console.error("Fetch food error:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", [requireAuth, requireAdmin], async (req, res) => {
  const { id } = req.params;
  const { fdetail, fimg, did } = req.body;

  try {
    console.log('Food model for findByPk:', typeof models.Food.findByPk);
    const food = await models.Food.findByPk(id);
    if (!food) return res.status(404).json({ error: "Food not found" });

    await food.update({ fdetail, fimg, did });
    console.log('Updated food:', food.toJSON());
    res.status(200).json({ message: "Food updated successfully", food });
  } catch (error) {
    console.error("Update food error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", [requireAuth, requireAdmin], async (req, res) => {
  const { id } = req.params;
  console.log(`Delete request received for food ID: ${id}`);

  try {
    console.log('Food model for findByPk:', typeof models.Food.findByPk);
    const food = await models.Food.findByPk(id);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    await food.destroy();
    console.log('Deleted food ID:', id);
    return res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Backend delete error:", error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;