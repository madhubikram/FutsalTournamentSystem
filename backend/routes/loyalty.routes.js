const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const loyaltyController = require('../controllers/loyalty.controller');

// Protected routes - require authentication
router.use(authMiddleware);

// Get user's points
router.get('/points', loyaltyController.getLoyaltyPoints);

// Get points history
router.get('/history', loyaltyController.getPointsHistory);

// Calculate points for amount
router.post('/calculate', loyaltyController.calculatePoints);

// Check redemption eligibility
router.post('/check-redemption', loyaltyController.checkRedemption);

module.exports = router;