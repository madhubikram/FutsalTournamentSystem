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
        required: true,
        min: 0
    },
    // New peak hours fields
    hasPeakHours: {
        type: Boolean,
        default: false
    },
    peakHours: {
        start: { type: String },
        end: { type: String }
    },
    pricePeakHours: {
        type: Number,
        min: 0
    },
    // New off-peak hours fields
    hasOffPeakHours: {
        type: Boolean,
        default: false
    },
    offPeakHours: {
        start: { type: String },
        end: { type: String }
    },
    priceOffPeakHours: {
        type: Number,
        min: 0
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

// Validate time ranges
courtSchema.pre('save', function(next) {
    if (this.hasPeakHours) {
        if (!this.peakHours.start || !this.peakHours.end || !this.pricePeakHours) {
            throw new Error('Peak hours settings are incomplete');
        }
    }

    if (this.hasOffPeakHours) {
        if (!this.offPeakHours.start || !this.offPeakHours.end || !this.priceOffPeakHours) {
            throw new Error('Off-peak hours settings are incomplete');
        }
    }

    // Validate time overlap if both types are enabled
    if (this.hasPeakHours && this.hasOffPeakHours) {
        const timeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const peakStart = timeToMinutes(this.peakHours.start);
        const peakEnd = timeToMinutes(this.peakHours.end);
        const offPeakStart = timeToMinutes(this.offPeakHours.start);
        const offPeakEnd = timeToMinutes(this.offPeakHours.end);

        if (peakStart >= peakEnd || offPeakStart >= offPeakEnd) {
            throw new Error('End time must be after start time');
        }

        if (!(peakEnd <= offPeakStart || offPeakEnd <= peakStart)) {
            throw new Error('Peak and off-peak hours cannot overlap');
        }
    }

    next();
});

module.exports = mongoose.model('Court', courtSchema);