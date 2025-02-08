// models/tournament.model.js
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    registrationDeadline: {
        type: Date,
        required: true
    },
    halfDuration: {
        type: Number,
        required: true,
        min: 10,
        max: 45
    },
    breakDuration: {
        type: Number,
        required: true,
        min: 5,
        max: 15
    },
    format: {
        type: String,
        enum: ['single', 'double'],
        default: 'single'
    },
    maxTeams: {
        type: Number,
        required: true,
        enum: [8, 16, 32]
    },
    teamSize: {
        type: Number,
        required: true,
        enum: [5, 6, 7]
    },
    substitutes: {
        type: Number,
        required: true,
        enum: [2, 3, 4]
    },
    registrationFee: {
        type: Number,
        required: true,
        min: 0
    },
    prizePool: {
        type: Number,
        required: true,
        min: 0
    },
    rules: {
        type: String,
        required: true
    },
    banner: {
        type: String
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    registeredTeams: {
        type: Number,
        default: 0
    },
    futsalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Futsal',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);