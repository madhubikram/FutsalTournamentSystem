// controllers/tournament.controller.js
const Tournament = require('../models/tournament.model');
const fs = require('fs').promises;
const path = require('path');

// Helper function to delete file
const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

const tournamentController = {
    createTournament: async (req, res) => {
        try {
            const tournamentData = {
                ...req.body,
                banner: req.file ? `/uploads/tournaments/${req.file.filename}` : null,
                futsalId: req.user.futsal
            };

            const tournament = new Tournament(tournamentData);
            await tournament.save();

            res.status(201).json(tournament);
        } catch (error) {
            console.error('Error creating tournament:', error);
            res.status(400).json({ message: error.message });
        }
    },

    getTournaments: async (req, res) => {
        try {
            const tournaments = await Tournament.find({ futsalId: req.user.futsal });
            res.json(tournaments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTournament: async (req, res) => {
        try {
            const tournament = await Tournament.findOne({
                _id: req.params.id,
                futsalId: req.user.futsal
            });
            if (!tournament) {
                return res.status(404).json({ message: 'Tournament not found' });
            }
            res.json(tournament);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTournament: async (req, res) => {
        try {
            const updateData = {
                ...req.body
            };
            if (req.file) {
                updateData.banner = `/uploads/tournaments/${req.file.filename}`;
            }

            const tournament = await Tournament.findOneAndUpdate(
                { _id: req.params.id, futsalId: req.user.futsal },
                updateData,
                { new: true }
            );

            if (!tournament) {
                return res.status(404).json({ message: 'Tournament not found' });
            }

            res.json(tournament);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteTournament: async (req, res) => {
        try {
            const tournament = await Tournament.findOneAndDelete({
                _id: req.params.id,
                futsalId: req.user.futsal
            });

            if (!tournament) {
                return res.status(404).json({ message: 'Tournament not found' });
            }

            res.json({ message: 'Tournament deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = tournamentController;