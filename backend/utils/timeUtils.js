// D:\Islington\Sem 5\FYP\Development\FutNet\backend\utils\timeUtils.js

// Function to convert time string to minutes
const timeToMinutes = (time) => {
    if (!time) return 0
    const [hours, minutes] = time.split(':').map(Number)
    return (hours * 60) + minutes
}

// Function to check if a time is within operating hours
const isWithinOperatingHours = (timeToCheck, openingTime, closingTime) => {
    if (!timeToCheck || !openingTime || !closingTime) {
        return false
    }

    const check = timeToMinutes(timeToCheck)
    const open = timeToMinutes(openingTime)
    const close = timeToMinutes(closingTime)

    // Add debug logging to help track time calculations
    console.log('Operating hours check:', {
        timeToCheck: `${timeToCheck} (${check} minutes)`,
        openingTime: `${openingTime} (${open} minutes)`,
        closingTime: `${closingTime} (${close} minutes)`
    })

    return check >= open && check <= close
}

// Function to check if a time is within a specific range
const isTimeInRange = (currentTime, start, end) => {
    if (!start || !end || !currentTime) {
        console.log('Missing time parameters:', { currentTime, start, end })
        return false
    }

    const current = timeToMinutes(currentTime)
    const startMinutes = timeToMinutes(start)
    const endMinutes = timeToMinutes(end)

    console.log('Time range check:', {
        current: `${currentTime} (${current} minutes)`,
        start: `${start} (${startMinutes} minutes)`,
        end: `${end} (${endMinutes} minutes)`
    })

    return current >= startMinutes && current <= endMinutes
}

// Function to generate time slots
const getTimeSlots = (openingTime, closingTime, slotDuration = 60) => {
    const slots = []
    const [openHours, openMinutes] = openingTime.split(':').map(Number)
    const [closeHours, closeMinutes] = closingTime.split(':').map(Number)

    let currentTime = openHours * 60 + openMinutes
    const endTime = closeHours * 60 + closeMinutes

    while (currentTime + slotDuration <= endTime) {
        const hours = Math.floor(currentTime / 60)
        const minutes = currentTime % 60
        const endHours = Math.floor((currentTime + slotDuration) / 60)
        const endMinutes = (currentTime + slotDuration) % 60

        slots.push({
            start: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
            end: `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
        })

        currentTime += slotDuration
    }

    return slots
}

// Use CommonJS exports since we're in a Node.js environment
module.exports = {
    timeToMinutes,
    isTimeInRange,
    isWithinOperatingHours,
    getTimeSlots
}