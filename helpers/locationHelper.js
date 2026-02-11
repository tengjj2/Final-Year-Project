// helpers/locationHelper.js

// Import Expo Location API to get device locaiton and perform reverse geocoding
import * as Location from "expo-location";

/**
 * Get the device's country using Expo Location API
 * Will return `null` if location cannot be obtained within the specified timeout
 */
export async function getDeviceCountry(timeout = 10000) {
  return new Promise(async (resolve) => {
    // Set timeout to prevent long waiting
    const timeoutId = setTimeout(() => resolve(null), timeout);

    try {
      // Ask for location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        clearTimeout(timeoutId);
        resolve(null);
        return;
      }

      // Get current device location
      const loc = await Location.getCurrentPositionAsync({});

      // Reverse geocode to get country information
      const reverse = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // Clear timeout and return country
      clearTimeout(timeoutId);
      resolve(reverse?.[0]?.country || null);
    } catch (err) {
      console.log("Location error:", err);
      clearTimeout(timeoutId);
      resolve(null);
    }
  });
}