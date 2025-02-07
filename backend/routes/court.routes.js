const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Court = require('../models/court.model');
const multer = require('multer');
const path = require('path');
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

// Get all courts for the futsal
router.get('/', auth, async (req, res) => {
    try {
        console.log('User making request:', req.user) // Log user
        console.log('User futsal:', req.user.futsal) // Log futsal ID
        
        const courts = await Court.find({ futsalId: req.user.futsal })
        console.log('Found courts:', courts) // Log found courts
        
        res.json(courts)
    } catch (error) {
        console.error('Error in GET courts:', error)
        res.status(500).json({ message: error.message })
    }
})

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