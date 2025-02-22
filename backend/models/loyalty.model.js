const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [{
        type: {
            type: String,
            enum: ['earn', 'redeem'],
            required: true
        },
        points: {
            type: Number,
            required: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        description: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate points for a booking amount
loyaltySchema.statics.calculatePoints = function(amount) {
    // 10 points for every Rs. 100
    return Math.floor((amount / 100) * 10);
};

// Add points
loyaltySchema.methods.addPoints = async function(points, bookingId, description) {
    this.points += points;
    this.transactions.push({
        type: 'earn',
        points,
        booking: bookingId,
        description
    });
    this.lastUpdated = new Date();
    await this.save();
};

// Redeem points
loyaltySchema.methods.redeemPoints = async function(points, bookingId, description) {
    if (points > this.points) {
        throw new Error('Insufficient points');
    }
    
    this.points -= points;
    this.transactions.push({
        type: 'redeem',
        points: -points,
        booking: bookingId,
        description
    });
    this.lastUpdated = new Date();
    await this.save();
};

module.exports = mongoose.model('Loyalty', loyaltySchema);