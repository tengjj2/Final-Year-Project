// i18n.js

// External Libraries
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Local Translation Files
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import ja from "./locales/ja/translation.json";
import ms from "./locales/ms/translation.json";
import zh from "./locales/zh/translation.json";

// Detect Device Language
const deviceLanguage = Localization?.getLocales?.()?.[0]?.languageCode || "en";

// i18n Configuration
i18n.use(initReactI18next).init({
  // Disable console notice
  showSupportNotice: false,

  // Translation resources
  resources: {
    en: { translation: en },
    es: { translation: es },
    ja: { translation: ja },
    ms: { translation: ms },
    zh: { translation: zh },
  },

  // Set initial language and fallback language
  lng: deviceLanguage,
  fallbackLng: "en",

  // Prevent escaping since React already handles XSS protection
  interpolation: {
    escapeValue: false,
  },
});

// Export configured i18n instance
export default i18n;
