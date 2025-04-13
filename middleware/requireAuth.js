const jwt = require("jsonwebtoken");
const User = require("../models/users"); // Fixed to match server.js (plural)

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Auth - Received token:", token); // Debug
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Auth - Decoded token:", decoded); // Debug
        const user = await User.findByPk(decoded.id);
        console.log("Auth - User from DB:", user?.toJSON()); // Debug

        if (!user) return res.status(401).json({ message: "Invalid token" });

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};