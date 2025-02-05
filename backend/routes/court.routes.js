const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Court = require('../models/court.model');
const multer = require('multer');
const path = require('path');

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
        const courts = await Court.find({ futsalId: req.user.futsalId });
        res.json(courts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new court
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    console.log('User data:', req.user); 
    try {
        const courtData = {
            ...req.body,
            futsalId: req.user.futsal,
            images: req.files ? req.files.map(file => `/uploads/courts/${file.filename}`) : []
        };

        console.log('Court data being saved:', courtData); 

        // Convert string boolean values to actual booleans
        courtData.facilities = {
            changingRooms: req.body.changingRooms === 'true',
            lighting: req.body.lighting === 'true',
            parking: req.body.parking === 'true',
            shower: req.body.shower === 'true'
        };

        const court = new Court(courtData);
        await court.save();
        res.status(201).json(court);
    } catch (error) {
        console.log('Court data being saved:', courtData); 
        res.status(400).json({ message: error.message, details: error.errors });
    }
});

// Update a court
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
    try {
        const courtData = { ...req.body };
        if (req.files && req.files.length > 0) {
            courtData.images = req.files.map(file => `/uploads/courts/${file.filename}`);
        }

        const court = await Court.findByIdAndUpdate(
            req.params.id,
            courtData,
            { new: true }
        );
        res.json(court);
    } catch (error) {
        res.status(400).json({ message: error.message, details: error.errors });
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