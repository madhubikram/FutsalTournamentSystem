const isWithinOperatingHours = (timeToCheck, openingTime, closingTime) => {
    if (!timeToCheck || !openingTime || !closingTime) {
        return false;
    }

    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const check = timeToMinutes(timeToCheck);
    const open = timeToMinutes(openingTime);
    const close = timeToMinutes(closingTime);

    return check >= open && check <= close;
};


const getTimeSlots = (openingTime, closingTime, slotDuration = 60) => {
    const slots = [];
    const [openHours, openMinutes] = openingTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closingTime.split(':').map(Number);

    let currentTime = openHours * 60 + openMinutes;
    const endTime = closeHours * 60 + closeMinutes;

    while (currentTime + slotDuration <= endTime) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const endHours = Math.floor((currentTime + slotDuration) / 60);
        const endMinutes = (currentTime + slotDuration) % 60;

        slots.push({
            start: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
            end: `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
        });

        currentTime += slotDuration;
    }

    return slots;
};

module.exports = {
    isWithinOperatingHours,
    getTimeSlots
};