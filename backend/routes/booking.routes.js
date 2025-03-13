// backend/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Booking = require('../models/booking.model');
const Court = require('../models/court.model');
const Loyalty = require('../models/loyalty.model');
const User = require('../models/user.model');

router.post('/', auth, async (req, res) => {
    try {
      const { courtId, date, slots, totalAmount, requiresPayment, isFreeBooking } = req.body;
      
      // Get court and check if prepayment is required
      const court = await Court.findById(courtId);
      if (!court) {
        return res.status(404).json({ message: 'Court not found' });
      }
      
      // Check if this is a court with no prepayment required and user wants free booking
      if (!court.requirePrepayment && isFreeBooking) {
        // Check if user has used their free slot allowance
        const user = await User.findById(req.user._id);
        const freeSlotLimit = 2;
        
        if (user.freeBookingsUsed >= freeSlotLimit) {
          return res.status(400).json({ 
            message: `You have already used your ${freeSlotLimit} free bookings. Payment is required for additional bookings.` 
          });
        }
        
        // Check if the user is trying to book more slots than they have free bookings left
        const freeBookingsRemaining = freeSlotLimit - user.freeBookingsUsed;
        if (slots.length > freeBookingsRemaining) {
          return res.status(400).json({ 
            message: `You only have ${freeBookingsRemaining} free booking(s) left, but you're trying to book ${slots.length} slots.` 
          });
        }
        
        // Update the user's free bookings used count
        user.freeBookingsUsed += slots.length;
        await user.save();
      }
      
      // If payment is required but not provided, return error
      if (requiresPayment && !isFreeBooking) {
        // This would be where payment processing happens
        if (!req.body.paymentInfo) {
          return res.status(400).json({ 
            message: 'Payment is required for this booking' 
          });
        }
      }
  
      // Create bookings for each time slot
      const bookings = [];
      
      for (const slot of slots) {
        // Calculate end time (1 hour later)
        const startTime = slot.time;
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHour = (hours + 1) % 24;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        const booking = new Booking({
          court: courtId,
          user: req.user._id,
          date: new Date(date),
          startTime,
          endTime,
          price: slot.rate,
          priceType: 'regular', // This should be determined by the time
          status: 'confirmed',
          paymentStatus: isFreeBooking ? 'paid' : requiresPayment ? 'pending' : 'paid',
          paymentDetails: {
            method: isFreeBooking ? 'free' : 'standard',
            transactionId: isFreeBooking ? `FREE-${Date.now()}` : `TXN-${Date.now()}`,
            paidAmount: isFreeBooking ? 0 : slot.rate,
            paidAt: new Date()
          }
        });
        
        await booking.save();
        bookings.push(booking);
      }
      
      res.status(201).json({
        message: 'Booking created successfully',
        bookings
      });
      
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        message: 'Failed to create booking',
        error: error.message
      });
    }
  });

  router.get('/', auth, async (req, res) => {
    try {
      // Get bookings with court details populated
      const bookings = await Booking.find({ user: req.user._id })
        .populate({
          path: 'court',
          select: 'name futsalId surfaceType courtType images', // Make sure images is included
          populate: {
            path: 'futsalId',
            select: 'name'
          }
        })
        .sort({ date: 1, startTime: 1 });
      
      // Transform the bookings for the frontend
      const transformedBookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        
        // Add court and futsal details in an easier-to-access format
        bookingObj.courtDetails = {
          name: booking.court?.name || 'Unknown Court',
          futsalName: booking.court?.futsalId?.name || 'Unknown Futsal',
          surfaceType: booking.court?.surfaceType || 'Unknown',
          courtType: booking.court?.courtType || 'Unknown',
          images: booking.court?.images || [] // Make sure images is included
        };
        
        // Check if this was a free booking
        if (booking.paymentDetails?.method === 'free' || booking.price === 0) {
          bookingObj.paymentDetails = {
            ...bookingObj.paymentDetails,
            method: 'free'
          };
        }
        
        return bookingObj;
      });
      
      res.json(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  });

  router.get('/stats', auth, async (req, res) => {
    try {
      // Count all bookings
      const totalCount = await Booking.countDocuments({ 
        user: req.user._id 
      });
      
      // Count confirmed bookings
      const confirmedCount = await Booking.countDocuments({ 
        user: req.user._id,
        status: 'confirmed'
      });
      
      // Count confirmed paid bookings (excluding free bookings)
      const confirmedPaidCount = await Booking.countDocuments({ 
        user: req.user._id,
        status: 'confirmed',
        $or: [
          { 'paymentDetails.method': { $ne: 'free' } },
          { 'paymentDetails.method': { $exists: false } }
        ]
      });
      
      // Count completed bookings
      const completedCount = await Booking.countDocuments({ 
        user: req.user._id,
        status: 'completed'
      });
      
      res.json({
        totalCount,
        confirmedCount,
        confirmedPaidCount,
        completedCount
      });
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      res.status(500).json({
        message: 'Failed to fetch booking statistics',
        error: error.message
      });
    }
  });

  router.get('/free-slots', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const freeSlotLimit = 2;
      const freeBookingsUsed = user.freeBookingsUsed || 0;
      const freeBookingsRemaining = Math.max(0, freeSlotLimit - freeBookingsUsed);
      
      res.json({
        freeSlotLimit,
        freeBookingsUsed,
        freeBookingsRemaining
      });
    } catch (error) {
      console.error('Error checking free slots:', error);
      res.status(500).json({
        message: 'Failed to check free slots',
        error: error.message
      });
    }
  });

  router.patch('/:id/cancel', auth, async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if the booking belongs to the user
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      
      // Check if booking can be cancelled (only pending or confirmed bookings)
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({ message: `Cannot cancel a booking with status: ${booking.status}` });
      }
      
      // Update booking status
      booking.status = 'cancelled';
      booking.cancellationReason = req.body.reason || 'User cancelled';
      booking.cancellationDate = new Date();
      
      await booking.save();
      
      // If it was a free booking, add it back to the user's free slot allowance
      if (booking.paymentDetails?.method === 'free') {
        // You'll need to implement this logic in your user model
        // For example:
        if (req.user.freeBookingsUsed && req.user.freeBookingsUsed > 0) {
          req.user.freeBookingsUsed -= 1;
          await req.user.save();
        }
      }
      
      res.json(booking);
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({
        message: 'Failed to cancel booking',
        error: error.message
      });
    }
  });

  router.post('/:id/cancel', auth, async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if the booking belongs to the user
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      
      // Check if booking can be cancelled (only pending or confirmed bookings)
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({ message: `Cannot cancel a booking with status: ${booking.status}` });
      }
      
      // Update booking status
      booking.status = 'cancelled';
      booking.cancellationReason = req.body.reason || 'User cancelled';
      booking.cancellationDate = new Date();
      
      await booking.save();
      
      // If it was a free booking, add it back to the user's free slot allowance
      if (booking.paymentDetails?.method === 'free') {
        // You'll need to implement this logic in your user model
        // For example:
        if (req.user.freeBookingsUsed && req.user.freeBookingsUsed > 0) {
          req.user.freeBookingsUsed -= 1;
          await req.user.save();
        }
      }
      
      res.json(booking);
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({
        message: 'Failed to cancel booking',
        error: error.message
      });
    }
  });
module.exports = router;