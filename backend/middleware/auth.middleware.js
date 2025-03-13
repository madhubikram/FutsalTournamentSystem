const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header found' });
    }

    // Extract and verify token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Find user
    const user = await User.findById(decoded.userId).populate('futsal');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add check for futsal admin without futsal
    if (user.role === 'futsalAdmin' && !user.futsal) { 
      // Allow profile-related routes needed for profile completion
      const profileEndpoints = ['/profile', '/futsal/profile'];
      const isAllowedProfileRoute = profileEndpoints.some(endpoint => 
        req.path === endpoint || req.originalUrl.endsWith(endpoint)
      );
      
      if (!isAllowedProfileRoute) {
        return res.status(400).json({ 
          message: 'Futsal profile not found. Please complete your profile setup.' 
        });
      }
    }
    // Attach user and token to request
    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    // Handle any other errors
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;