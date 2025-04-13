module.exports = (req, res, next) => {
    console.log("Admin check - User:", req.user?.toJSON()); // Debug
    if (!req.user || !req.user.role || req.user.role !== "admin") {
        console.log("Admin check - Access denied. Role:", req.user?.role); // Debug
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};