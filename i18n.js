// i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import ja from "./locales/ja/translation.json";
import ms from "./locales/ms/translation.json";
import zh from "./locales/zh/translation.json";

const deviceLanguage =
  Localization?.getLocales?.()?.[0]?.languageCode || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    ja: { translation: ja },
    ms: { translation: ms },
    zh: { translation: zh },
  },

  lng: deviceLanguage,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;