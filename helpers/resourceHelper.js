// helpers/resourceHelper.js

import resources from "../data/resources.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

// Resource Options for UI
export const RESOURCE_OPTIONS = [
  {
    type: "contacts",
    icon: "call-outline",
    title: "Emergency Contacts",
    sub: "Find help fast",
  },
  {
    type: "shelters",
    icon: "location-outline",
    title: "Emergency Shelters",
    sub: "Find nearby safe locations",
  },
  {
    type: "disasterInfo",
    icon: "shield-checkmark-outline",
    title: "Safety Guides",
    sub: "Step-by-step instructions",
  },
  {
    type: "disasters",
    icon: "information-circle-outline",
    title: "Disaster Information",
    sub: "Learn about emergencies",
  },
];

// Country and State Helpers

// Get list of supported countries
export function getCountries() {
  return Object.keys(resources.states).filter((c) =>
    ["Singapore", "Japan", "England"].includes(c),
  );
}

// Get list of states/regions for a given country
export function getStates(country) {
  return resources.states[country] || [];
}

// Emergency Resource Helpers

// Get emergency contacts for a country
export function getEmergencyContacts(country) {
  return resources.emergencyContacts[country] || [];
}

// Get shelters for a given country and state
export function getShelters(country, state) {
  return resources.shelters?.[country]?.[state] || [];
}

// Get disaster info (safety guides)
export const getDisasterInfo = () => {
  return resources.disasterInfo || [];
};

// Location Persistence Helpers

// Load saved location from AsyncStorage
export const loadSavedLocation = async () => {
  const country = await AsyncStorage.getItem("country");
  const state = await AsyncStorage.getItem("state");
  return { country, state };
};

// Save selected location to AsyncStorage
export const saveLocation = async (country, state) => {
  await AsyncStorage.setItem("country", country);
  await AsyncStorage.setItem("state", state);
};

// Device Action Helpers

// Call a phone number using device dialer
export const callNumber = (number) => {
  Linking.openURL(`tel:${number}`);
};

// Open address in Google Maps
export const openMap = (address) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;
  Linking.openURL(url);
};

// Resource Filtering

// Filter resources based on type and search text
export const filterResource = (item, type, searchText) => {
  const lower = searchText.toLowerCase();

  // Match by contact name
  if (type === "contacts") {
    return item.name.toLowerCase().includes(lower);
  }

  // Match by name or address
  if (type === "shelters") {
    return (
      item.name.toLowerCase().includes(lower) ||
      item.address.toLowerCase().includes(lower)
    );
  }

  // Match by title or instructions text
  if (type === "disasterInfo") {
    return (
      item.title.toLowerCase().includes(lower) ||
      item.instructions.some((t) => t.toLowerCase().includes(lower))
    );
  }

  // Match by title or description
  if (type === "disasters") {
    return (
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower)
    );
  }

  return true;
};
