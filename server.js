require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/db");
const User = require("./models/users");
const Destination = require("./models/destination");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync the models with the database
sequelize.sync().then(() => {
    console.log("Database connected successfully.");
});

// JWT Secret (store in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware for verifying admin role using JWT
const requireAdmin = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized. Admins only." });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        res.status(401).json({ error: "Invalid token." });
    }
};

// Promote User to Admin (Admin only route)
app.put("/api/users/promote", requireAdmin, async (req, res) => {
    const { targetUserId } = req.body;

    try {
        const user = await User.findByPk(targetUserId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        user.role = "admin";
        await user.save();

        res.status(200).json({ message: "User promoted to admin successfully." });
    } catch (error) {
        console.error("Promote user error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all users (Admin only)
app.get("/api/users", requireAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Get User and Admin Counts
app.get("/api/users/count", async (req, res) => {
    try {
        const totalUsers = await User.count();
        const adminCount = await User.count({ where: { role: "admin" } });
        const userCount = totalUsers - adminCount;

        res.status(200).json({ total: totalUsers, users: userCount, admins: adminCount });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// User Signup
app.post("/api/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    const role = "user";

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, fullname, email, role },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// User Sign-In (with JWT)
app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "User signed in successfully",
            token,
            user: { id: user.id, fullname: user.fullname, email, role: user.role },
        });
    } catch (error) {
        console.error("Sign-In error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Destination Routes (unchanged except for admin protection where needed)
app.post("/api/destinations", requireAdmin, async (req, res) => {
    const { name, image, description, dtype } = req.body;

    try {
        if (!dtype || !["domestic", "international"].includes(dtype.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid dtype. Use "domestic" or "international".' });
        }

        const destination = await Destination.create({ name, image, description, dtype });
        res.status(201).json({ message: "Destination added successfully", destination });
    } catch (error) {
        console.error("Add destination error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/destinations", async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Fetch destinations error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/destinations/domestic", async (req, res) => {
    try {
        const destinations = await Destination.findAll({ where: { dtype: "domestic" } });
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Fetch domestic destinations error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/destinations/international", async (req, res) => {
    try {
        const destinations = await Destination.findAll({ where: { dtype: "international" } });
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Fetch international destinations error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/destinations/counts", async (req, res) => {
    try {
        const total = await Destination.count();
        const domestic = await Destination.count({ where: { dtype: "domestic" } });
        const international = await Destination.count({ where: { dtype: "international" } });

        res.status(200).json({ total, domestic, international });
    } catch (error) {
        console.error("Fetch destinations counts error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/api/destinations/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await Destination.destroy({ where: { did: id } });
        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        console.error("Delete destination error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});