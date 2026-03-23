// helpers/emergencyHelper.js

// Load resource data
import resources from "../data/resources.json";

// Store current emergency in memory
let currentEmergency = null;

// List of supported countries
export const allowedCountries = ["Singapore", "England", "Japan"];

// Simulate sending a notification and store the emergency
export function sendNotification(emergency) {
  currentEmergency = emergency;
  alert(`${emergency.title}\n${emergency.message}`);
}

// Get the currently active emergency
export function getCurrentEmergency() {
  return currentEmergency;
}

// Clear the current emergency
export function clearCurrentEmergency() {
  currentEmergency = null;
}

// Get a random emergency from the dataset
export function getRandomEmergency() {
  const emergencies = resources.disasterInfo || [];

  if (emergencies.length === 0) return null;

  const index = Math.floor(Math.random() * emergencies.length);
  return emergencies[index];
}

// Get instructions for a selected emergency
export function getEmergencyInstructions(emergency) {
  if (!emergency || !Array.isArray(emergency.instructions)) return [];
  return emergency.instructions;
}

// Get emergency contact numbers based on country
export function getEmergencyContacts(country) {
  if (!country) return [];
  return resources.emergencyContacts[country] || [];
}

// Check if the selected or detected country is valid
export function validateCountry(deviceCountry, selectedCountry) {
  const country = deviceCountry || selectedCountry;

  if (!country || !allowedCountries.includes(country)) {
    return {
      valid: false,
      message: "Please enable location or select your country.",
    };
  }

  return { valid: true, country };
}

// Math logic to simulate an emergency event
export function simulateEmergencyLogic(deviceCountry, selectedCountry) {
  const validation = validateCountry(deviceCountry, selectedCountry);

  // Stop if country is invalid
  if (!validation.valid) {
    return { error: validation.message };
  }

  const emergency = getRandomEmergency();

  // Handle case where no emergency data exists
  if (!emergency) {
    clearCurrentEmergency();
    return { error: "No emergencies available." };
  }

  // Trigger simulated notification
  sendNotification(emergency);

  return { data: emergency };
}

// Get emergency contacts with validation check
export function getEmergencyContactsSafe(deviceCountry, selectedCountry) {
  const validation = validateCountry(deviceCountry, selectedCountry);

  if (!validation.valid) {
    return { error: validation.message };
  }

  const contacts = getEmergencyContacts(validation.country);

  // Handle missing contact data
  if (!contacts || contacts.length === 0) {
    return {
      error: `Emergency numbers for ${validation.country} are not available.`,
    };
  }

  return { data: contacts, country: validation.country };
}
