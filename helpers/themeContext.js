// helpers/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import { defaultTheme, loadTheme, setTheme as saveTheme } from "./theme";

export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(defaultTheme);

  useEffect(() => {
    const initTheme = async () => {
      const savedTheme = await loadTheme();
      setThemeState(savedTheme);
    };
    initTheme();
  }, []);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);    // update context state
    await saveTheme(newTheme);  // save to AsyncStorage
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}