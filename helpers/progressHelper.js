// helpers/progressHelper.js

// Get unique disaster categories from tasks and quizzes
export function getDisasterCategories(tasks, quizzes) {
  return [...new Set([...tasks, ...quizzes].map((item) => item.category))];
}

// Calculate overall progress across all tasks and quizzes
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

// Calculate progress for a specific disaster category
export function calculateCategoryProgress({
  category,
  tasks,
  quizzes,
  completedTasks,
  completedQuizzes,
}) {
  // Fliter tasks and quizzes by category
  const categoryTasks = tasks.filter((t) => t.category === category);
  const categoryQuizzes = quizzes.filter((q) => q.category === category);

  // Count completed items by checking ID inclusion
  const completedTaskCount = categoryTasks.filter((task) =>
    completedTasks.includes(task.id),
  ).length;

  const completedQuizCount = categoryQuizzes.filter((quiz) =>
    completedQuizzes.includes(quiz.id),
  ).length;

  const total = categoryTasks.length + categoryQuizzes.length;
  const completed = completedTaskCount + completedQuizCount;

  // Calculate percentage safely
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { category, total, completed, percentage };
}

// Initialise collapse state for each disaster category
export function initCollapseState(tasks, quizzes) {
  const categories = [
    ...new Set([...tasks, ...quizzes].map((item) => item.category)),
  ];
  const initialCollapse = {};
  categories.forEach((cat) => {
    initialCollapse[cat] = true;
  });
  return initialCollapse;
}
