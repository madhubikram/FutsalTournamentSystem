// backend/middleware/player.middleware.js

const playerMiddleware = (req, res, next) => {
    if (req.user.role !== 'player') {
      return res.status(403).json({ 
        message: 'Access denied. Player access only.' 
      });
    }
    next();
  };
  
  module.exports = playerMiddleware;