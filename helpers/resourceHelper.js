// helpers/resourceHelper.js

import resources from "../data/resources.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

/**
 * Get supported countries
 */
export function getCountries() {
  return Object.keys(resources.states).filter((c) =>
    ["Singapore", "Japan", "England"].includes(c)
  );
}

/**
 * Get states/regions
 */
export function getStates(country) {
  return resources.states[country] || [];
}

/**
 * Emergency contacts
 */
export function getEmergencyContacts(country) {
  return resources.emergencyContacts[country] || [];
}

/**
 * Shelters
 */
export function getShelters(country, state) {
  return resources.shelters?.[country]?.[state] || [];
}

/**
 * Disaster info
 */
export const getDisasterInfo = () => {
  return resources.disasterInfo || [];
};

/**
 * Load saved location
 */
export const loadSavedLocation = async () => {
  const country = await AsyncStorage.getItem("country");
  const state = await AsyncStorage.getItem("state");
  return { country, state };
};

/**
 * Save location
 */
export const saveLocation = async (country, state) => {
  await AsyncStorage.setItem("country", country);
  await AsyncStorage.setItem("state", state);
};

/**
 * Call number
 */
export const callNumber = (number) => {
  Linking.openURL(`tel:${number}`);
};

/**
 * Open Google Maps
 */
export const openMap = (address) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
  Linking.openURL(url);
};

/**
 * Filter resources (search)
 */
export const filterResource = (item, type, searchText) => {
  const lower = searchText.toLowerCase();

  if (type === "contacts") {
    return item.name.toLowerCase().includes(lower);
  }

  if (type === "shelters") {
    return (
      item.name.toLowerCase().includes(lower) ||
      item.address.toLowerCase().includes(lower)
    );
  }

  if (type === "disasterInfo") {
    return (
      item.title.toLowerCase().includes(lower) ||
      item.instructions.some((t) => t.toLowerCase().includes(lower))
    );
  }

  if (type === "disasters") {
    return (
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower)
    );
  }

  return true;
};