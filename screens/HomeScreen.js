// screens/HomeScreen.js

import { useEffect, useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

import { getCurrentEmergency } from "../helpers/emergencyHelper";
import { getUserProgress } from "../helpers/gamification";
import { calculateProgress } from "../helpers/progressHelper";
import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";
import { loadTheme, defaultTheme } from "../helpers/theme";
import { ThemeContext } from "../helpers/themeContext";

import {
  loadFontSize,
  scaleFont,
  updateFontScale,
} from "../helpers/fontHelper";
import { loadLanguage } from "../helpers/languageHelper";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  const [currentAlert, setCurrentAlert] = useState(getCurrentEmergency());
  const [progress, setProgress] = useState(null);
  const [points, setPoints] = useState(0);
  const { theme } = useContext(ThemeContext);

  // Load font size and language on mount
  useEffect(() => {
    const initializeSettings = async () => {
      const size = await loadFontSize();
      const lang = await loadLanguage();

      updateFontScale(size);
      i18n.changeLanguage(lang);
    };

    initializeSettings();
  }, []);

  // Update emergency alerts every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert(getCurrentEmergency());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load user progress on focus
  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        const data = await getUserProgress();
        setPoints(data.points);

        const calculated = calculateProgress({
          tasks,
          quizzes,
          completedTasks: data.completedTasks,
          completedQuizzes: data.completedQuizzes,
        });

        setProgress(calculated);
      };
      loadProgress();
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Emergency Alert */}
      <TouchableOpacity
        style={[
          styles.alertSection,
          currentAlert ? styles.activeAlert : styles.noAlert,
        ]}
        onPress={() => navigation.navigate("EmergencyMode")}
      >
        <Text style={[styles.alertText, { fontSize: scaleFont(16) }]}>
          {currentAlert
            ? `${currentAlert.title}: ${currentAlert.message}`
            : t("noCurrentEmergencies")}
        </Text>
      </TouchableOpacity>

      {/* Preparedness Dashboard */}
      <TouchableOpacity
        style={styles.dashboard}
        onPress={() => navigation.navigate("PreparednessZone")}
      >
        <Text style={[styles.sectionTitle, { fontSize: scaleFont(18) }]}>
          {t("preparednessProgress")}
        </Text>

        {progress ? (
          <>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress.percentage}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>

            <Text style={[styles.progressText, { fontSize: scaleFont(14) }]}>
              {progress.completedActivities} / {progress.totalActivities}{" "}
              {t("activitiesCompleted")}
            </Text>

            <Text style={[styles.pointsText, { fontSize: scaleFont(14) }]}>
              {points} {t("pointsEarned")}
            </Text>
          </>
        ) : (
          <Text style={[styles.progressText, { fontSize: scaleFont(14) }]}>
            {t("loadingProgress")}
          </Text>
        )}
      </TouchableOpacity>

      {/* Action Grid */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.gridItem, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("PreparednessZone")}
        >
          <Ionicons
            name="school"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={[styles.gridText, { fontSize: scaleFont(14) }]}>
            {t("preparednessZoneTitle")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("ResourceHub")}
        >
          <Ionicons
            name="library"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={[styles.gridText, { fontSize: scaleFont(14) }]}>
            {t("resourceHubTitle")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, styles.emergencyGrid]}
          onPress={() => navigation.navigate("EmergencyMode")}
        >
          <Ionicons
            name="warning"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={[styles.gridText, { fontSize: scaleFont(14) }]}>
            {t("emergencyModeTitle")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("Rewards")}
        >
          <Ionicons
            name="gift"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={[styles.gridText, { fontSize: scaleFont(14) }]}>
            {t("rewardsTitle")}
          </Text>
        </TouchableOpacity>

        <View style={[styles.gridItem, styles.disabledGrid]}>
          <Text style={[styles.disabledText, { fontSize: scaleFont(14) }]}>
            {t("comingSoon")}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.gridItem, styles.settingsGrid]}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons
            name="settings"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={[styles.gridText, { fontSize: scaleFont(14) }]}>
            {t("settingsTitle")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f6fa",
  },

  /* Emergency Alert */
  alertSection: {
    minHeight: 120,
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  activeAlert: {
    backgroundColor: "#fdecea",
    borderWidth: 1,
    borderColor: "#c0392b",
  },
  noAlert: {
    backgroundColor: "#dfe6e9",
    borderWidth: 1,
    borderColor: "#b2bec3",
  },
  alertText: {
    fontWeight: "600",
    textAlign: "center",
  },

  /* Dashboard */
  dashboard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2d3436",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#b2bec3",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
    marginTop: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0f8f84",
    borderRadius: 3,
  },
  progressText: {
    marginBottom: 5,
    color: "#2d3436",
  },
  pointsText: {
    fontWeight: "600",
    color: "#2d3436",
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    elevation: 2,
  },
  emergencyGrid: {
    backgroundColor: "#c0392b",
  },
  gridText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  settingsGrid: {
    backgroundColor: "#636e72",
  },
  disabledGrid: {
    backgroundColor: "#dfe6e9",
    elevation: 0,
  },
  gridIcon: {
    marginBottom: 2,
  },
  disabledText: {
    color: "#636e72",
    fontWeight: "600",
  },
});
