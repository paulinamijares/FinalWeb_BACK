// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para autenticar JWT en encabezado Authorization.
 * Formato esperado: Authorization: Bearer <token>
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Header en minúscula

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No Authorization header provided.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Malformed Authorization header. Use Bearer <token>.' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Usuario verificado disponible en req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = authenticateToken;
