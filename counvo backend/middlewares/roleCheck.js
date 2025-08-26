// middlewares/roleCheck.js

// Example: roles can be ['user', 'admin', 'lawyer']
// permissions can be checked based on role

const roleCheck = (allowedRoles = []) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }
  next();
};

module.exports = roleCheck;
