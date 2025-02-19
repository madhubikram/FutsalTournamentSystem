const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Futsal = require('../models/futsal.model');
const User = require('../models/user.model');

router.post('/profile', auth, async (req, res) => {
    try {
        console.log('Creating futsal profile for user:', req.user._id);
        console.log('Request body:', req.body);

        // Basic input validation
        if (!req.body || !req.body.description || !req.body.location) {
            return res.status(400).json({
                message: 'Missing required fields',
                received: req.body
            });
        }

        // Operating hours validation
        if (!req.body.operatingHours || 
            !req.body.operatingHours.opening || 
            !req.body.operatingHours.closing) {
            return res.status(400).json({
                message: 'Operating hours are required',
                received: req.body.operatingHours
            });
        }

        // Time format validation using regex
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(req.body.operatingHours.opening) || 
            !timeRegex.test(req.body.operatingHours.closing)) {
            return res.status(400).json({
                message: 'Invalid time format. Please use HH:mm format'
            });
        }

        const futsalData = {
            name: req.user.futsalName,
            description: req.body.description,
            location: req.body.location.address,
            coordinates: {
                lat: req.body.location.lat,
                lng: req.body.location.lng
            },
            operatingHours: {
                opening: req.body.operatingHours.opening,
                closing: req.body.operatingHours.closing
            },
            owner: req.user._id
        };

        console.log('Creating futsal with data:', futsalData);

        const futsal = new Futsal(futsalData);
        await futsal.save();

        // Update user with futsal reference and completion status
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            profileCompleted: true,
            futsal: futsal._id
        }, { new: true });

        console.log('Updated user:', updatedUser);

        res.status(201).json({
            message: 'Futsal profile created successfully',
            futsal,
            user: updatedUser
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            message: 'Failed to create futsal profile',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;