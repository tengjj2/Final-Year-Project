import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "appLanguage";

/*
Load saved language
*/
export async function loadLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    return saved || "en";
  } catch (error) {
    console.log("Error loading language:", error);
    return "en";
  }
}

/*
Save language
*/
export async function saveLanguage(lang) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.log("Error saving language:", error);
  }
}
