// helpers/gamification.js

// Import AsyncStorage to persist user data locally on device
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys used to store data in AsyncStorage
const POINTS_KEY = "points";
const BADGES_KEY = "badges";
const TASKS_KEY = "completedTasks";
const QUIZZES_KEY = "completedQuizzes";

// Points Management

/**
 * Add points to the user's current total
 */
export async function addPoints(points) {
  const current = parseInt(await AsyncStorage.getItem(POINTS_KEY)) || 0;
  await AsyncStorage.setItem(POINTS_KEY, (current + points).toString());
}

// Badge Management

/**
 * Unlock a badge for the user
 * Ensures the badge isn't already unlocked
 */
export async function unlockBadge(badge) {
  const badges = JSON.parse(await AsyncStorage.getItem(BADGES_KEY)) || [];
  if (!badges.includes(badge)) {
    badges.push(badge);
    await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  }
}

// Task Management

/**
 * Mark a task as completed
 * Stores any user selections for the task
 */
export async function markTaskComplete(taskId, selections) {
  const completed = JSON.parse(await AsyncStorage.getItem(TASKS_KEY)) || [];
  if (!completed.find((t) => t.id === taskId)) {
    completed.push({ id: taskId, selections });
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(completed));
  }
}

/**
 * Check if a task has been completed
 */
export async function isTaskCompleted(taskId) {
  const completed = JSON.parse(await AsyncStorage.getItem(TASKS_KEY)) || [];
  return completed.some((t) => t.id === taskId);
}

/**
 * Get user selections for a completed task
 */
export async function getTaskSelections(taskId) {
  const completed = JSON.parse(await AsyncStorage.getItem(TASKS_KEY)) || [];
  const record = completed.find((t) => t.id === taskId);
  return record?.selections || null;
}

// Quiz Management

/**
 * Mark a quiz as completed
 * Stores the user's answers
 */
export async function markQuizComplete(quizId, answers) {
  const completed = JSON.parse(await AsyncStorage.getItem(QUIZZES_KEY)) || [];
  if (!completed.find((q) => q.id === quizId)) {
    completed.push({ id: quizId, answers });
    await AsyncStorage.setItem(QUIZZES_KEY, JSON.stringify(completed));
  }
}

/**
 * Check if a quiz has been completed
 */
export async function isQuizCompleted(quizId) {
  const completed = JSON.parse(await AsyncStorage.getItem(QUIZZES_KEY)) || [];
  return completed.some((q) => q.id === quizId);
}

/**
 * Get answers for a completed quiz
 */
export async function getQuizAnswers(quizId) {
  const completed = JSON.parse(await AsyncStorage.getItem(QUIZZES_KEY)) || [];
  const record = completed.find((q) => q.id === quizId);
  return record?.answers || null;
}

// User Progress

/**
 * Retrieve all user progress data
 */
export async function getUserProgress() {
  const points = parseInt(await AsyncStorage.getItem(POINTS_KEY)) || 0;
  const badges = JSON.parse(await AsyncStorage.getItem(BADGES_KEY)) || [];
  const completedTasks =
    JSON.parse(await AsyncStorage.getItem(TASKS_KEY)) || [];
  const completedQuizzes =
    JSON.parse(await AsyncStorage.getItem(QUIZZES_KEY)) || [];

  return { points, badges, completedTasks, completedQuizzes };
}