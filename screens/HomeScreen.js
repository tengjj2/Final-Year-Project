// screens/HomeScreen.js

import { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { getCurrentEmergency } from "../helpers/emergencyHelper";
import { getUserProgress } from "../helpers/gamification";
import { calculateProgress } from "../helpers/progressHelper";
import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";

export default function HomeScreen({ navigation }) {
  const [currentAlert, setCurrentAlert] = useState(getCurrentEmergency());
  const [progress, setProgress] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert(getCurrentEmergency());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Action Grid */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("PreparednessZone")}
        >
          <Ionicons
            name="school"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={styles.gridText}>Preparedness Zone</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("ResourceHub")}
        >
          <Ionicons
            name="library"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={styles.gridText}>Resource Hub</Text>
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
          <Text style={styles.gridText}>Emergency Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("Rewards")}
        >
          <Ionicons
            name="gift"
            size={28}
            color="#fff"
            style={styles.gridIcon}
          />
          <Text style={styles.gridText}>Rewards</Text>
        </TouchableOpacity>

        <View style={[styles.gridItem, styles.disabledGrid]}>
          <Text style={styles.disabledText}>Coming Soon</Text>
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
          <Text style={styles.gridText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles
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
    fontSize: 16,
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
    fontSize: 18,
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
    backgroundColor: "#0f8f84", // teal theme
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#2d3436",
  },
  pointsText: {
    fontSize: 14,
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
    backgroundColor: "#0f8f84",
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
