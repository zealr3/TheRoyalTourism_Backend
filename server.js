const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");  // Import bcrypt
const sequelize = require("./config/db");  // Import sequelize correctly
const User = require("./models/users");     // Your User model

const app = express();
app.use(cors());
app.use(bodyParser.json());

sequelize.sync().then(() => {
    console.log("Database connected successfully.");
});
app.post('/api/signup', async (req, res) => {
    const { fullname, email, password, role } = req.body;
    try {
        const userCheck = await db.query(
            `SELECT * FROM "users" WHERE "email" = $1`,
            [email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.query(
            `INSERT INTO "users" ("id", "fullname", "email", "password", "role") 
            VALUES (DEFAULT, $1, $2, $3, $4) 
            RETURNING "id", "fullname", "email", "role"`,
            [fullname, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "An error occurred during login." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});