// screens/TaskScreen.js

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Data
import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";

// Helper functions
import {
  addPoints,
  unlockBadge,
  markTaskComplete,
  markQuizComplete,
  isTaskCompleted,
  isQuizCompleted,
  getTaskSelections,
  getQuizAnswers,
} from "../helpers/gamification";

export default function TaskScreen({ route, navigation }) {
  const { id, type } = route.params;
  const data = type === "task" ? tasks : quizzes;
  const task = data.find((t) => t.id === id);

  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!task) return;

      if (type === "task") {
        const completed = await isTaskCompleted(id);
        setAlreadyCompleted(completed);

        // Checklist
        if (task.taskType === "checklist" && Array.isArray(task.items)) {
          let initialChecked = {};
          task.items.forEach((i) => (initialChecked[i] = false));
          if (completed) {
            const prevSelections = await getTaskSelections(id);
            if (prevSelections) initialChecked = prevSelections;
          }
          setChecked(initialChecked);
        }

        // Scenario
        if (task.taskType === "scenario" && Array.isArray(task.questions)) {
          let initialAnswers = {};
          initialAnswers[task.story] = "";

          if (completed) {
            const prevAnswers = await getTaskSelections(id);
            if (prevAnswers && prevAnswers[task.story]) {
              initialAnswers[task.story] = prevAnswers[task.story];
            }
          }

          setAnswers(initialAnswers);
        }

        // Reading
        if (task.taskType === "reading") {
          setChecked({}); // nothing to check
        }
      }

      if (type === "quiz" && Array.isArray(task.questions)) {
        const completed = await isQuizCompleted(id);
        setAlreadyCompleted(completed);

        let initialAnswers = {};
        task.questions.forEach((q) => (initialAnswers[q.question] = ""));
        if (completed) {
          const prevAnswers = await getQuizAnswers(id);
          if (prevAnswers) initialAnswers = prevAnswers;
        }
        setAnswers(initialAnswers);
      }
    };

    init();
  }, [id]);

  if (!task) return <Text>Task or quiz not found</Text>;

  const submit = async () => {
    if (type === "task") {
      switch (task.taskType) {
        case "checklist":
          if (!Object.values(checked).every(Boolean)) {
            Alert.alert("Incomplete", "Please complete all items");
            return;
          }
          if (!alreadyCompleted) {
            await addPoints(task.points);
            await unlockBadge(task.badge);
            await markTaskComplete(task.id, checked);
            Alert.alert("Task Complete!", `+${task.points} points`);
          } else {
            Alert.alert("Completed", "You already finished this task.");
          }
          break;

        case "reading":
          if (!alreadyCompleted) {
            await addPoints(task.points);
            await unlockBadge(task.badge);
            await markTaskComplete(task.id, {});
            Alert.alert("Task Complete!", `+${task.points} points`);
          } else {
            Alert.alert("Completed", "You already finished this task.");
          }
          break;

        case "scenario":
          if (!Array.isArray(task.questions)) break;

          // Scenario submit
          let correct = 0;
          task.questions.forEach((q) => {
            if (answers[task.story] === q.answer) correct++;
          });

          if (correct === task.questions.length) {
            if (!alreadyCompleted) {
              await addPoints(task.points);
              await unlockBadge(task.badge);
              await markTaskComplete(task.id, answers);
              Alert.alert("Perfect Score!", `+${task.points} points`);
            } else {
              Alert.alert("Completed", "You already finished this scenario.");
            }
          } else {
            Alert.alert(
              "Try Again",
              `${correct}/${task.questions.length} correct. You can retry.`,
            );
            return;
          }
          break;

        default:
          break;
      }
      navigation.goBack();
      return;
    }

    if (type === "quiz" && Array.isArray(task.questions)) {
      let correct = 0;
      task.questions.forEach((q) => {
        if (answers[q.question] === q.answer) correct++;
      });

      if (correct === task.questions.length) {
        if (!alreadyCompleted) {
          await addPoints(task.points);
          await unlockBadge(task.badge);
          await markQuizComplete(task.id, answers);
          Alert.alert("Perfect Score!", `+${task.points} points`);
        } else {
          Alert.alert("Completed", "You already passed this quiz.");
        }
        navigation.goBack();
      } else {
        Alert.alert(
          "Try Again",
          `${correct}/${task.questions.length} correct. You can retry.`,
        );
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }} // ensure submit visible
    >
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.desc}>{task.description}</Text>

      {alreadyCompleted && (
        <Text style={styles.completedText}>
          Completed — points already awarded
        </Text>
      )}

      {/* --- Checklist --- */}
      {task.taskType === "checklist" &&
        Array.isArray(task.items) &&
        task.items.map((item) => (
          <TouchableOpacity
            key={item}
            disabled={alreadyCompleted}
            onPress={() => setChecked({ ...checked, [item]: !checked[item] })}
          >
            <View style={styles.checkItem}>
              <MaterialCommunityIcons
                name={
                  checked[item] ? "checkbox-marked" : "checkbox-blank-outline"
                }
                size={24}
                color="#008080"
              />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          </TouchableOpacity>
        ))}

      {/* --- Reading --- */}
      {task.taskType === "reading" && (
        <View style={styles.readingContainer}>
          <Text style={styles.readingText}>
            {task.content || task.description || "No content provided."}
          </Text>
        </View>
      )}

      {/* --- Scenario --- */}
      {task.taskType === "scenario" && Array.isArray(task.questions) && (
        <View style={styles.scenarioContainer}>
          {task.questions.map((q, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              {/* Use story as question text */}
              <Text style={[styles.question, { marginBottom: 8 }]}>
                {task.story}
              </Text>

              {Array.isArray(q.options) &&
                q.options.map((opt) => {
                  const isSelected = answers[task.story] === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      disabled={alreadyCompleted}
                      style={[
                        styles.option,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() =>
                        setAnswers({ ...answers, [task.story]: opt })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ))}
        </View>
      )}

      {/* --- Quiz --- */}
      {type === "quiz" &&
        Array.isArray(task.questions) &&
        task.questions.map((q, idx) => (
          <View key={idx} style={styles.quiz}>
            <Text style={styles.question}>{q.question}</Text>
            {Array.isArray(q.options) &&
              q.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  disabled={alreadyCompleted}
                  style={[
                    styles.option,
                    answers[q.question] === opt && styles.selectedOption, // scenario style
                  ]}
                  onPress={() => setAnswers({ ...answers, [q.question]: opt })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      answers[q.question] === opt && styles.selectedOptionText, // scenario text style
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}

      <TouchableOpacity
        style={[styles.button, alreadyCompleted && styles.disabledButton]}
        onPress={submit}
        disabled={alreadyCompleted}
      >
        <Text style={styles.buttonText}>
          {task.taskType === "reading" && !alreadyCompleted
            ? "Mark as Read"
            : alreadyCompleted
              ? "Completed"
              : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 20 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 8,
  },
  desc: { fontSize: 14, color: "#2d3436", marginBottom: 12 },
  completedText: { color: "#2d3436", fontWeight: "600", marginBottom: 12 },

  checkItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  itemText: { fontSize: 16, marginLeft: 8 },

  readingContainer: {
    backgroundColor: "#fefefe",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  readingText: { color: "#2d3436", fontSize: 14 },

  scenarioContainer: {
    backgroundColor: "#fefefe",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffe0b2",
  },
  scenarioText: { color: "#2d3436", fontWeight: "500", marginBottom: 10 },

  quiz: {
    backgroundColor: "#fefefe",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  question: {
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
    flexShrink: 1,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#b2bec3",
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fefefe",
  },
  optionText: { fontSize: 15 },

  selectedOption: { backgroundColor: "#0f8f84", borderColor: "#004d4d" },
  selectedOptionText: { color: "#fff", fontWeight: "600" },

  button: {
    backgroundColor: "#0f8f84",
    padding: 15,
    borderRadius: 14,
    marginTop: 20,
  },
  disabledButton: { backgroundColor: "#b2bec3" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
