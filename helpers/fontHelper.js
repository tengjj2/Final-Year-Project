import AsyncStorage from "@react-native-async-storage/async-storage";

const FONT_SIZE_KEY = "appFontSize";

let fontScale = 1;

/*
Load font size from storage
*/
export async function loadFontSize() {
  try {
    const saved = await AsyncStorage.getItem(FONT_SIZE_KEY);
    return saved || "medium";
  } catch (error) {
    console.log("Error loading font size:", error);
    return "medium";
  }
}

/*
Save font size
*/
export async function saveFontSize(size) {
  try {
    await AsyncStorage.setItem(FONT_SIZE_KEY, size);
  } catch (error) {
    console.log("Error saving font size:", error);
  }
}

/*
Initialize font scale
*/
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

/*
Scale font
*/
export function scaleFont(size) {
  return size * fontScale;
}
