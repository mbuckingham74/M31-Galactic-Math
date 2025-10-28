// Astronomical constants
const LIGHT_YEAR_IN_KM = 9.461e12; // kilometers per light-year
const PARSEC_IN_KM = 3.086e13; // kilometers per parsec
const PARSEC_IN_LY = 3.26156; // light-years per parsec

// M31 Andromeda Galaxy data
const BASE_DISTANCE_LY = 2.537e6; // 2.537 million light-years (2024 reference)
const BASE_DISTANCE_KM = BASE_DISTANCE_LY * LIGHT_YEAR_IN_KM;

// Approach velocity (radial velocity component)
// M31 is approaching us at approximately 110 km/s
const APPROACH_VELOCITY_KMS = 110; // km/s

// Reference date (Jan 1, 2024, 00:00:00 UTC)
const REFERENCE_DATE = new Date('2024-01-01T00:00:00Z');

// Page load time
const PAGE_LOAD_TIME = new Date();

// Calculation functions
function getCurrentDistance() {
    const now = new Date();

    // Calculate seconds elapsed since reference date
    const secondsSinceReference = (now - REFERENCE_DATE) / 1000;

    // Calculate distance traveled (approaching, so we subtract)
    const distanceTraveled = APPROACH_VELOCITY_KMS * secondsSinceReference;

    // Current distance in kilometers
    const currentDistanceKm = BASE_DISTANCE_KM - distanceTraveled;

    return currentDistanceKm;
}

function kmToLightYears(km) {
    return km / LIGHT_YEAR_IN_KM;
}

function kmToParsecs(km) {
    return km / PARSEC_IN_KM;
}

function formatNumber(num, decimals = 2) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(decimals) + ' trillion';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(decimals) + ' billion';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(decimals) + ' million';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(decimals) + ' thousand';
    } else {
        return num.toFixed(decimals);
    }
}

function formatWithCommas(num, decimals = 0) {
    // Format number with comma separators
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');

    // Add commas to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

function formatScientific(num, decimals = 6) {
    return num.toExponential(decimals);
}

function formatElapsedTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) {
        return `${days}d ${hours}h ${mins}m ${secs}s`;
    } else if (hours > 0) {
        return `${hours}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
        return `${mins}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

function updateDisplay() {
    // Get current distance in km
    const distanceKm = getCurrentDistance();

    // Convert to other units
    const distanceLy = kmToLightYears(distanceKm);
    const distancePc = kmToParsecs(distanceKm);

    // Update distance displays with decimals for visible countdown
    document.getElementById('distance-km').textContent = formatWithCommas(distanceKm, 2);
    document.getElementById('distance-ly').textContent = formatWithCommas(distanceLy, 6);
    document.getElementById('distance-pc').textContent = formatWithCommas(distancePc, 6);

    // Update velocity
    document.getElementById('velocity-kms').textContent = APPROACH_VELOCITY_KMS.toFixed(0);

    // Calculate elapsed time since page load
    const now = new Date();
    const elapsedSeconds = (now - PAGE_LOAD_TIME) / 1000;

    // Calculate distance closed since page load
    const distanceClosedKm = APPROACH_VELOCITY_KMS * elapsedSeconds;

    // Update stats
    document.getElementById('elapsed-time').textContent = formatElapsedTime(elapsedSeconds);
    document.getElementById('distance-closed').textContent = formatNumber(distanceClosedKm, 2) + ' km';
    document.getElementById('reference-date').textContent = REFERENCE_DATE.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Update immediately
    updateDisplay();

    // Update every 50ms for smooth real-time countdown effect
    setInterval(updateDisplay, 50);

    // Log some info to console for debugging
    console.log('M31 Distance Calculator Initialized');
    console.log(`Base distance: ${BASE_DISTANCE_LY.toExponential(3)} light-years`);
    console.log(`Approach velocity: ${APPROACH_VELOCITY_KMS} km/s`);
    console.log(`Reference date: ${REFERENCE_DATE.toISOString()}`);
    console.log('Distance is counting down in real-time at 110 km/s');
});
