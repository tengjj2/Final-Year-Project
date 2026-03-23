// helpers/fontHelper.js

// AsyncStorage to save/load user font size preference
import AsyncStorage from "@react-native-async-storage/async-storage";

// Key used in AsyncStorage
const FONT_SIZE_KEY = "appFontSize";

// Current font scale multiplier (default 1)
let fontScale = 1;

// Load saved font size ffrom AsyncStorage
export async function loadFontSize() {
  try {
    const saved = await AsyncStorage.getItem(FONT_SIZE_KEY);
    return saved || "medium";
  } catch (error) {
    console.log("Error loading font size:", error);
    return "medium";
  }
}

// Save font size to AsyncStorage
export async function saveFontSize(size) {
  try {
    await AsyncStorage.setItem(FONT_SIZE_KEY, size);
  } catch (error) {
    console.log("Error saving font size:", error);
  }
}

// Update the in-memory font scale based on size name
export function updateFontScale(sizeName) {
  switch (sizeName) {
    case "small":
      fontScale = 0.8;
      break;
    case "medium":
      fontScale = 1;
      break;
    case "large":
      fontScale = 1.2;
      break;
    case "extraLarge":
      fontScale = 1.4;
      break;
    default:
      fontScale = 1;
  }
}

// Return a scaled font size for consistent sizing across the app
export function scaleFont(size) {
  return size * fontScale;
}
