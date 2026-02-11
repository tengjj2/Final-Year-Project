// screens/HomeScreen.js

// React hooks
import { useEffect, useState, useCallback } from "react";

// React Native components
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";

// Navigation hook to run logic when screen comes into focus
import { useFocusEffect } from "@react-navigation/native";

// Helpers
import { getCurrentEmergency } from "../helpers/emergencyHelper";
import { getUserProgress } from "../helpers/gamification";
import { calculateProgress } from "../helpers/progressHelper";

// Datasets
import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";

export default function HomeScreen({ navigation }) {
  // Component state
  const [currentAlert, setCurrentAlert] = useState(getCurrentEmergency());
  const [progress, setProgress] = useState(null);
  const [points, setPoints] = useState(0);

  // Poll for emergency alerts every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert(getCurrentEmergency());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load user's preparedness progress when screen comes into focus
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

  // UI Component
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Emergency Alert Section */}
      <TouchableOpacity
        style={[
          styles.alertSection,
          currentAlert ? styles.activeAlert : styles.noAlert,
        ]}
        onPress={() => navigation.navigate("EmergencyMode")}
      >
        <Text style={styles.alertText}>
          {currentAlert
            ? `${currentAlert.title}: ${currentAlert.message}`
            : "No current emergencies"}
        </Text>
      </TouchableOpacity>

      {/* Preparedness Dashboard */}
      <View style={styles.dashboard}>
        <Text style={styles.sectionTitle}>Preparedness Progress</Text>

        {progress ? (
          <>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress.percentage}%` },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {progress.completedActivities} / {progress.totalActivities}{" "}
              activities completed
            </Text>

            <Text style={styles.pointsText}>⭐ {points} points earned</Text>
          </>
        ) : (
          <Text style={styles.progressText}>Loading progress…</Text>
        )}
      </View>

      {/* Action Grid (3 x 2) */}
      <View style={styles.grid}>
        {/* Row 1 */}
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("PreparednessZone")}
        >
          <Text style={styles.gridText}>Preparedness</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("ResourceHub")}
        >
          <Text style={styles.gridText}>Resource Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridItem, styles.emergencyGrid]}
          onPress={() => navigation.navigate("EmergencyMode")}
        >
          <Text style={styles.gridText}>Emergency Mode</Text>
        </TouchableOpacity>

        {/* Row 2 */}
        <View style={[styles.gridItem, styles.disabledGrid]}>
          <Text style={styles.disabledText}>Coming Soon</Text>
        </View>

        <View style={[styles.gridItem, styles.disabledGrid]}>
          <Text style={styles.disabledText}>Coming Soon</Text>
        </View>

        <View style={[styles.gridItem, styles.disabledGrid]}>
          <Text style={styles.disabledText}>Coming Soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  /* Alert */
  alertSection: {
    minHeight: 120,
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 16,
    textAlign: "center",
  },

  /* Dashboard */
  dashboard: {
    backgroundColor: "#f1f2f6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  progressBarBg: {
    height: 10,
    backgroundColor: "#dcdde1",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#2e86de",
  },

  progressText: {
    fontSize: 14,
    marginBottom: 5,
  },

  pointsText: {
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: "#2e86de",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  emergencyGrid: {
    backgroundColor: "#c0392b",
  },

  gridText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  /* Disabled Grid */
  disabledGrid: {
    backgroundColor: "#dcdde1",
  },

  disabledText: {
    color: "#636e72",
    fontWeight: "600",
  },
});