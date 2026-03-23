// helpers/theme.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage keys
const THEME_KEY = "appTheme";
const PURCHASED_THEMES_KEY = "purchasedThemes";

// Theme definitions
export const defaultTheme = {
  name: "Teal",
  primary: "#0f8f84",
  secondary: "#7ed6c9",
  background: "#f5f6fa",
  accent: "#e8f7f5",
  text: "#2d3436",
};

export const darkBlueTheme = {
  name: "Dark Blue",
  primary: "#1a3c6e",
  secondary: "#5a7ecb",
  background: "#e6f0ff",
  accent: "#cce0ff",
  text: "#2d3436",
};

export const orangeTheme = {
  name: "Orange",
  primary: "#FF8C42",
  secondary: "#FFA66B",
  accent: "#FFD6A5",
  text: "#fff",
};

export const pinkTheme = {
  name: "Pink",
  primary: "#FF4D94",
  secondary: "#FF85B3",
  accent: "#FFC1DE",
  text: "#fff",
};

// Theme persistence helpers

// Save current theme
export async function setTheme(theme) {
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(theme));
}

// Load current theme (default if none)
export async function loadTheme() {
  const saved = await AsyncStorage.getItem(THEME_KEY);
  return saved ? JSON.parse(saved) : defaultTheme;
}

// Save purchased theme
export async function purchaseTheme(themeName) {
  const purchased =
    JSON.parse(await AsyncStorage.getItem(PURCHASED_THEMES_KEY)) || [];
  if (!purchased.includes(themeName)) {
    purchased.push(themeName);
    await AsyncStorage.setItem(PURCHASED_THEMES_KEY, JSON.stringify(purchased));
  }
}

// Load purchased themes
export async function loadPurchasedThemes() {
  return JSON.parse(await AsyncStorage.getItem(PURCHASED_THEMES_KEY)) || [];
}
