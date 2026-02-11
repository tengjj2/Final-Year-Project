// helpers/progressHelper.js

/**
 * Calculate user's progress for task and quizzes
 * Combines completed tasks and quizzes to return total activites,
 * number completed, and overall completion percentage
 */
export function calculateProgress({
  tasks,
  quizzes,
  completedTasks,
  completedQuizzes,
}) {
  // Total number of activities (task + quizzes)
  const totalActivities = tasks.length + quizzes.length;

  // Total number of activities completed
  const completedActivities = completedTasks.length + completedQuizzes.length;

  // Calculate completion percentage
  const percentage =
    totalActivities === 0
      ? 0
      : Math.round((completedActivities / totalActivities) * 100);

  return {
    totalActivities,
    completedActivities,
    percentage,
  };
}