// Route: /backend/routes/playerCourt.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Court = require('../models/court.model');
const playerCourtController = require('../controllers/playerCourt.controller');
const { checkAvailability } = require('../controllers/playerCourt.controller');

// Get court details
router.get('/:id', auth, playerCourtController.getCourtDetails);
router.get('/:id/availability', auth, checkAvailability);

// Check time slot availability
router.get('/:id/availability', auth, async (req, res) => {
    try {
      const { date, time } = req.query;
      const court = await Court.findById(req.params.id)
                             .populate('futsalId', 'operatingHours');
  
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
  
      // Add error handling for missing data
      if (!date || !time) {
        return res.status(400).json({ message: 'Date and time are required' });
      }
  
      const result = await playerCourtController.checkAvailability(req, res);
      return result;
    } catch (error) {
      console.error('Error in availability route:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

// Add review
router.get('/:id', auth, playerCourtController.getCourtDetails);
router.get('/:id/availability', auth, playerCourtController.checkAvailability);
router.post('/:id/reviews', auth, playerCourtController.addReview);
router.put('/:id/reviews/:reviewId', auth, playerCourtController.updateReview);
router.delete('/:id/reviews/:reviewId', auth, playerCourtController.deleteReview);
router.post('/:id/reviews/:reviewId/reactions', auth, playerCourtController.toggleReaction);

module.exports = router;