// utils/tournamentStatus.js
const Tournament = require('../models/tournament.model');

const updateTournamentStatuses = async () => {
    try {
      const now = new Date();
  
      // Update tournaments with passed registration deadlines to no longer be "Upcoming"
      await Tournament.updateMany({
        status: 'Upcoming',
        registrationDeadline: { $lt: now }
      }, {
        $set: { registrationClosed: true }
      });
  
      // Update Upcoming to Ongoing
      await Tournament.updateMany({
        status: 'Upcoming',
        startDate: { $lte: now }
      }, {
        status: 'Ongoing'
      });
  
      // Update Ongoing to Completed
      await Tournament.updateMany({
        status: 'Ongoing',
        endDate: { $lte: now }
      }, {
        status: 'Completed'
      });
  
      console.log('Tournament statuses updated');
    } catch (error) {
      console.error('Error updating tournament statuses:', error);
    }
  };

module.exports = { updateTournamentStatuses };