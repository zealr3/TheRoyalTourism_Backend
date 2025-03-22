const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const User = require("./models/users");
const Destination = require("./models/destination");  // Import Destination model

const app = express();
app.use(cors());
app.use(bodyParser.json());



// Sync the models with the database
sequelize.sync().then(() => {
    console.log("Database connected successfully.");
});

// --------------------- User Routes ---------------------

// Get all users (Admin Purpose)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get User Count (New Route)
app.get('/api/users/count', async (req, res) => {
    try {
        const userCount = await User.count();  // Counting users directly from the database
        res.status(200).json({ count: userCount });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User Signup
app.post('/api/signup', async (req, res) => {
    const { fullname, email, password, role = 'user' } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role
        });

        const userResponse = {
            id: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email,
            role: newUser.role
        };

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User Sign-In
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials. Please try again.' });
        }

        const userResponse = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: 'User signed in successfully',
            user: userResponse
        });

    } catch (error) {
        console.error("Sign-In error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ------------------ Destination Routes ------------------

// Add a new destination
app.post('/api/destinations', async (req, res) => {
    const { name, image, description, dtype } = req.body;  // Accept dtype

    try {
        if (!dtype || (dtype.toLowerCase() !== "domestic" && dtype.toLowerCase() !== "international")) {
            return res.status(400).json({ error: 'Invalid dtype. Use "domestic" or "international".' });
        }

        const destination = await Destination.create({
            name,
            image,
            description,
            dtype
        });

        res.status(201).json({ message: 'Destination added successfully', destination });
    } catch (error) {
        console.error("Add destination error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch Domestic Destinations
app.get('/api/destinations/domestic', async (req, res) => {
    try {
        const destinations = await Destination.findAll({ where: { dtype: 'domestic' } });
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Fetch domestic destinations error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch International Destinations
app.get('/api/destinations/international', async (req, res) => {
    try {
        const destinations = await Destination.findAll({ where: { dtype: 'international' } });
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Fetch international destinations error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get destination counts (domestic & international)
app.get('/api/destinations/counts', async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        const total = destinations.length;
        const domestic = destinations.filter(dest => dest.dtype.toLowerCase() === "domestic").length;
        const international = destinations.filter(dest => dest.dtype.toLowerCase() === "international").length;

        res.status(200).json({
            total,
            domestic,
            international
        });
    } catch (error) {
        console.error("Fetch destinations counts error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all destinations
app.get('/api/destinations', async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Fetch destinations error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a destination
app.delete('/api/destinations/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Destination.destroy({ where: { did: id } });
        res.status(200).json({ message: 'Destination deleted successfully' });
    } catch (error) {
        console.error("Delete destination error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// -------------------- Server Setup ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
