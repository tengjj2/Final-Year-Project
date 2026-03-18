// helpers/emergencyHelper.js

// Import resources JSON
import resources from "../data/resources.json";

// In-memory variable to store the currently active emergency
let currentEmergency = null;

/**
 * Simulates sending a notification to the user
 */
export function sendNotification(emergency) {
  currentEmergency = emergency;
  alert(`${emergency.title}\n${emergency.message}`);
}

/**
 * Returns the currently active emergency
 */
export function getCurrentEmergency() {
  return currentEmergency;
}

/**
 * Clears the currently stored emergency
 */
export function clearCurrentEmergency() {
  currentEmergency = null;
}

/**
 * Returns a random emergency from resources.json
 */
export function getRandomEmergency() {
  const emergencies = resources.disasterInfo || [];

  if (emergencies.length === 0) return null;

  const index = Math.floor(Math.random() * emergencies.length);
  return emergencies[index];
}

/**
 * Returns step-by-step instructions
 */
export function getEmergencyInstructions(emergency) {
  if (!emergency || !Array.isArray(emergency.instructions)) return [];
  return emergency.instructions;
}

/**
 * Returns emergency contact numbers based on country
 */
export function getEmergencyContacts(country) {
  if (!country) return [];
  return resources.emergencyContacts[country] || [];
}
