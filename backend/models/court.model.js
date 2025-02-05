const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    surfaceType: {
        type: String,
        required: true
    },
    courtType: {
        type: String,
        enum: ['Indoor', 'Outdoor'],
        required: true
    },
    priceHourly: {
        type: Number,
        required: true
    },
    pricePeakHours: {
        type: Number,
        required: true
    },
    priceOffPeakHours: {
        type: Number,
        required: true
    },
    facilities: {
        changingRooms: { type: Boolean, default: false },
        lighting: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        shower: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['Active', 'Maintenance', 'Inactive'],
        default: 'Active'
    },
    images: [{
        type: String
    }],
    futsalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Futsal',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Court', courtSchema);