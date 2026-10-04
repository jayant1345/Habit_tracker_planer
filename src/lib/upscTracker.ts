import {
  CoreTaskKey,
  TaskExecutionStatus,
  MissedReason,
  DailyTaskItem,
  DailyScheduleBlock,
  DailyScoreBreakdown,
  TodaySummaryReport,
  WeeklyDashboardData,
  MonthlyDashboardData,
  AllTimeDashboardData,
  ReviewDetails,
} from '@/types';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameDay, min as minDate } from 'date-fns';

export const CORE_TASKS_CONFIG: Record<
  CoreTaskKey,
  {
    key: CoreTaskKey;
    title: string;
    category: 'Study' | 'Personal';
    defaultPlannedStart: string;
    defaultPlannedEnd: string;
    defaultDurationMinutes: number;
    blockLabel: 'Morning' | 'Study Block' | 'Evening' | 'Night';
    isBinary: boolean;
    description: string;
    badge: string;
  }
> = {
  walk: {
    key: 'walk',
    title: 'Morning 30-Minute Walk',
    category: 'Personal',
    defaultPlannedStart: '06:00',
    defaultPlannedEnd: '06:30',
    defaultDurationMinutes: 30,
    blockLabel: 'Morning',
    isBinary: true,
    description: 'Brisk aerobic walk for physical stamina, fresh morning sunlight & dopamine reset.',
    badge: 'Health',
  },
  vipassana: {
    key: 'vipassana',
    title: '45-Minute Vipassana',
    category: 'Personal',
    defaultPlannedStart: '06:45',
    defaultPlannedEnd: '07:30',
    defaultDurationMinutes: 45,
    blockLabel: 'Morning',
    isBinary: true,
    description: 'Breath awareness & silent bodily sensations observation for deep calm & laser focus.',
    badge: 'Mindfulness',
  },
  pyq_test: {
    key: 'pyq_test',
    title: 'PYQ Test',
    category: 'Study',
    defaultPlannedStart: '09:00',
    defaultPlannedEnd: '10:30',
    defaultDurationMinutes: 90,
    blockLabel: 'Study Block',
    isBinary: false,
    description: 'Timed previous year questions test (DI / Drug Inspector / GPAT / UPSC Pharma papers).',
    badge: 'Quantity / Score',
  },
  pyq_solution: {
    key: 'pyq_solution',
    title: 'PYQ Solution Analysis',
    category: 'Study',
    defaultPlannedStart: '11:00',
    defaultPlannedEnd: '12:30',
    defaultDurationMinutes: 90,
    blockLabel: 'Study Block',
    isBinary: false,
    description: 'Post-test root-cause breakdown: conceptual mistakes, silly errors, and knowledge gaps.',
    badge: 'Analysis',
  },
  decode: {
    key: 'decode',
    title: '1 Same Topic from Decode',
    category: 'Study',
    defaultPlannedStart: '14:00',
    defaultPlannedEnd: '15:30',
    defaultDurationMinutes: 90,
    blockLabel: 'Study Block',
    isBinary: false,
    description: 'Deep textbook/Decode synthesis directly connecting to today’s PYQ test theme.',
    badge: 'Synthesis',
  },
  marathon: {
    key: 'marathon',
    title: '1 Marathon',
    category: 'Study',
    defaultPlannedStart: '16:30',
    defaultPlannedEnd: '18:30',
    defaultDurationMinutes: 120,
    blockLabel: 'Study Block',
    isBinary: true,
    description: 'High-yield revision lecture marathon or rapid question solve sprint.',
    badge: 'Syllabus Coverage',
  },
  english: {
    key: 'english',
    title: 'English Speaking Practice',
    category: 'Study',
    defaultPlannedStart: '19:30',
    defaultPlannedEnd: '20:00',
    defaultDurationMinutes: 30,
    blockLabel: 'Evening',
    isBinary: true,
    description: 'Verbal communication, regulatory terminology & UPSC interview articulation.',
    badge: 'Interview Prep',
  },
  review: {
    key: 'review',
    title: 'Review Work',
    category: 'Study',
    defaultPlannedStart: '21:30',
    defaultPlannedEnd: '22:00',
    defaultDurationMinutes: 30,
    blockLabel: 'Night',
    isBinary: true,
    description: 'End-of-day 7-point accountability audit: “Did I actually execute today’s plan?”',
    badge: 'Daily Audit',
  },
};

export const DEFAULT_SCHEDULE_BLOCKS: DailyScheduleBlock[] = Object.values(CORE_TASKS_CONFIG).map((cfg) => ({
  taskKey: cfg.key,
  title: cfg.title,
  category: cfg.category,
  blockLabel: cfg.blockLabel,
  plannedStartTime: cfg.defaultPlannedStart,
  plannedEndTime: cfg.defaultPlannedEnd,
  targetDurationMinutes: cfg.defaultDurationMinutes,
}));

export const MISSED_REASONS: MissedReason[] = [
  'Lack of time',
  'Distraction',
  'Low energy',
  'Overslept',
  'Unexpected work',
  'Poor planning',
  'Procrastination',
  'Other',
];

// Helper to generate blank or customized tasks for any given date
export function generateDailyTasksForDate(
  dateStr: string,
  blocks: DailyScheduleBlock[] = DEFAULT_SCHEDULE_BLOCKS
): DailyTaskItem[] {
  const d = parseISO(dateStr);
  const dayOfWeek = format(d, 'EEEE');

  return blocks.map((block) => {
    const cfg = CORE_TASKS_CONFIG[block.taskKey];
    return {
      id: `task_${block.taskKey}_${dateStr}`,
      taskKey: block.taskKey,
      title: block.title,
      category: block.category,
      isBinary: cfg.isBinary,
      date: dateStr,
      dayOfWeek,
      plannedStartTime: block.plannedStartTime,
      plannedEndTime: block.plannedEndTime,
      targetDurationMinutes: block.targetDurationMinutes,
      actualDurationMinutes: 0,
      status: 'not_started',
      completionPercentage: 0,
      notes: '',
      // Default empty payloads
      pyqTestDetails:
        block.taskKey === 'pyq_test'
          ? {
              testName: 'UPSC DI Previous Paper (Pharmacology)',
              subject: 'Pharmacology',
              numberOfQuestions: 50,
              attempted: 0,
              correct: 0,
              wrong: 0,
              score: 0,
              accuracy: 0,
              timeTakenMinutes: 0,
              mistakesAnalyzed: false,
            }
          : undefined,
      pyqSolutionDetails:
        block.taskKey === 'pyq_solution'
          ? {
              questionsAnalyzed: 0,
              wrongQuestions: 0,
              conceptualMistakes: 0,
              sillyMistakes: 0,
              knowledgeGaps: 0,
              notesUpdated: false,
              revisionRequired: false,
            }
          : undefined,
      marathonDetails:
        block.taskKey === 'marathon'
          ? {
              subject: 'Pharmacology',
              topic: 'Antihypertensives & Antiarrhythmics Complete Sprint',
              durationMinutes: 120,
              marathonCompleted: false,
            }
          : undefined,
      decodeDetails:
        block.taskKey === 'decode'
          ? {
              subject: 'Pharmacology',
              topic: 'Autonomic Nervous System & Adrenergic Receptors',
              topicCompleted: false,
              importantPointsExtracted: '',
              notesUpdated: false,
              revisionRequired: false,
            }
          : undefined,
      englishDetails:
        block.taskKey === 'english'
          ? {
              practiceDurationMinutes: 30,
              topicSpokenAbout: 'Duties & Legal Powers of Drug Inspector under Section 21',
              confidenceLevel: 4,
              fluency: 4,
              vocabularyLearned: ['Adulterated', 'Misbranded', 'Spurious', 'Statutory compliance'],
              majorMistakes: 'Pause before answering regulatory schedule details',
              todayImprovement: 'Good fluidity when articulating search and seizure procedures',
            }
          : undefined,
      walkDetails:
        block.taskKey === 'walk'
          ? {
              durationMinutes: 30,
              distanceKm: 2.5,
              stepCount: 3500,
              notes: 'Morning walk in garden, clear mind and steady pace.',
            }
          : undefined,
      vipassanaDetails:
        block.taskKey === 'vipassana'
          ? {
              durationMinutes: 45,
              focusQuality: 'Deep',
              notes: 'Breath observation on Anapana, quieted morning mental chatter.',
            }
          : undefined,
    };
  });
}

// Automatic Daily Score Calculation out of 100
// Execution > Perfection
export function calculateDailyScore(
  tasks: DailyTaskItem[],
  review?: ReviewDetails
): DailyScoreBreakdown {
  if (!tasks || tasks.length === 0) {
    return {
      totalScore: 0,
      taskCompletionScore: 0,
      studyExecutionScore: 0,
      timeAdherenceScore: 0,
      pyqPerformanceScore: 0,
      personalDisciplineScore: 0,
      dailyReviewScore: 0,
      feedback: 'No tasks scheduled yet today.',
    };
  }

  // 1. Task Completion (up to 40 pts)
  // 5 pts per completed task, 2.5 pts for in-progress
  let taskCompletionScore = 0;
  tasks.forEach((t) => {
    if (t.status === 'completed') {
      taskCompletionScore += 5;
    } else if (t.status === 'in_progress') {
      taskCompletionScore += 2.5;
    }
  });

  // 2. Study Execution (up to 25 pts)
  // 6 study tasks: pyq_test (5), pyq_solution (5), marathon (4), decode (4), english (4), review (3)
  let studyExecutionScore = 0;
  const studyTasks = tasks.filter((t) => t.category === 'Study');
  studyTasks.forEach((st) => {
    if (st.status === 'completed') {
      if (st.taskKey === 'pyq_test' || st.taskKey === 'pyq_solution') studyExecutionScore += 5;
      else if (st.taskKey === 'review') studyExecutionScore += 3;
      else studyExecutionScore += 4;
    } else if (st.status === 'in_progress') {
      studyExecutionScore += 2;
    }
  });

  // 3. Time Adherence (up to 15 pts)
  // Did the student spend target duration or log start times?
  let timeAdherenceScore = 0;
  let tasksWithLoggedTime = 0;
  tasks.forEach((t) => {
    if (t.actualDurationMinutes > 0 || (t.actualStartTime && t.actualEndTime)) {
      tasksWithLoggedTime++;
    }
  });
  timeAdherenceScore = Math.min(15, Math.round((tasksWithLoggedTime / 8) * 15));

  // 4. PYQ Performance & Mistakes Analyzed (up to 10 pts)
  let pyqPerformanceScore = 0;
  const pyqTask = tasks.find((t) => t.taskKey === 'pyq_test');
  const pyqSolTask = tasks.find((t) => t.taskKey === 'pyq_solution');
  if (pyqTask && pyqTask.pyqTestDetails) {
    const acc = pyqTask.pyqTestDetails.accuracy || 0;
    if (acc >= 85) pyqPerformanceScore += 5;
    else if (acc >= 70) pyqPerformanceScore += 4;
    else if (acc >= 50) pyqPerformanceScore += 3;
    else if (pyqTask.status === 'completed') pyqPerformanceScore += 2;

    if (pyqTask.pyqTestDetails.mistakesAnalyzed) {
      pyqPerformanceScore += 2;
    }
  }
  if (pyqSolTask && pyqSolTask.status === 'completed') {
    pyqPerformanceScore += 3;
  }
  pyqPerformanceScore = Math.min(10, pyqPerformanceScore);

  // 5. Personal Discipline (Walk + Vipassana) (up to 5 pts)
  let personalDisciplineScore = 0;
  const walk = tasks.find((t) => t.taskKey === 'walk');
  const vipassana = tasks.find((t) => t.taskKey === 'vipassana');
  if (walk?.status === 'completed') personalDisciplineScore += 2.5;
  if (vipassana?.status === 'completed') personalDisciplineScore += 2.5;

  // 6. Daily Review Completion (up to 5 pts)
  let dailyReviewScore = 0;
  if (review && review.completedSummary && review.learnedToday) {
    dailyReviewScore = 5;
  } else {
    const revTask = tasks.find((t) => t.taskKey === 'review');
    if (revTask?.status === 'completed') dailyReviewScore = 4;
  }

  const totalScore = Math.min(
    100,
    Math.round(
      taskCompletionScore +
        studyExecutionScore +
        timeAdherenceScore +
        pyqPerformanceScore +
        personalDisciplineScore +
        dailyReviewScore
    )
  );

  let feedback = 'Solid execution momentum! Keep pushing consistently.';
  if (totalScore >= 90) {
    feedback = 'Outstanding day! Exceptional study adherence and discipline.';
  } else if (totalScore >= 75) {
    feedback = 'Great job executing your core blocks. Small tweaks tomorrow will take you to 90+.';
  } else if (totalScore >= 50) {
    feedback = 'Decent progress made today. Review what pulled you off track and tighten tomorrow.';
  } else {
    feedback = 'Tough day, but remember: Execution > Perfection. Reset and win the morning tomorrow!';
  }

  return {
    totalScore,
    taskCompletionScore,
    studyExecutionScore,
    timeAdherenceScore,
    pyqPerformanceScore,
    personalDisciplineScore,
    dailyReviewScore,
    feedback,
  };
}

// Calculate the summary report required at the end of the prompt
export function calculateTodaySummary(
  tasks: DailyTaskItem[],
  review?: ReviewDetails,
  streakDays = 7,
  weeklyRate = 85
): TodaySummaryReport {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const missedTasks = tasks.filter((t) => t.status === 'missed').length;

  const studyTasks = tasks.filter((t) => t.category === 'Study');
  const completedStudyTasks = studyTasks.filter((t) => t.status === 'completed').length;
  const studyExecutionRate = studyTasks.length > 0 ? Math.round((completedStudyTasks / studyTasks.length) * 100) : 0;

  const habitTasks = tasks.filter((t) => t.category === 'Personal');
  const completedHabits = habitTasks.filter((t) => t.status === 'completed').length;
  const habitExecutionRate = habitTasks.length > 0 ? Math.round((completedHabits / habitTasks.length) * 100) : 0;

  const pyqTask = tasks.find((t) => t.taskKey === 'pyq_test');
  const pyqAccuracy = pyqTask?.pyqTestDetails?.accuracy || 0;

  // Study hours
  let totalStudyMinutes = 0;
  studyTasks.forEach((t) => {
    totalStudyMinutes += t.actualDurationMinutes > 0 ? t.actualDurationMinutes : t.status === 'completed' ? t.targetDurationMinutes : 0;
  });
  const totalStudyHours = parseFloat((totalStudyMinutes / 60).toFixed(1));

  let plannedStudyMinutes = 0;
  studyTasks.forEach((t) => (plannedStudyMinutes += t.targetDurationMinutes));

  // Personal minutes
  let totalPersonalMinutes = 0;
  habitTasks.forEach((t) => {
    totalPersonalMinutes += t.actualDurationMinutes > 0 ? t.actualDurationMinutes : t.status === 'completed' ? t.targetDurationMinutes : 0;
  });

  const dailyScoreBreakdown = calculateDailyScore(tasks, review);

  return {
    totalTasks: 8,
    completedTasks,
    missedTasks,
    dailyScore: dailyScoreBreakdown.totalScore,
    completionFraction: `${completedTasks}/8`,
    studyExecutionRate,
    habitExecutionRate,
    currentStreak: streakDays,
    pyqAccuracy,
    totalStudyHours,
    totalPersonalMinutes,
    weeklyCompletionRate: weeklyRate,
    plannedStudyMinutes,
    actualStudyMinutes: totalStudyMinutes,
  };
}

// Calculate streaks across all days
export function calculateTaskStreaks(
  tasksMap: Record<string, DailyTaskItem[]>
): Record<CoreTaskKey | 'overall', number> {
  const result: Record<CoreTaskKey | 'overall', number> = {
    walk: 0,
    vipassana: 0,
    pyq_test: 0,
    pyq_solution: 0,
    decode: 0,
    marathon: 0,
    english: 0,
    review: 0,
    overall: 0,
  };

  const datesDesc: string[] = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    datesDesc.push(format(subDays(today, i), 'yyyy-MM-dd'));
  }

  // Calculate overall execution streak (where at least 5 of 8 tasks or score >= 65)
  let overallStreak = 0;
  for (let i = 0; i < datesDesc.length; i++) {
    const dStr = datesDesc[i];
    const dayTasks = tasksMap[dStr];
    if (!dayTasks) {
      if (i === 0) continue; // Allow today in progress
      break;
    }
    const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
    if (completedCount >= 5) {
      overallStreak++;
    } else {
      if (i === 0) continue; // skip today if still in progress
      break;
    }
  }
  result.overall = overallStreak;

  // Calculate individual task streaks
  const keys: CoreTaskKey[] = ['walk', 'vipassana', 'pyq_test', 'pyq_solution', 'decode', 'marathon', 'english', 'review'];
  keys.forEach((key) => {
    let streak = 0;
    for (let i = 0; i < datesDesc.length; i++) {
      const dStr = datesDesc[i];
      const dayTasks = tasksMap[dStr];
      if (!dayTasks) {
        if (i === 0) continue;
        break;
      }
      const task = dayTasks.find((t) => t.taskKey === key);
      if (task?.status === 'completed') {
        streak++;
      } else {
        if (i === 0) continue;
        break;
      }
    }
    result[key] = streak;
  });

  return result;
}

// Calculate Weekly Dashboard Data
export function calculateWeeklyDashboard(
  tasksMap: Record<string, DailyTaskItem[]>,
  refDate: Date = new Date()
): WeeklyDashboardData {
  const weekStart = startOfWeek(refDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(refDate, { weekStartsOn: 1 }) });

  let totalTasksCount = 0;
  let totalCompletedTasks = 0;
  let totalStudyTasks = 0;
  let completedStudyTasks = 0;
  let totalHabitTasks = 0;
  let completedHabitTasks = 0;

  let totalStudyMinutes = 0;
  let totalWalkingMinutes = 0;
  let totalVipassanaMinutes = 0;
  let totalEnglishMinutes = 0;

  let pyqScores: number[] = [];
  let pyqAccuracies: number[] = [];
  let completedMarathons = 0;
  let completedDecodeTopics = 0;

  const missedCountByTask: Record<string, number> = {};
  const missedReasonsMap: Record<MissedReason, number> = {
    'Lack of time': 0,
    Distraction: 0,
    'Low energy': 0,
    Overslept: 0,
    'Unexpected work': 0,
    'Poor planning': 0,
    Procrastination: 0,
    Other: 0,
  };

  let bestDayScore = -1;
  let bestExecutionDay = 'Thursday';

  const sevenDayHeatmap: WeeklyDashboardData['sevenDayHeatmap'] = [];

  weekDays.forEach((day) => {
    const dStr = format(day, 'yyyy-MM-dd');
    const dayName = format(day, 'EEE');
    const tasks = tasksMap[dStr] || generateDailyTasksForDate(dStr);

    let dayCompleted = 0;
    const taskStatusMap: Record<CoreTaskKey, TaskExecutionStatus> = {
      walk: 'not_started',
      vipassana: 'not_started',
      pyq_test: 'not_started',
      pyq_solution: 'not_started',
      decode: 'not_started',
      marathon: 'not_started',
      english: 'not_started',
      review: 'not_started',
    };

    tasks.forEach((t) => {
      totalTasksCount++;
      taskStatusMap[t.taskKey] = t.status;
      if (t.status === 'completed') {
        totalCompletedTasks++;
        dayCompleted++;
      }

      if (t.status === 'missed') {
        missedCountByTask[t.title] = (missedCountByTask[t.title] || 0) + 1;
        if (t.missedReason) {
          missedReasonsMap[t.missedReason] = (missedReasonsMap[t.missedReason] || 0) + 1;
        }
      }

      if (t.category === 'Study') {
        totalStudyTasks++;
        if (t.status === 'completed') {
          completedStudyTasks++;
          totalStudyMinutes += t.actualDurationMinutes || t.targetDurationMinutes;
        }
      } else {
        totalHabitTasks++;
        if (t.status === 'completed') {
          completedHabitTasks++;
        }
      }

      // Specific metrics
      if (t.taskKey === 'walk' && t.status === 'completed') {
        totalWalkingMinutes += t.actualDurationMinutes || 30;
      }
      if (t.taskKey === 'vipassana' && t.status === 'completed') {
        totalVipassanaMinutes += t.actualDurationMinutes || 45;
      }
      if (t.taskKey === 'english' && t.status === 'completed') {
        totalEnglishMinutes += t.actualDurationMinutes || 30;
      }
      if (t.taskKey === 'marathon' && t.status === 'completed') {
        completedMarathons++;
      }
      if (t.taskKey === 'decode' && t.status === 'completed') {
        completedDecodeTopics++;
      }
      if (t.taskKey === 'pyq_test' && t.pyqTestDetails && t.pyqTestDetails.attempted > 0) {
        pyqScores.push(t.pyqTestDetails.score);
        pyqAccuracies.push(t.pyqTestDetails.accuracy);
      }
    });

    const dayScoreBreakdown = calculateDailyScore(tasks);
    if (dayScoreBreakdown.totalScore > bestDayScore) {
      bestDayScore = dayScoreBreakdown.totalScore;
      bestExecutionDay = format(day, 'EEEE');
    }

    const studyCompleted = tasks.filter((t) => t.category === 'Study' && t.status === 'completed').length >= 4;
    const habitsCompleted = tasks.filter((t) => t.category === 'Personal' && t.status === 'completed').length === 2;

    sevenDayHeatmap.push({
      date: dStr,
      dayName,
      score: dayScoreBreakdown.totalScore,
      completedCount: dayCompleted,
      studyCompleted,
      habitsCompleted,
      tasksStatus: taskStatusMap,
    });
  });

  const weeklyCompletionRate = totalTasksCount > 0 ? Math.round((totalCompletedTasks / totalTasksCount) * 100) : 0;
  const studyCompletionRate = totalStudyTasks > 0 ? Math.round((completedStudyTasks / totalStudyTasks) * 100) : 0;
  const habitCompletionRate = totalHabitTasks > 0 ? Math.round((completedHabitTasks / totalHabitTasks) * 100) : 0;

  const pyqAverageScore = pyqScores.length > 0 ? Math.round(pyqScores.reduce((a, b) => a + b, 0) / pyqScores.length) : 0;
  const pyqAverageAccuracy = pyqAccuracies.length > 0 ? Math.round(pyqAccuracies.reduce((a, b) => a + b, 0) / pyqAccuracies.length) : 0;

  // Find most missed task
  let mostMissedTask = 'None';
  let maxMissed = 0;
  Object.entries(missedCountByTask).forEach(([taskName, count]) => {
    if (count > maxMissed) {
      maxMissed = count;
      mostMissedTask = taskName;
    }
  });

  const missedReasonsBreakdown = Object.entries(missedReasonsMap).map(([reason, count]) => ({
    reason: reason as MissedReason,
    count,
  }));

  return {
    weeklyCompletionRate,
    studyCompletionRate,
    habitCompletionRate,
    pyqAverageScore,
    pyqAverageAccuracy,
    totalStudyHours: parseFloat((totalStudyMinutes / 60).toFixed(1)),
    totalWalkingMinutes,
    totalVipassanaMinutes,
    totalEnglishMinutes,
    completedMarathons,
    completedDecodeTopics,
    bestExecutionDay,
    mostMissedTask,
    currentStreak: calculateTaskStreaks(tasksMap).overall,
    missedReasonsBreakdown,
    sevenDayHeatmap,
  };
}

// Calculate Monthly Dashboard Data
export function calculateMonthlyDashboard(
  tasksMap: Record<string, DailyTaskItem[]>,
  refDate: Date = new Date()
): MonthlyDashboardData {
  const monthStart = startOfMonth(refDate);
  const monthEnd = endOfMonth(refDate);
  const lastLivedDay = minDate([monthEnd, new Date()]);
  const monthDays = eachDayOfInterval({ start: monthStart, end: lastLivedDay });

  let totalTasks = 0;
  let completedTasks = 0;
  let missedTasks = 0;
  let totalStudyMinutes = 0;
  const pyqScores: number[] = [];
  const pyqAccuracies: number[] = [];

  const consistencyCounts: Record<CoreTaskKey, { completed: number; total: number }> = {
    walk: { completed: 0, total: 0 },
    vipassana: { completed: 0, total: 0 },
    pyq_test: { completed: 0, total: 0 },
    pyq_solution: { completed: 0, total: 0 },
    decode: { completed: 0, total: 0 },
    marathon: { completed: 0, total: 0 },
    english: { completed: 0, total: 0 },
    review: { completed: 0, total: 0 },
  };

  const weekBuckets = new Map<number, { completed: number; total: number; studyMinutes: number; scores: number[] }>();

  monthDays.forEach((day) => {
    const dStr = format(day, 'yyyy-MM-dd');
    const tasks = tasksMap[dStr] || generateDailyTasksForDate(dStr);
    const weekIndex = Math.floor((day.getDate() - 1) / 7);
    if (!weekBuckets.has(weekIndex)) {
      weekBuckets.set(weekIndex, { completed: 0, total: 0, studyMinutes: 0, scores: [] });
    }
    const bucket = weekBuckets.get(weekIndex)!;

    const dayScore = calculateDailyScore(tasks);
    bucket.scores.push(dayScore.totalScore);

    tasks.forEach((t) => {
      totalTasks++;
      bucket.total++;
      consistencyCounts[t.taskKey].total++;

      if (t.status === 'completed') {
        completedTasks++;
        bucket.completed++;
        consistencyCounts[t.taskKey].completed++;
      }
      if (t.status === 'missed') {
        missedTasks++;
      }
      if (t.category === 'Study' && t.status === 'completed') {
        const mins = t.actualDurationMinutes || t.targetDurationMinutes;
        totalStudyMinutes += mins;
        bucket.studyMinutes += mins;
      }
      if (t.taskKey === 'pyq_test' && t.pyqTestDetails && t.pyqTestDetails.attempted > 0) {
        pyqScores.push(t.pyqTestDetails.score);
        pyqAccuracies.push(t.pyqTestDetails.accuracy);
      }
    });
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const averagePyqScore = pyqScores.length > 0 ? Math.round(pyqScores.reduce((a, b) => a + b, 0) / pyqScores.length) : 0;
  const averagePyqAccuracy =
    pyqAccuracies.length > 0 ? Math.round(pyqAccuracies.reduce((a, b) => a + b, 0) / pyqAccuracies.length) : 0;

  const consistencyRate = (key: CoreTaskKey) => {
    const c = consistencyCounts[key];
    return c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
  };

  const weeklyTrend = Array.from(weekBuckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([weekIndex, bucket], i, arr) => ({
      weekLabel: i === arr.length - 1 ? 'Current Week' : `Week ${weekIndex + 1}`,
      completionRate: bucket.total > 0 ? Math.round((bucket.completed / bucket.total) * 100) : 0,
      studyHours: parseFloat((bucket.studyMinutes / 60).toFixed(1)),
      score: bucket.scores.length > 0 ? Math.round(bucket.scores.reduce((a, b) => a + b, 0) / bucket.scores.length) : 0,
    }));

  // Trend: compare first half vs second half of tracked weeks
  let trend: 'improving' | 'declining' | 'steady' = 'steady';
  if (weeklyTrend.length >= 2) {
    const first = weeklyTrend[0].completionRate;
    const last = weeklyTrend[weeklyTrend.length - 1].completionRate;
    if (last > first + 3) trend = 'improving';
    else if (last < first - 3) trend = 'declining';
  }

  return {
    totalTasks,
    completedTasks,
    missedTasks,
    completionRate,
    totalStudyHours: parseFloat((totalStudyMinutes / 60).toFixed(1)),
    averagePyqScore,
    averagePyqAccuracy,
    walkConsistencyRate: consistencyRate('walk'),
    vipassanaConsistencyRate: consistencyRate('vipassana'),
    englishSpeakingConsistencyRate: consistencyRate('english'),
    marathonConsistencyRate: consistencyRate('marathon'),
    decodeConsistencyRate: consistencyRate('decode'),
    reviewConsistencyRate: consistencyRate('review'),
    trend,
    weeklyTrend,
  };
}

export function calculateAllTimeDashboard(
  tasksMap: Record<string, DailyTaskItem[]>,
  refDate: Date = new Date()
): AllTimeDashboardData {
  const recordedDates = Object.keys(tasksMap).sort();
  const startDateStr = recordedDates.length > 0 ? recordedDates[0] : format(refDate, 'yyyy-MM-dd');
  const startDate = parseISO(startDateStr);
  const allDays = eachDayOfInterval({ start: startDate, end: refDate });

  let totalTasks = 0;
  let completedTasks = 0;
  let missedTasks = 0;
  let totalStudyMinutes = 0;
  const pyqScores: number[] = [];
  const pyqAccuracies: number[] = [];

  const consistencyCounts: Record<CoreTaskKey, { completed: number; total: number }> = {
    walk: { completed: 0, total: 0 },
    vipassana: { completed: 0, total: 0 },
    pyq_test: { completed: 0, total: 0 },
    pyq_solution: { completed: 0, total: 0 },
    decode: { completed: 0, total: 0 },
    marathon: { completed: 0, total: 0 },
    english: { completed: 0, total: 0 },
    review: { completed: 0, total: 0 },
  };

  const monthBuckets = new Map<string, { completed: number; total: number; studyMinutes: number; days: Set<string> }>();

  allDays.forEach((day) => {
    const dStr = format(day, 'yyyy-MM-dd');
    // Only count days that actually have a recorded entry (avoid padding future/unlived days)
    const tasks = tasksMap[dStr];
    if (!tasks) return;

    const monthKey = format(day, 'yyyy-MM');
    if (!monthBuckets.has(monthKey)) {
      monthBuckets.set(monthKey, { completed: 0, total: 0, studyMinutes: 0, days: new Set() });
    }
    const bucket = monthBuckets.get(monthKey)!;
    bucket.days.add(dStr);

    tasks.forEach((t) => {
      totalTasks++;
      bucket.total++;
      consistencyCounts[t.taskKey].total++;

      if (t.status === 'completed') {
        completedTasks++;
        bucket.completed++;
        consistencyCounts[t.taskKey].completed++;
      }
      if (t.status === 'missed') {
        missedTasks++;
      }
      if (t.category === 'Study' && t.status === 'completed') {
        const mins = t.actualDurationMinutes || t.targetDurationMinutes;
        totalStudyMinutes += mins;
        bucket.studyMinutes += mins;
      }
      if (t.taskKey === 'pyq_test' && t.pyqTestDetails && t.pyqTestDetails.attempted > 0) {
        pyqScores.push(t.pyqTestDetails.score);
        pyqAccuracies.push(t.pyqTestDetails.accuracy);
      }
    });
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const averagePyqScore = pyqScores.length > 0 ? Math.round(pyqScores.reduce((a, b) => a + b, 0) / pyqScores.length) : 0;
  const averagePyqAccuracy =
    pyqAccuracies.length > 0 ? Math.round(pyqAccuracies.reduce((a, b) => a + b, 0) / pyqAccuracies.length) : 0;

  const consistencyRate = (key: CoreTaskKey) => {
    const c = consistencyCounts[key];
    return c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
  };

  const monthlyTrend = Array.from(monthBuckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([monthKey, bucket]) => ({
      monthLabel: format(parseISO(`${monthKey}-01`), 'MMM yyyy'),
      completionRate: bucket.total > 0 ? Math.round((bucket.completed / bucket.total) * 100) : 0,
      studyHours: parseFloat((bucket.studyMinutes / 60).toFixed(1)),
      daysTracked: bucket.days.size,
    }));

  let bestMonth = 'N/A';
  let bestRate = -1;
  monthlyTrend.forEach((m) => {
    if (m.completionRate > bestRate) {
      bestRate = m.completionRate;
      bestMonth = m.monthLabel;
    }
  });

  return {
    startDate: startDateStr,
    daysTracked: recordedDates.length,
    totalTasks,
    completedTasks,
    missedTasks,
    completionRate,
    totalStudyHours: parseFloat((totalStudyMinutes / 60).toFixed(1)),
    averagePyqScore,
    averagePyqAccuracy,
    walkConsistencyRate: consistencyRate('walk'),
    vipassanaConsistencyRate: consistencyRate('vipassana'),
    englishSpeakingConsistencyRate: consistencyRate('english'),
    marathonConsistencyRate: consistencyRate('marathon'),
    decodeConsistencyRate: consistencyRate('decode'),
    reviewConsistencyRate: consistencyRate('review'),
    bestMonth,
    monthlyTrend,
  };
}

// Generate Realistic Seed Data for Hitesh Gauswami for the past 14 days
export function generateHiteshSeedData(today = new Date()): {
  tasksMap: Record<string, DailyTaskItem[]>;
  reviewsMap: Record<string, ReviewDetails>;
} {
  const tasksMap: Record<string, DailyTaskItem[]> = {};
  const reviewsMap: Record<string, ReviewDetails> = {};

  const upscPharmaTopics = [
    {
      subject: 'Pharmacology',
      topic: 'Autonomic Nervous System & Adrenergic Agonists / Antagonists',
      pyqTest: 'UPSC DI 2021 Paper 1 - Pharmacology',
      questions: 50,
      attempted: 48,
      correct: 42,
      wrong: 6,
      score: 84,
      accuracy: 87.5,
      marathon: 'High-Yield Autonomic & Cardiovascular Pharmacology Sprint',
    },
    {
      subject: 'Pharmaceutics',
      topic: 'Tablets Manufacturing, Granulation Defects & Dissolution Apparatus',
      pyqTest: 'UPSC DI 2019 Paper - Pharmaceutics & Industrial Pharmacy',
      questions: 50,
      attempted: 47,
      correct: 40,
      wrong: 7,
      score: 80,
      accuracy: 85.1,
      marathon: 'Solid Dosage Forms, Bioavailability & Novel Drug Delivery',
    },
    {
      subject: 'Jurisprudence & DCA',
      topic: 'Drugs & Cosmetics Act 1940: Schedules M, C, H, X & Drug Inspector Powers',
      pyqTest: 'UPSC DI Regulatory Affairs & Pharmacy Law Benchmark',
      questions: 50,
      attempted: 49,
      correct: 45,
      wrong: 4,
      score: 90,
      accuracy: 91.8,
      marathon: 'Complete Pharmacy Law, Schedules & Regulatory Penalties Marathon',
    },
    {
      subject: 'Pharmaceutical Analysis',
      topic: 'HPLC Instrumentation, Chromatography Parameters & UV-Visible Spectroscopy',
      pyqTest: 'Analytical Chemistry & Quality Assurance Mock 03',
      questions: 50,
      attempted: 46,
      correct: 39,
      wrong: 7,
      score: 78,
      accuracy: 84.8,
      marathon: 'Instrumental Methods of Analysis & Pharmacopoeial Assays',
    },
    {
      subject: 'Pharmacognosy',
      topic: 'Alkaloids, Glycosides Classification & Secondary Metabolite Assays',
      pyqTest: 'UPSC DI Herbal Drugs & Pharmacognosy Paper 2',
      questions: 50,
      attempted: 45,
      correct: 38,
      wrong: 7,
      score: 76,
      accuracy: 84.4,
      marathon: 'Natural Product Chemistry & Standardization Marathon',
    },
  ];

  for (let i = 14; i >= 0; i--) {
    const d = subDays(today, i);
    const dStr = format(d, 'yyyy-MM-dd');
    const dayOfWeek = format(d, 'EEEE');
    const topicData = upscPharmaTopics[i % upscPharmaTopics.length];

    const isToday = i === 0;

    const dayTasks: DailyTaskItem[] = DEFAULT_SCHEDULE_BLOCKS.map((block) => {
      const cfg = CORE_TASKS_CONFIG[block.taskKey];
      // Past days completed, today partially completed up to marathon
      let status: TaskExecutionStatus = 'completed';
      let actualDuration = block.targetDurationMinutes;
      let completionPercentage = 100;

      if (isToday) {
        if (block.taskKey === 'walk' || block.taskKey === 'vipassana' || block.taskKey === 'pyq_test' || block.taskKey === 'pyq_solution') {
          status = 'completed';
          completionPercentage = 100;
        } else if (block.taskKey === 'decode') {
          status = 'in_progress';
          completionPercentage = 65;
          actualDuration = 60;
        } else {
          status = 'not_started';
          completionPercentage = 0;
          actualDuration = 0;
        }
      } else {
        // occasional rescheduled or missed for realism in history
        if (i === 4 && block.taskKey === 'marathon') {
          status = 'missed';
          actualDuration = 0;
          completionPercentage = 0;
        }
      }

      const item: DailyTaskItem = {
        id: `task_${block.taskKey}_${dStr}`,
        taskKey: block.taskKey,
        title: block.title,
        category: block.category,
        isBinary: cfg.isBinary,
        date: dStr,
        dayOfWeek,
        plannedStartTime: block.plannedStartTime,
        plannedEndTime: block.plannedEndTime,
        actualStartTime: block.plannedStartTime,
        actualEndTime: block.plannedEndTime,
        targetDurationMinutes: block.targetDurationMinutes,
        actualDurationMinutes: actualDuration,
        status,
        completionPercentage,
        notes: '',
      };

      if (status === 'missed') {
        item.missedReason = 'Unexpected work';
        item.notes = 'Hospital work requirement delayed marathon slot.';
      }

      if (block.taskKey === 'pyq_test') {
        item.pyqTestDetails = {
          testName: topicData.pyqTest,
          subject: topicData.subject,
          numberOfQuestions: topicData.questions,
          attempted: topicData.attempted,
          correct: topicData.correct,
          wrong: topicData.wrong,
          score: topicData.score,
          accuracy: topicData.accuracy,
          timeTakenMinutes: 80,
          mistakesAnalyzed: true,
        };
      }

      if (block.taskKey === 'pyq_solution') {
        item.pyqSolutionDetails = {
          questionsAnalyzed: topicData.wrong + 5,
          wrongQuestions: topicData.wrong,
          conceptualMistakes: Math.floor(topicData.wrong * 0.6),
          sillyMistakes: Math.floor(topicData.wrong * 0.4),
          knowledgeGaps: 2,
          notesUpdated: true,
          revisionRequired: true,
        };
      }

      if (block.taskKey === 'decode') {
        item.decodeDetails = {
          subject: topicData.subject,
          topic: topicData.topic,
          topicCompleted: status === 'completed',
          importantPointsExtracted: `Key takeaways linked directly to ${topicData.pyqTest}: Receptor mechanisms, rate-limiting steps, and critical test exceptions.`,
          notesUpdated: true,
          revisionRequired: false,
        };
      }

      if (block.taskKey === 'marathon') {
        item.marathonDetails = {
          subject: topicData.subject,
          topic: topicData.marathon,
          durationMinutes: 120,
          marathonCompleted: status === 'completed',
          notes: 'High-speed comprehensive review covering 100+ multiple-choice concepts.',
        };
      }

      if (block.taskKey === 'english') {
        item.englishDetails = {
          practiceDurationMinutes: 30,
          topicSpokenAbout: `Explaining ${topicData.subject} concepts and Section 22 inspections in fluent English.`,
          confidenceLevel: 4,
          fluency: 4,
          vocabularyLearned: ['Contraband', 'Adulteration', 'Potency', 'Efficacy', 'Bioequivalence'],
          majorMistakes: 'Minor tense inconsistency when explaining historical precedents',
          todayImprovement: 'Noticeably sharper technical diction and structured flow',
        };
      }

      if (block.taskKey === 'walk') {
        item.walkDetails = {
          durationMinutes: 30,
          distanceKm: 2.8,
          stepCount: 3800,
          notes: 'Fresh morning air, consistent brisk cadence.',
        };
      }

      if (block.taskKey === 'vipassana') {
        item.vipassanaDetails = {
          durationMinutes: 45,
          focusQuality: 'Deep',
          notes: 'Settled mind quickly. Calm nervous system before the 9:00 AM PYQ Test.',
        };
      }

      return item;
    });

    tasksMap[dStr] = dayTasks;

    if (!isToday || i === 0) {
      reviewsMap[dStr] = {
        completedSummary: `Completed PYQ Test (${topicData.subject}) with ${topicData.accuracy}% accuracy, morning walk, and Vipassana.`,
        missedSummary: i === 4 ? 'Missed evening marathon block due to emergency.' : 'No major items missed.',
        missedReason: i === 4 ? 'Unexpected work' : 'None',
        biggestDistraction: 'Smartphone WhatsApp alerts during the late afternoon break.',
        learnedToday: `Mastered critical differential diagnosis questions and ${topicData.subject} statutory rules.`,
        improveTomorrow: 'Execute Decode topic immediately after PYQ Solution without any phone delay.',
        proudOf: `Maintained 85%+ accuracy in ${topicData.subject} and completed 45-min Vipassana without restless fidgeting.`,
        tomorrowPriority: 'Solve 60 PYQ questions from Industrial Pharmacy & complete Schedules M revision.',
        minutesSpent: 25,
      };
    }
  }

  return { tasksMap, reviewsMap };
}
