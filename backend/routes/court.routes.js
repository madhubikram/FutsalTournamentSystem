const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Court = require('../models/court.model');
const multer = require('multer');
const path = require('path');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');



const verifyMongoose = (req, res, next) => {
    if (!mongoose.connection.readyState) {
        return res.status(500).json({
            message: 'Database connection not established'
        });
    }
    next();
};

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/courts'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload images only.'), false);
        }
    }
});

// Get all courts for the futsal
router.get('/', auth, async (req, res) => {
    try {
        let courts;
        
        // If user is a futsal admin, show only their courts
        if (req.user.role === 'futsalAdmin') {
            courts = await Court.find({ futsalId: req.user.futsal })
                               .populate('futsalId', 'name location coordinates operatingHours');
        } 
        // If user is a player, show all active courts
        else {
            courts = await Court.find({ status: 'Active' })
                               .populate('futsalId', 'name location coordinates operatingHours');
        }
        
        console.log('Found courts:', courts);
        res.json(courts);
    } catch (error) {
        console.error('Error in GET courts:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/settings', auth, async (req, res) => {
    try {
        // Get setting from any court of this futsal
        const court = await Court.findOne({ futsalId: req.user.futsal });
        
        res.json({
            requirePrepayment: court?.requirePrepayment || false
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ 
            message: 'Error fetching settings',
            error: error.message 
        });
    }
});

router.put('/prepayment', auth, async (req, res) => {
    try {
        const { requirePrepayment } = req.body;
        if (typeof requirePrepayment !== 'boolean') {
            return res.status(400).json({ 
                message: 'requirePrepayment must be a boolean value' 
            });
        }

        if (!req.user.futsal) {
            return res.status(400).json({ 
                message: 'No futsal associated with this user' 
            });
        }
        
        const result = await Court.updateMany(
            { futsalId: req.user.futsal },
            { $set: { requirePrepayment } }
        );

        res.json({ 
            message: 'Prepayment setting updated successfully',
            requirePrepayment,
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error updating prepayment setting:', error);
        res.status(500).json({ 
            message: 'Error updating prepayment setting',
            error: error.message 
        });
    }
});

// Create a new court
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    console.log('User data:', req.user);
    try {
        // Parse boolean values
        const parseBooleans = (obj) => {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                result[key] = value === 'true';
            }
            return result;
        };

        // Parse nested objects from form data
        const parseNestedObject = (prefix, body) => {
            const obj = {};
            Object.keys(body)
                .filter(key => key.startsWith(`${prefix}.`))
                .forEach(key => {
                    const nestedKey = key.split('.')[1];
                    obj[nestedKey] = body[key];
                });
            return obj;
        };

        const courtData = {
            ...req.body,
            futsalId: req.user.futsal,
            images: req.files ? req.files.map(file => `/uploads/courts/${file.filename}`) : [],
            facilities: parseBooleans({
                changingRooms: req.body['facilities.changingRooms'],
                lighting: req.body['facilities.lighting'],
                parking: req.body['facilities.parking'],
                shower: req.body['facilities.shower']
            }),
            hasPeakHours: req.body.hasPeakHours === 'true',
            hasOffPeakHours: req.body.hasOffPeakHours === 'true',
            peakHours: parseNestedObject('peakHours', req.body),
            offPeakHours: parseNestedObject('offPeakHours', req.body)
        };

        // Convert price strings to numbers
        courtData.priceHourly = Number(courtData.priceHourly);
        if (courtData.hasPeakHours) {
            courtData.pricePeakHours = Number(courtData.pricePeakHours);
        }
        if (courtData.hasOffPeakHours) {
            courtData.priceOffPeakHours = Number(courtData.priceOffPeakHours);
        }

        console.log('Court data being saved:', courtData);

        const court = new Court(courtData);
        await court.save();
        res.status(201).json(court);
    } catch (error) {
        console.error('Error saving court:', error);
        res.status(400).json({ 
            message: error.message, 
            details: error.errors || error 
        });
    }
});

router.get('/:id', auth, verifyMongoose, async (req, res) => {
    try {
        // Log the mongoose readiness state and connection
        console.log('Mongoose ready state:', mongoose.connection.readyState);
        console.log('Attempting to fetch court:', req.params.id);

        // Validate MongoDB ObjectId format using isValidObjectId
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid court ID format'
            });
        }

        const court = await Court.findById(req.params.id)
            .populate({
                path: 'futsalId',
                select: 'name location coordinates'
            });

        if (!court) {
            console.log('Court not found:', req.params.id);
            return res.status(404).json({
                message: 'Court not found'
            });
        }

        // Add extra logging for successful retrieval
        console.log('Successfully retrieved court:', {
            id: court._id,
            name: court.name,
            futsalId: court.futsalId
        });

        res.json(court);

    } catch (error) {
        // Enhanced error logging
        console.error('Court retrieval error:', {
            error: error.message,
            stack: error.stack,
            courtId: req.params.id,
            mongooseState: mongoose.connection.readyState
        });

        res.status(500).json({
            message: 'Error retrieving court',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

router.get('/:id/bookings', auth, async (req, res) => {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }
      
      // Parse the date
      const bookingDate = new Date(date);
      
      // Get all bookings for this court on this date
      const bookings = await Booking.find({
        court: req.params.id,
        date: {
          $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
          $lt: new Date(bookingDate.setHours(23, 59, 59, 999))
        },
        status: { $ne: 'cancelled' }
      });
      
      res.json(bookings);
      
    } catch (error) {
      console.error('Error fetching court bookings:', error);
      res.status(500).json({
        message: 'Failed to fetch court bookings',
        error: error.message
      });
    }
  });


// Update a court
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
    try {
        // First, let's construct our update object carefully
        const updateData = {};

        // Handle basic fields
        const basicFields = ['name', 'dimensions', 'surfaceType', 'courtType', 'status'];
        basicFields.forEach(field => {
            if (req.body[field]) {
                updateData[field] = req.body[field];
            }
        });

        // Handle numeric fields
        updateData.priceHourly = Number(req.body.priceHourly);

        // Handle boolean fields
        updateData.hasPeakHours = req.body.hasPeakHours === 'true';
        updateData.hasOffPeakHours = req.body.hasOffPeakHours === 'true';

        // Handle facilities as a complete object
        updateData.facilities = {
            changingRooms: req.body['facilities.changingRooms'] === 'true',
            lighting: req.body['facilities.lighting'] === 'true',
            parking: req.body['facilities.parking'] === 'true',
            shower: req.body['facilities.shower'] === 'true'
        };

        // Handle peak hours as a complete object
        if (updateData.hasPeakHours) {
            updateData.peakHours = {
                start: req.body['peakHours.start'],
                end: req.body['peakHours.end']
            };
            updateData.pricePeakHours = Number(req.body.pricePeakHours);
        }

        // Handle off-peak hours as a complete object
        if (updateData.hasOffPeakHours) {
            updateData.offPeakHours = {
                start: req.body['offPeakHours.start'],
                end: req.body['offPeakHours.end']
            };
            updateData.priceOffPeakHours = Number(req.body.priceOffPeakHours);
        }

        // Handle images if new ones are uploaded
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/courts/${file.filename}`);
        }

        console.log('Update data:', updateData); // For debugging

        // Use findByIdAndUpdate with the complete update object
        const court = await Court.findByIdAndUpdate(
            req.params.id,
            updateData,
            { 
                new: true,
                runValidators: true
            }
        );

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        res.json(court);
    } catch (error) {
        console.error('Error updating court:', error);
        res.status(400).json({ 
            message: error.message, 
            details: error.errors || error 
        });
    }
});
    
// Delete a court
router.delete('/:id', auth, async (req, res) => {
    try {
        await Court.findByIdAndDelete(req.params.id);
        res.json({ message: 'Court deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;