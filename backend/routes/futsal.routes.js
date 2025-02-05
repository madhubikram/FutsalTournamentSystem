// routes/futsal.routes.js
const express = require('express');
const router = express.Router();  // Add this line
const auth = require('../middleware/auth.middleware');
const Futsal = require('../models/futsal.model');
const User = require('../models/user.model');

// routes/futsal.routes.js
// routes/futsal.routes.js
router.post('/profile', auth, async (req, res) => {
    try {
        console.log('Creating futsal profile for user:', req.user._id);
        console.log('Request body:', req.body);

        // Validate input
        if (!req.body || !req.body.description || !req.body.location) {
            return res.status(400).json({
                message: 'Missing required fields',
                received: req.body
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

module.exports = router;  // Add this line