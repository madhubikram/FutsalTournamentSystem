const Loyalty = require('../models/loyalty.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');

const loyaltyController = {
    // Get user's loyalty points
    getLoyaltyPoints: async (req, res) => {
        try {
          let loyalty = await Loyalty.findOne({ user: req.user._id })
            .populate({
              path: 'transactions.booking',
              select: 'date startTime endTime price'
            });
    
          if (!loyalty) {
            loyalty = new Loyalty({ user: req.user._id });
            await loyalty.save();
            
            await User.findByIdAndUpdate(req.user._id, { loyalty: loyalty._id });
          }
    
          res.json({ points: loyalty.points });
        } catch (error) {
          console.error('Error in getLoyaltyPoints:', error);
          res.status(500).json({ message: error.message });
        }
      },
    
      getPointsHistory: async (req, res) => {
        try {
          const loyalty = await Loyalty.findOne({ user: req.user._id })
            .populate({
              path: 'transactions.booking',
              select: 'date startTime endTime price'
            });
    
          if (!loyalty) {
            return res.json([]);
          }
    
          res.json(loyalty.transactions);
        } catch (error) {
          console.error('Error in getPointsHistory:', error);
          res.status(500).json({ message: error.message });
        }
      },

    // Calculate points for amount
    calculatePoints: async (req, res) => {
        try {
            const { amount } = req.body;
            const points = Loyalty.calculatePoints(amount);
            res.json({ points });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Check if points can be redeemed
    checkRedemption: async (req, res) => {
        try {
            const { points } = req.body;
            const loyalty = await Loyalty.findOne({ user: req.user._id });

            if (!loyalty) {
                return res.status(404).json({ message: 'Loyalty record not found' });
            }

            const canRedeem = loyalty.points >= points;
            res.json({ 
                canRedeem,
                currentPoints: loyalty.points,
                shortfall: canRedeem ? 0 : points - loyalty.points
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = loyaltyController;