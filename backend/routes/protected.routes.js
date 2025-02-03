const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
// We need to create this model next
const Futsal = require('../models/futsal.model');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Create futsal
router.post('/futsal/create', auth, async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'futsalAdmin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { name, location, facilities, pricePerHour } = req.body;

        // Validation
        if (!name || !location || !pricePerHour) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newFutsal = new Futsal({
            name,
            location,
            facilities,
            pricePerHour,
            owner: req.user._id
        });

        await newFutsal.save();
        res.status(201).json({ message: 'Futsal created successfully', futsal: newFutsal });
    } catch (error) {
        res.status(500).json({ message: 'Error creating futsal', error: error.message });
    }
});

// Get all futsals with filtering
router.get('/futsals', async (req, res) => {
    try {
        const { location, minPrice, maxPrice } = req.query;
        let query = {};

        if (location) query.location = new RegExp(location, 'i');
        if (minPrice || maxPrice) {
            query.pricePerHour = {};
            if (minPrice) query.pricePerHour.$gte = minPrice;
            if (maxPrice) query.pricePerHour.$lte = maxPrice;
        }

        const futsals = await Futsal.find(query).populate('owner', 'username');
        res.json({ futsals });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching futsals', error: error.message });
    }
});

module.exports = router;