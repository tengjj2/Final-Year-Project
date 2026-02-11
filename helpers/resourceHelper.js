// helpers/resourceHelper.js

// Import static resource data
import resources from "../data/resources.json";

/**
 * Get a list of all supported countries
 * Determined by the countries that have emergency contacts defined
 */
export function getCountries() {
  return Object.keys(resources.emergencyContacts);
}

/**
 * Get emergency contacts for a specific country
 * Returns an empty array if the country is not supported
 */
export function getEmergencyContacts(country) {
  return resources.emergencyContacts[country] || [];
}

/**
 * Get all safety tips
 * Returns an empty array if no safety tips are defined
 */
export function getSafetyTips() {
  return resources.safetyTips || [];
}

/**
 * Get shelters for a specfic country
 * Returns an empty array if the country is not supported or no shelters
 */
export function getShelters(country) {
  return resources.shelters?.[country] || [];
}