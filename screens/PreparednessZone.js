// screens/PreparednessZone.js

import { useState, useCallback, useEffect, useContext } from "react";
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
import { ThemeContext } from "../helpers/themeContext";
import BottomNavigation from "../helpers/bottomNavigation";

import {
  calculateProgress,
  calculateCategoryProgress,
  initCollapseState,
  getDisasterCategories,
} from "../helpers/progressHelper";
import { getUserProgress, canAttemptQuiz } from "../helpers/gamification";

import {
  loadFontSize,
  scaleFont,
  updateFontScale,
} from "../helpers/fontHelper";

export default function PreparednessZone({ navigation }) {
  // State
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
  const [fontLoaded, setFontLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);

  const disasterCategories = getDisasterCategories(tasks, quizzes);

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

  // Load font size
  useEffect(() => {
    const initializeFont = async () => {
      const size = await loadFontSize();
      updateFontScale(size);
      setFontLoaded(true);
    };
    initializeFont();
  }, []);

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
        setCollapsed(initCollapseState(tasks, quizzes));
      };
      loadProgress();
    }, []),
  );

  // Collapse toggle for disaster categories
  const toggleCollapse = (category) => {
    setCollapsed((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Badge modals
  const openBadgeModal = (badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  // Quiz press handler
  const handleQuizPress = (quiz, category) => {
    if (!canAttemptQuiz(category, userProgress, tasks)) {
      Alert.alert(
        "Complete all tasks first",
        `You need to complete all tasks for ${category.toUpperCase()} before attempting the final quiz.`,
      );
      return;
    }

    navigation.navigate("TaskScreen", { id: quiz.id, type: "quiz" });
  };

  // Wait for font to load
  if (!fontLoaded) {
    return null;
  }

  // JSX
  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
            Progress
          </Text>

          {/* Rewards Button */}
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => navigation.navigate("Rewards")}
          >
            <Text
              style={[
                styles.viewAllText,
                { fontSize: scaleFont(14), color: theme.primary },
              ]}
            >
              Rewards
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.progressBox,
            {
              backgroundColor: theme.accent,
              borderColor: theme.secondary,
            },
          ]}
        >
          <Text style={[styles.progressLabel, { fontSize: scaleFont(14) }]}>
            {progress.percentage || 0}% of all tasks and quizzes completed.
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress.percentage || 0}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>

          <Text style={[styles.pointsText, { fontSize: scaleFont(14) }]}>
            Points: {points || 0}
          </Text>
        </View>

        {/* Badges Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
            Badges
          </Text>

          <TouchableOpacity onPress={() => setBadgeListModalVisible(true)}>
            <Text
              style={[
                styles.viewAllText,
                { fontSize: scaleFont(14), color: theme.primary },
              ]}
            >
              View All
            </Text>
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
                  earned && { backgroundColor: theme.primary },
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
                  style={[
                    styles.badgeName,
                    earned && styles.earnedBadgeText,
                    { fontSize: scaleFont(14) },
                  ]}
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
                    userBadges.includes(selectedBadge.id)
                      ? "#ffbf00"
                      : "#636e72"
                  }
                  style={{ marginBottom: 12 }}
                />
                <Text style={[styles.modalTitle, { fontSize: scaleFont(20) }]}>
                  {selectedBadge.name}
                </Text>
                <Text style={[styles.modalDesc, { fontSize: scaleFont(14) }]}>
                  {selectedBadge.description}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.modalCloseButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setBadgeModalVisible(false)}
                >
                  <Text
                    style={[styles.modalCloseText, { fontSize: scaleFont(14) }]}
                  >
                    Close
                  </Text>
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
              <Text style={[styles.modalTitle, { fontSize: scaleFont(20) }]}>
                All Badges
              </Text>
              <FlatList
                data={badgesData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const earned = userBadges.includes(item.id);
                  return (
                    <View
                      style={[
                        styles.listBadgeItem,
                        earned
                          ? { backgroundColor: theme.primary }
                          : styles.lockedBadge,
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
                            { fontSize: scaleFont(14) },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: scaleFont(12),
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
                style={[
                  styles.modalCloseButton,
                  { marginTop: 10 },
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => setBadgeListModalVisible(false)}
              >
                <Text
                  style={[styles.modalCloseText, { fontSize: scaleFont(14) }]}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Courses Section */}
        <Text style={[styles.sectionTitle, { fontSize: scaleFont(20) }]}>
          Courses
        </Text>

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
                  color={theme.primary}
                />
                <Text
                  style={[styles.disasterTitle, { fontSize: scaleFont(16) }]}
                >
                  {category.toUpperCase()}
                </Text>
                <Ionicons
                  name={collapsed[category] ? "chevron-down" : "chevron-up"}
                  size={24}
                  color="#636e72"
                />
              </TouchableOpacity>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%` },
                    { backgroundColor: theme.primary },
                  ]}
                />
              </View>
              <Text style={[styles.progressSub, { fontSize: scaleFont(12) }]}>
                {percentage}% completed
              </Text>

              {!collapsed[category] && (
                <View style={styles.disasterContent}>
                  {categoryTasks.map((task) => {
                    const bgColor = theme.secondary;
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
                        <Text
                          style={[
                            styles.cardTitle,
                            { color: textColor, fontSize: scaleFont(15) },
                          ]}
                        >
                          {task.title} ({task.taskType})
                        </Text>
                        <Text
                          style={[
                            styles.cardDesc,
                            { color: textColor, fontSize: scaleFont(13) },
                          ]}
                        >
                          {task.description}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {categoryQuiz && (
                    <TouchableOpacity
                      style={[
                        styles.quizCard,
                        { backgroundColor: theme.primary },
                      ]}
                      onPress={() => handleQuizPress(categoryQuiz, category)}
                    >
                      <Ionicons name="document-text" size={20} color="#fff" />
                      <Text
                        style={[styles.quizTitle, { fontSize: scaleFont(15) }]}
                      >
                        {categoryQuiz.title}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      {/* Bottom Navigation Bar */}
      <BottomNavigation activeKey="PreparednessZone" />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

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

  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f8f84",
  },

  progressBox: {
    backgroundColor: "#e8f7f5",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#7ed6c9",
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 8,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#0f8f84",
    borderRadius: 3,
  },

  pointsText: {
    fontWeight: "600",
    fontSize: 14,
  },

  badgeRow: {
    paddingVertical: 12,
  },

  badgeItem: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  earnedBadge: {
    backgroundColor: "#0f8f84",
  },

  lockedBadge: {
    backgroundColor: "#dfe6e9",
  },

  earnedBadgeText: {
    color: "#fff",
  },

  badgeName: {
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
  },

  listBadgeItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

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

  disasterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },

  disasterContent: {
    marginTop: 12,
  },

  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },

  cardDesc: {
    fontSize: 13,
  },

  quizCard: {
    backgroundColor: "#0f8f84",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  quizTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15,
  },

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

  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
  },

  progressSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#636e72",
    marginTop: 4,
  },
});
