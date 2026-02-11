// screen/TaskScreen.js

// React hooks
import { useState, useEffect } from "react";

// React Native components
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";

// Datasets
import tasks from "../data/tasks.json";
import quizzes from "../data/quizzes.json";

// Helper
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

  // Component state
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Initialise state on mount
  useEffect(() => {
    const init = async () => {
      if (!task) return;

      if (type === "task") {
        // Check if task already completed
        const completed = await isTaskCompleted(id);
        setAlreadyCompleted(completed);

        // Initialise checklist state
        let initialChecked = {};
        task.items.forEach((i) => (initialChecked[i] = false));

        // Load previous selections if completed
        if (completed) {
          const prevSelections = await getTaskSelections(id);
          if (prevSelections) initialChecked = prevSelections;
        }

        setChecked(initialChecked);
      }

      if (type === "quiz") {
        // Check if quiz already completed
        const completed = await isQuizCompleted(id);
        setAlreadyCompleted(completed);

        // Initialise answers state
        let initialAnswers = {};
        task.questions.forEach((q) => (initialAnswers[q.question] = ""));

        // Load previous answers if completed
        if (completed) {
          const prevAnswers = await getQuizAnswers(id);
          if (prevAnswers) initialAnswers = prevAnswers;
        }

        setAnswers(initialAnswers);
      }
    };

    init();
  }, [id]);

  // If task/quiz not found, show message
  if (!task) return <Text>Not found</Text>;

  // Submit handler for task or quiz
  const submit = async () => {
    // Task
    if (type === "task") {
      const allDone = Object.values(checked).every(Boolean);
      if (!allDone) {
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

      navigation.goBack();
      return;
    }

    // Quiz
    if (type === "quiz") {
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
        return;
      } else {
        Alert.alert(
          "Try Again",
          `${correct}/${task.questions.length} correct. You can retry.`,
        );
      }
    }
  };

  // UI Component
  return (
    <ScrollView style={styles.container}>
      {/* Title and Description */}
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.desc}>{task.description}</Text>

      {/* Already Completed Message */}
      {alreadyCompleted && (
        <Text style={styles.completedText}>
          ✅ Completed — points already awarded
        </Text>
      )}

      {/* Task Checklist */}
      {type === "task" &&
        Object.keys(checked).map((item) => (
          <TouchableOpacity
            key={item}
            disabled={alreadyCompleted}
            onPress={() => setChecked({ ...checked, [item]: !checked[item] })}
          >
            <Text style={styles.item}>
              {checked[item] ? "✅" : "⬜"} {item}
            </Text>
          </TouchableOpacity>
        ))}

      {/* Quiz Questions */}
      {type === "quiz" &&
        task.questions.map((q, idx) => (
          <View key={idx} style={styles.quiz}>
            <Text style={styles.question}>{q.question}</Text>
            {q.options.map((opt) => (
              <TouchableOpacity
                key={opt}
                disabled={alreadyCompleted}
                style={[
                  styles.option,
                  answers[q.question] === opt && styles.selected,
                ]}
                onPress={() => setAnswers({ ...answers, [q.question]: opt })}
              >
                <Text>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, alreadyCompleted && styles.disabledButton]}
        onPress={submit}
        disabled={alreadyCompleted}
      >
        <Text style={styles.buttonText}>
          {alreadyCompleted ? "Completed" : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  /* Task/Quiz Title and Description */
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  desc: {
    marginBottom: 10,
  },

  /* Already Completed Notice */
  completedText: {
    color: "#2d3436",
    fontWeight: "600",
    marginBottom: 15,
  },

  /* Task Checklist Item */
  item: {
    fontSize: 18,
    marginBottom: 10,
  },

  /* Quiz */
  quiz: {
    marginBottom: 20,
  },

  question: {
    fontWeight: "600",
  },

  option: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
  },

  selected: {
    backgroundColor: "#dfe6e9",
  },

  /* Submit Button */
  button: {
    backgroundColor: "#0984e3",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  disabledButton: {
    backgroundColor: "#b2bec3",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});