// helpers/emergencyHelper.js

// Import static data (JSON files)
import emergencies from "../data/emergencies.json";
import resources from "../data/resources.json";

// In-memory variable to store the currently active emergency
let currentEmergency = null;

/**
 * Simulates sending a notification to the user
 * Also stores the selected emergency in memory
 */
export function sendNotification(emergency) {
  currentEmergency = emergency;
  alert(`🚨 ${emergency.title}\n${emergency.message}`);
}

/**
 * Returns the currently active emergency
 * Used by HomeScreen and EmergencyMode screen
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
 * Returns a random emergency from emergencies.json
 * Used to simulate real-life emergency alerts
 */
export function getRandomEmergency() {
  if (!emergencies || emergencies.length === 0) return null;
  const index = Math.floor(Math.random() * emergencies.length);
  return emergencies[index];
}

/**
 * Returns step-by-step instructions for a given emergency
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