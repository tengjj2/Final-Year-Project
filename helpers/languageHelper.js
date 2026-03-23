// helpers/languageHelper.js

import AsyncStorage from "@react-native-async-storage/async-storage";

// Key used to store the selected language in AsyncStorage
const LANGUAGE_KEY = "appLanguage";

// Load the saved language from AsyncStorage
export async function loadLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    return saved || "en";
  } catch (error) {
    console.log("Error loading language:", error);
    return "en";
  }
}

// Save the selected language to AsyncStorage
export async function saveLanguage(lang) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.log("Error saving language:", error);
  }
}
