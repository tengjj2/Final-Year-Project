// screens/PreparednessZone.js

// React hooks
import { useState, useCallback } from "react";

// React Native components
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

// Navigation hook to reload progress when screen comes into focus
import { useFocusEffect } from "@react-navigation/native";

// Datasets
import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";
import badgesData from "../data/badges.json";

// Helpers
import { getUserProgress, resetAllProgress } from "../helpers/gamification";
import { calculateProgress } from "../helpers/progressHelper";

export default function PreparednessZone({ navigation }) {
  // Component state
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [points, setPoints] = useState(0);

  // Reload user's progress whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        const data = await getUserProgress();
        setUserBadges(data.badges);
        setPoints(data.points);

        // Calculate progress percentage and completed activities
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

  // Filtered list of activities to display
  const activities =
    filter === "task"
      ? tasks
      : filter === "quiz"
        ? quizzes
        : [...tasks, ...quizzes];

  // Confirm and reset all progress
  const confirmReset = () => {
    Alert.alert(
      "Delete all progress?",
      "Are you sure you want to delete all progress and badges? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await resetAllProgress();
            setProgress(null);
            setUserBadges([]);
            setPoints(0);
          },
        },
      ],
    );
  };

  // UI Component
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Screen Title */}
      <Text style={styles.title}>Preparedness Zone</Text>

      {/* Progress Section */}
      {progress && (
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>
            Progress: {progress.percentage}%
          </Text>
          <Text style={styles.progressSub}>
            {progress.completedActivities}/{progress.totalActivities} completed
          </Text>
          <Text style={styles.pointsText}>⭐ {points} points</Text>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {["all", "task", "quiz"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, filter === t && styles.activeTab]}
            onPress={() => setFilter(t)}
          >
            <Text
              style={[styles.tabText, filter === t && styles.activeTabText]}
            >
              {t === "all" ? "All" : t === "task" ? "Tasks" : "Quizzes"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activities List */}
      {activities.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("TaskScreen", { id: item.id, type: item.type })
          }
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </TouchableOpacity>
      ))}

      {/* Badges Section */}
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgeGrid}>
        {badgesData.map((badge) => {
          const earned = userBadges.includes(badge.id);
          return (
            <View
              key={badge.id}
              style={[styles.badgeItem, !earned && styles.lockedBadge]}
            >
              <Text style={styles.badgeName}>
                {earned ? "🏅" : "🔒"} {badge.name}
              </Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
            </View>
          );
        })}
      </View>

      {/* Reset Progress Button */}
      <TouchableOpacity style={styles.resetButton} onPress={confirmReset}>
        <Text style={styles.resetText}>Delete All Progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },

  /* Title */
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },

  /* Progress Box */
  progressBox: {
    backgroundColor: "#dfe6e9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  progressText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  progressSub: {
    fontSize: 14,
    color: "#636e72",
  },

  pointsText: {
    marginTop: 5,
    fontWeight: "600",
  },

  /* Tabs (filter buttons) */
  tabs: {
    flexDirection: "row",
    marginBottom: 15,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#dcdde1",
    borderRadius: 20,
    marginRight: 8,
  },

  activeTab: {
    backgroundColor: "#0984e3",
  },

  tabText: {
    color: "#2d3436",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* Activity Cards */
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  cardDesc: {
    color: "#636e72",
    marginTop: 5,
  },

  /* Badges Section */
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
  },

  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  badgeItem: {
    width: "48%",
    backgroundColor: "#ffeaa7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: "4%",
  },

  lockedBadge: {
    backgroundColor: "#dfe6e9",
  },

  badgeName: {
    fontWeight: "600",
  },

  badgeDesc: {
    fontSize: 12,
    color: "#2d3436",
  },

  /* Reset Progress Button */
  resetButton: {
    marginTop: 30,
    backgroundColor: "#c0392b",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  resetText: {
    color: "#fff",
    fontWeight: "bold",
  },
});