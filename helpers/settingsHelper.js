import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearCurrentEmergency } from "./emergencyHelper";

const FONT_SIZE_KEY = "appFontSize";
const LANGUAGE_KEY = "appLanguage";

/*
Reset all app data
*/
export async function resetAllAppData() {
  try {
    // Clear all stored data
    await AsyncStorage.clear();

    // Reset emergency state
    clearCurrentEmergency();

    // Restore default settings
    await AsyncStorage.setItem(LANGUAGE_KEY, "en");
    await AsyncStorage.setItem(FONT_SIZE_KEY, "medium");

    return true;
  } catch (error) {
    console.error("Error resetting app data:", error);
    return false;
  }
}
