// helpers/themeContext.js
import React, { createContext, useState, useEffect } from "react";
import { defaultTheme, loadTheme, setTheme as saveTheme } from "./theme";

export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
  resetTheme: () => {},
  resetFlag: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [resetFlag, setResetFlag] = useState(false);

  // Load saved theme once on mount
  useEffect(() => {
    const init = async () => {
      const savedTheme = await loadTheme();
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    };
    init();
  }, []);

  // Update theme state and save to storage
  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    await saveTheme(newTheme);
  };

  // Reset theme to default and toggle resetFlag to notify
  const resetTheme = async () => {
    setThemeState(defaultTheme);
    await saveTheme(defaultTheme);
    setResetFlag((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme, resetFlag }}>
      {children}
    </ThemeContext.Provider>
  );
}
