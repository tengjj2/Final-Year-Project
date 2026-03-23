// screens/SettingsScreen.js

import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { ThemeContext } from "../helpers/themeContext";
import BottomNavigation from "../helpers/bottomNavigation";

import {
  scaleFont,
  updateFontScale,
  loadFontSize,
  saveFontSize,
} from "../helpers/fontHelper";

import { loadLanguage, saveLanguage } from "../helpers/languageHelper";
import { resetAllAppData } from "../helpers/settingsHelper";

export default function SettingsScreen() {
  const { t } = useTranslation();

  // State Management
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("medium");
  const [resetting, setResetting] = useState(false);

  // Access theme context
  const { theme, resetTheme } = useContext(ThemeContext);

  // Initial Load (Language & Font)
  useEffect(() => {
    initializeSettings();
  }, []);

  const initializeSettings = async () => {
    const lang = await loadLanguage();
    const size = await loadFontSize();

    setCurrentLanguage(lang);
    setFontSize(size);

    updateFontScale(size);
    i18n.changeLanguage(lang);
  };

  // Language Handling
  const changeLanguage = async (lang) => {
    await saveLanguage(lang);
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Font Size Handling
  const changeFontSize = async (size) => {
    await saveFontSize(size);
    setFontSize(size);
    updateFontScale(size);
  };

  // Reset App
  const handleResetApp = () => {
    Alert.alert(
      t("dangerZone"),
      t("resetWarning") ||
        "This will reset points, purchased themes, settings, and preferences. Are you sure?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("reset") || "Reset",
          style: "destructive",
          onPress: async () => {
            setResetting(true);

            // Reset all AsyncStorage data (including gamification, themes, etc.)
            await resetAllAppData();

            // Reset theme to default
            await resetTheme();

            // Reset language to English
            await saveLanguage("en");
            setCurrentLanguage("en");
            i18n.changeLanguage("en");

            // Reset font size to medium
            await saveFontSize("medium");
            setFontSize("medium");
            updateFontScale("medium");

            setResetting(false);

            Alert.alert(
              t("resetCompleteTitle") || "Reset Complete",
              t("resetComplete") || "App has been reset to default settings.",
            );
          },
        },
      ],
    );
  };

  // JSX
  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text
          style={{
            fontSize: scaleFont(16),
            marginBottom: 20,
            color: "#636e72",
          }}
        >
          {t("subtitle")}
        </Text>

        {/* Text Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(18) }]}>
            {t("textSize")}
          </Text>

          {[
            { key: "small", label: t("textSmall") },
            { key: "medium", label: t("textMedium") },
            { key: "large", label: t("textLarge") },
            { key: "extraLarge", label: t("textExtraLarge") },
          ].map((size) => (
            <TouchableOpacity
              key={size.key}
              style={[
                styles.optionButton,
                {
                  backgroundColor: theme.accent,
                },
              ]}
              onPress={() => changeFontSize(size.key)}
            >
              <Text style={{ fontSize: scaleFont(16) }}>{size.label}</Text>

              {fontSize === size.key && (
                <Ionicons name="checkmark" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(18) }]}>
            {t("language")}
          </Text>

          {[
            { code: "en", label: "English" },
            { code: "ms", label: "Bahasa Melayu" },
            { code: "zh", label: "中文" },
            { code: "ja", label: "日本語" },
            { code: "es", label: "Español" },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.optionButton,
                {
                  backgroundColor: theme.accent,
                },
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={{ fontSize: scaleFont(16) }}>{lang.label}</Text>

              {currentLanguage === lang.code && (
                <Ionicons name="checkmark" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}

          {/* Beta notice */}
          <View style={styles.betaNotice}>
            <Ionicons name="alert-circle-outline" size={18} color="#ffa500" />
            <Text
              style={{
                fontSize: scaleFont(13),
                marginLeft: 6,
                color: "#636e72",
                fontStyle: "italic",
                flexShrink: 1,
              }}
            >
              {t("languageBetaNotice")}
            </Text>
          </View>
        </View>

        {/* Danger zone*/}
        <View style={styles.dangerZone}>
          <Ionicons name="alert-circle" size={34} color="#d63031" />
          <Text
            style={{
              fontSize: scaleFont(18),
              fontWeight: "bold",
              color: "#d63031",
              marginTop: 8,
            }}
          >
            {t("dangerZone") || "Danger Zone"}
          </Text>

          {/* Reset */}
          <Text
            style={{
              fontSize: scaleFont(14),
              color: "#b71c1c",
              textAlign: "center",
              marginVertical: 12,
              lineHeight: 20,
            }}
          >
            {t("resetDescription")}
            <Text style={{ fontWeight: "bold" }}>{t("resetBold")}</Text>
            {t("resetDescription2")}
          </Text>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetApp}
            disabled={resetting}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: scaleFont(16),
                fontWeight: "bold",
              }}
            >
              {resetting
                ? t("resetting") || "Resetting..."
                : t("resetData") || "Reset App"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavigation activeKey="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  content: {
    padding: 20,
    paddingBottom: 140,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2d3436",
  },

  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#dfe6e9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  betaNotice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  dangerZone: {
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ffe6e6",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    alignItems: "center",
  },

  resetButton: {
    backgroundColor: "#d63031",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});
