// helpers/resourceHelper.js

// Import static resource data
import resources from "../data/resources.json";

/**
 * Get a list of all supported countries
 * Only countries with defined emergency contacts
 */
export function getCountries() {
  // Only Singapore, Japan, England
  return Object.keys(resources.states).filter((c) =>
    ["Singapore", "Japan", "England"].includes(c),
  );
}

/**
 * Get states/regions for a country
 */
export function getStates(country) {
  return resources.states[country] || [];
}

/**
 * Get emergency contacts for a specific country
 */
export function getEmergencyContacts(country) {
  return resources.emergencyContacts[country] || [];
}

/**
 * Get shelters for a country/state
 */
export function getShelters(country, state) {
  return resources.shelters?.[country]?.[state] || [];
}

/**
 * Get all disaster info
 */
export const getDisasterInfo = () => {
  return resources.disasterInfo || [];
};
