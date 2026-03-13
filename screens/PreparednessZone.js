// screens/PreparednessZone.js
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";

import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";
import badgesData from "../data/badges.json";

import { getUserProgress } from "../helpers/gamification";
import {
  calculateProgress,
  calculateCategoryProgress,
} from "../helpers/progressHelper";

export default function PreparednessZone({ navigation }) {
  const [progress, setProgress] = useState({ percentage: 0 });
  const [userBadges, setUserBadges] = useState([]);
  const [points, setPoints] = useState(0);
  const [userProgress, setUserProgress] = useState({
    completedTasks: [],
    completedQuizzes: [],
    badges: [],
    points: 0,
  });

  const [collapsed, setCollapsed] = useState({});
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [badgeListModalVisible, setBadgeListModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        const data = await getUserProgress();
        setUserBadges(data.badges);
        setPoints(data.points);
        setUserProgress(data);

        const calculated = calculateProgress({
          tasks,
          quizzes,
          completedTasks: data.completedTasks,
          completedQuizzes: data.completedQuizzes,
        });
        setProgress(calculated || { percentage: 0 });

        // collapse state for disaster categories
        const categories = [
          ...new Set([...tasks, ...quizzes].map((item) => item.category)),
        ];
        const initialCollapse = {};
        categories.forEach((cat) => (initialCollapse[cat] = true));
        setCollapsed(initialCollapse);
      };
      loadProgress();
    }, []),
  );

  const disasterIcons = {
    general: "shield-checkmark",
    fire: "flame",
    earthquake: "warning",
    flood: "water",
    typhoon: "rainy",
    wildfire: "leaf",
    power: "flash",
    haze: "cloudy",
  };

  const toggleCollapse = (category) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const disasterCategories = [
    ...new Set([...tasks, ...quizzes].map((item) => item.category)),
  ];

  const openBadgeModal = (badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  const handleQuizPress = (quiz, category) => {
    const categoryTasks = tasks.filter((t) => t.category === category);
    const completedTaskIds = userProgress.completedTasks.map((t) => t.id);
    const allTasksCompleted = categoryTasks.every((task) =>
      completedTaskIds.includes(task.id),
    );

    if (!allTasksCompleted) {
      Alert.alert(
        "Complete all tasks first",
        `You need to complete all tasks for ${category.toUpperCase()} before attempting the final quiz.`,
      );
      return;
    }

    navigation.navigate("TaskScreen", { id: quiz.id, type: "quiz" });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Progress Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Progress</Text>
      </View>

      <View style={styles.progressBox}>
        <Text style={styles.progressLabel}>
          {progress.percentage || 0}% of all tasks and quizzes completed.
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress.percentage || 0}%` },
            ]}
          />
        </View>
        <Text style={styles.pointsText}>Points: {points || 0}</Text>
      </View>

      {/* Badges Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <TouchableOpacity onPress={() => setBadgeListModalVisible(true)}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={badgesData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.badgeRow}
        renderItem={({ item }) => {
          const earned = userBadges.includes(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.badgeItem,
                earned ? styles.earnedBadge : styles.lockedBadge,
              ]}
              activeOpacity={0.7}
              onPress={() => openBadgeModal(item)}
            >
              <Ionicons
                name={earned ? "trophy" : "lock-closed"}
                size={28}
                color={earned ? "#ffbf00" : "#636e72"}
              />
              <Text
                style={[styles.badgeName, earned && styles.earnedBadgeText]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Badge Modal */}
      {selectedBadge && (
        <Modal
          visible={badgeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setBadgeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name={
                  userBadges.includes(selectedBadge.id)
                    ? "trophy"
                    : "lock-closed"
                }
                size={48}
                color={
                  userBadges.includes(selectedBadge.id) ? "#ffbf00" : "#636e72"
                }
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.modalTitle}>{selectedBadge.name}</Text>
              <Text style={styles.modalDesc}>{selectedBadge.description}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setBadgeModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Badge List Modal */}
      <Modal
        visible={badgeListModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBadgeListModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { width: "90%", maxHeight: "80%" }]}
          >
            <Text style={styles.modalTitle}>All Badges</Text>
            <FlatList
              data={badgesData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const earned = userBadges.includes(item.id);
                return (
                  <View
                    style={[
                      styles.listBadgeItem,
                      earned ? styles.earnedBadge : styles.lockedBadge,
                    ]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name={earned ? "trophy" : "lock-closed"}
                        size={24}
                        color={earned ? "#ffbf00" : "#636e72"}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.badgeName,
                          earned && styles.earnedBadgeText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: earned ? "#fff" : "#636e72",
                        marginLeft: 32,
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                );
              }}
            />
            <TouchableOpacity
              style={[styles.modalCloseButton, { marginTop: 10 }]}
              onPress={() => setBadgeListModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Courses Section */}
      <Text style={styles.sectionTitle}>Courses</Text>

      {disasterCategories.map((category) => {
        const categoryTasks = tasks.filter((t) => t.category === category);
        const categoryQuiz = quizzes.find((q) => q.category === category);
        const { percentage } = calculateCategoryProgress({
          category,
          tasks,
          quizzes,
          completedTasks: userProgress.completedTasks.map((t) => t.id),
          completedQuizzes: userProgress.completedQuizzes.map((q) => q.id),
        });

        return (
          <View key={category} style={styles.disasterSection}>
            <TouchableOpacity
              style={styles.disasterHeader}
              onPress={() => toggleCollapse(category)}
            >
              <Ionicons
                name={disasterIcons[category]}
                size={24}
                color="#0f8f84"
              />
              <Text style={styles.disasterTitle}>{category.toUpperCase()}</Text>
              <Ionicons
                name={collapsed[category] ? "chevron-down" : "chevron-up"}
                size={24}
                color="#636e72"
              />
            </TouchableOpacity>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${percentage}%` }]}
              />
            </View>
            <Text style={styles.progressSub}>{percentage}% completed</Text>

            {!collapsed[category] && (
              <View style={styles.disasterContent}>
                {categoryTasks.map((task) => {
                  const bgColor = "#4db6ac";
                  const textColor = "#fff";
                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.card, { backgroundColor: bgColor }]}
                      onPress={() =>
                        navigation.navigate("TaskScreen", {
                          id: task.id,
                          type: "task",
                          taskType: task.taskType,
                        })
                      }
                    >
                      <Text style={[styles.cardTitle, { color: textColor }]}>
                        {task.title} ({task.taskType})
                      </Text>
                      <Text style={[styles.cardDesc, { color: textColor }]}>
                        {task.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {categoryQuiz && (
                  <TouchableOpacity
                    style={styles.quizCard}
                    onPress={() => handleQuizPress(categoryQuiz, category)}
                  >
                    <Ionicons name="document-text" size={20} color="#fff" />
                    <Text style={styles.quizTitle}>{categoryQuiz.title}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  scrollContent: { padding: 20, paddingBottom: 50 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#2d3436",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: { fontSize: 14, fontWeight: "600", color: "#0f8f84" },

  progressBox: {
    backgroundColor: "#e8f7f5",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#7ed6c9",
  },
  progressLabel: { fontSize: 14, fontWeight: "500" },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 8,
  },
  progressFill: { height: 6, backgroundColor: "#0f8f84", borderRadius: 3 },
  pointsText: { fontWeight: "600", fontSize: 14 },

  badgeRow: { paddingVertical: 12 },
  badgeItem: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  earnedBadge: { backgroundColor: "#0f8f84" },
  lockedBadge: { backgroundColor: "#dfe6e9" },
  earnedBadgeText: { color: "#fff" },
  badgeName: {
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
  },
  listBadgeItem: { padding: 12, borderRadius: 12, marginBottom: 10 },

  disasterSection: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    elevation: 2,
  },
  disasterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disasterTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 6 },
  disasterContent: { marginTop: 12 },

  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  cardTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  cardDesc: { fontSize: 13 },

  quizCard: {
    backgroundColor: "#0f8f84",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quizTitle: { color: "#fff", fontWeight: "bold", marginLeft: 8, fontSize: 15 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDesc: {
    fontSize: 14,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: "#0f8f84",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalCloseText: { color: "#fff", fontWeight: "bold" },

  progressSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#636e72",
    marginTop: 4,
  },
});
