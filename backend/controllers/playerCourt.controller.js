// Route: /backend/controllers/playerCourt.controller.js

const Court = require('../models/court.model');
const { isWithinOperatingHours, getTimeSlots } = require('../utils/timeUtils');

const playerCourtController = {
// Export each controller function individually for better error tracking
getCourtDetails: async (req, res) => {
    try {
        const court = await Court.findById(req.params.id)
            .populate('futsalId', 'name location coordinates operatingHours')
            .populate('reviews.user', 'username');

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        // Calculate and update average rating
        court.averageRating = court.calculateAverageRating();
        await court.save();

        res.json(court);
    } catch (error) {
        console.error('Error fetching court details:', error);
        res.status(500).json({ message: error.message });
    }
},

checkAvailability: async (req, res) => {
    try {
        const { date, time } = req.query;
        
        // Input validation
        if (!date || !time) {
            return res.status(400).json({ 
                message: 'Date and time are required',
                available: false
            });
        }

        // Get court details
        const court = await Court.findById(req.params.id)
            .populate('futsalId', 'operatingHours');

        if (!court) {
            return res.status(404).json({ 
                message: 'Court not found',
                available: false
            });
        }

        // Check if court is active
        if (court.status !== 'Active') {
            return res.json({
                available: false,
                rate: 0,
                message: 'Court is not active'
            });
        }

        // Check operating hours
        const isAvailable = isWithinOperatingHours(
            time,
            court.futsalId.operatingHours.opening,
            court.futsalId.operatingHours.closing
        );

        if (!isAvailable) {
            return res.json({
                available: false,
                rate: 0,
                message: 'Outside operating hours'
            });
        }

        // Check existing bookings
        let existingBooking = null;
        if (court.bookings && Array.isArray(court.bookings)) {
            existingBooking = court.bookings.find(
                booking => 
                    booking.date.toDateString() === new Date(date).toDateString() &&
                    booking.startTime === time &&
                    booking.status !== 'cancelled'
            );
        }

        // Calculate rate based on time
        let rate = court.priceHourly;
        if (court.hasPeakHours && isWithinOperatingHours(time, court.peakHours.start, court.peakHours.end)) {
            rate = court.pricePeakHours;
        } else if (court.hasOffPeakHours && isWithinOperatingHours(time, court.offPeakHours.start, court.offPeakHours.end)) {
            rate = court.priceOffPeakHours;
        }

        return res.json({
            available: !existingBooking,
            rate,
            message: existingBooking ? 'Time slot is already booked' : 'Time slot is available'
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        return res.status(500).json({ 
            message: 'Error checking availability',
            error: error.message,
            available: false
        });
    }
},

addReview: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const court = await Court.findById(req.params.id);
  
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
  
      // Check if user has already reviewed
      const existingReview = court.reviews.find(
        review => review.user.toString() === req.user._id.toString()
      );
  
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this court' });
      }
  
      court.reviews.push({
        user: req.user._id,
        rating,
        comment,
        reactions: []
      });
  
      court.averageRating = court.calculateAverageRating();
      await court.save();
  
      const populatedCourt = await Court.findById(court._id)
        .populate('reviews.user', 'username')
        .populate('reviews.reactions.user', 'username');
  
      res.status(201).json(populatedCourt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const court = await Court.findById(req.params.id);
  
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
  
      const review = court.reviews.id(req.params.reviewId);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this review' });
      }
  
      review.rating = rating;
      review.comment = comment;
      court.averageRating = court.calculateAverageRating();
      
      await court.save();
  
      const populatedCourt = await Court.findById(court._id)
        .populate('reviews.user', 'username')
        .populate('reviews.reactions.user', 'username');
  
      res.json(populatedCourt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const court = await Court.findById(req.params.id);
  
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
  
      const review = court.reviews.id(req.params.reviewId);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }
  
      review.remove();
      court.averageRating = court.calculateAverageRating();
      
      await court.save();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleReaction: async (req, res) => {
    try {
      const { type } = req.body;
      const court = await Court.findById(req.params.id);
  
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
  
      const review = court.reviews.id(req.params.reviewId);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      const existingReaction = review.reactions.find(
        reaction => reaction.user.toString() === req.user._id.toString()
      );
  
      if (existingReaction) {
        if (existingReaction.type === type) {
          // Remove reaction if same type
          review.reactions = review.reactions.filter(
            reaction => reaction.user.toString() !== req.user._id.toString()
          );
        } else {
          // Update reaction type if different
          existingReaction.type = type;
        }
      } else {
        // Add new reaction
        review.reactions.push({
          user: req.user._id,
          type
        });
      }
  
      await court.save();
  
      const populatedCourt = await Court.findById(court._id)
        .populate('reviews.user', 'username')
        .populate('reviews.reactions.user', 'username');
  
      res.json(populatedCourt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
// Export all controller functions
module.exports = playerCourtController;