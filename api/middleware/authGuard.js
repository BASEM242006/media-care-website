// api/middleware/authGuard.js
// Simple JWT auth middleware with optional role check

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Returns an Express middleware that verifies a JWT and optionally enforces a role.
 * @param {string|null} requiredRole - e.g., 'admin' or null for any authenticated user
 */
function authGuard(requiredRole = null) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      req.user = payload; // { id, role }
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = authGuard;
