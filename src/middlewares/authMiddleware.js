const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message : "Access denied. no token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({
            message : "Invalid Token"
        })
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: "Authentication required" 
            });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access denied. Insufficient permissions." 
            });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };