import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearCurrentEmergency } from "./emergencyHelper"; // <-- import helper

/**
 * Reset all app data by clearing AsyncStorage and in-memory state
 */
export async function resetAllAppData() {
  try {
    await AsyncStorage.clear(); // clears stored data
    clearCurrentEmergency();    // clears in-memory emergency
    return true;
  } catch (error) {
    console.error("Error resetting app data:", error);
    return false;
  }
}