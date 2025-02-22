const Loyalty = require('../models/loyalty.model');

const validateLoyaltyTransaction = async (req, res, next) => {
    try {
        // Skip validation for GET requests and points checking
        if (req.method === 'GET' || req.path === '/check-redemption') {
            return next();
        }

        // For point redemption requests
        if (req.method === 'POST' && req.path === '/redeem') {
            const { points } = req.body;
            
            if (!points || points <= 0) {
                return res.status(400).json({
                    message: 'Invalid points value'
                });
            }

            // Get user's loyalty record
            const loyalty = await Loyalty.findOne({ user: req.user._id });
            if (!loyalty) {
                return res.status(404).json({
                    message: 'Loyalty record not found'
                });
            }

            // Check if user has enough points
            if (loyalty.points < points) {
                return res.status(400).json({
                    message: 'Insufficient points',
                    available: loyalty.points,
                    requested: points
                });
            }
        }

        // For point earning requests
        if (req.method === 'POST' && req.path === '/earn') {
            const { amount } = req.body;
            
            if (!amount || amount <= 0) {
                return res.status(400).json({
                    message: 'Invalid transaction amount'
                });
            }

            // Calculate points to be earned
            const pointsToEarn = Loyalty.calculatePoints(amount);
            req.pointsToEarn = pointsToEarn; // Attach to request for later use
        }

        next();
    } catch (error) {
        console.error('Loyalty validation error:', error);
        next(error);
    }
};

module.exports = validateLoyaltyTransaction;