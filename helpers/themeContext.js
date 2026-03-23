// helpers/themeContext.js
import React, { createContext, useState, useEffect } from "react";
import { defaultTheme, loadTheme, setTheme as saveTheme } from "./theme";

// Create Theme Context
export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
  resetTheme: () => {},
  resetFlag: false,
});

// Theme Provider Component
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [resetFlag, setResetFlag] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const init = async () => {
      const savedTheme = await loadTheme();
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    };
    init();
  }, []);

  // Set a new theme and persist it
  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    await saveTheme(newTheme);
  };

  // Reset theme to default and toggle resetFlag
  const resetTheme = async () => {
    setThemeState(defaultTheme);
    await saveTheme(defaultTheme);
    setResetFlag((prev) => !prev);
  };

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme, resetFlag }}>
      {children}
    </ThemeContext.Provider>
  );
}
