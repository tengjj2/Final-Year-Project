// helpers/settingsHelper.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultTheme } from "./theme";

// Keys uesd for gamification data
const POINTS_KEY = "points";
const BADGES_KEY = "badges";
const TASKS_KEY = "completedTasks";
const QUIZZES_KEY = "completedQuizzes";

// Reset all app data to default values
export async function resetAllAppData() {
  try {
    // Reset gamification / preparedness zone data
    await AsyncStorage.removeItem(POINTS_KEY);
    await AsyncStorage.removeItem(BADGES_KEY);
    await AsyncStorage.removeItem(TASKS_KEY);
    await AsyncStorage.removeItem(QUIZZES_KEY);

    // Reset purchased themes
    await AsyncStorage.removeItem("purchasedThemes");

    // Reset font size
    await AsyncStorage.removeItem("fontSize");

    // Reset language
    await AsyncStorage.removeItem("language");

    // Reset location for Resource Hub
    await AsyncStorage.removeItem("country");
    await AsyncStorage.removeItem("state");
    await AsyncStorage.removeItem("location");

    // Reset theme to default
    await AsyncStorage.setItem("theme", JSON.stringify(defaultTheme));

    return true;
  } catch (error) {
    console.error("Error resetting app data:", error);
    return false;
  }
}
