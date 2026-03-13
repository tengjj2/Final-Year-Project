// helpers/progressHelper.js

/**
 * Calculate overall progress
 */
export function calculateProgress({
  tasks,
  quizzes,
  completedTasks,
  completedQuizzes,
}) {
  const totalActivities = tasks.length + quizzes.length;
  const completedActivities = completedTasks.length + completedQuizzes.length;
  const percentage =
    totalActivities === 0
      ? 0
      : Math.round((completedActivities / totalActivities) * 100);

  return { totalActivities, completedActivities, percentage };
}

/**
 * Calculate progress for a specific disaster category
 */
export function calculateCategoryProgress({
  category,
  tasks,
  quizzes,
  completedTasks,
  completedQuizzes,
}) {
  const categoryTasks = tasks.filter((t) => t.category === category);
  const categoryQuizzes = quizzes.filter((q) => q.category === category);

  // Use ID comparison
  const completedTaskCount = categoryTasks.filter((task) =>
    completedTasks.includes(task.id),
  ).length;

  const completedQuizCount = categoryQuizzes.filter((quiz) =>
    completedQuizzes.includes(quiz.id),
  ).length;

  const total = categoryTasks.length + categoryQuizzes.length;
  const completed = completedTaskCount + completedQuizCount;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { category, total, completed, percentage };
}
