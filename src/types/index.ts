export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type HabitFrequency = 'daily' | 'weekdays' | 'custom';
export type PomodoroType = 'work' | 'short_break' | 'long_break';
export type ActivityType = 'reading' | 'study' | 'focus' | 'workout' | 'meditation' | 'custom';

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  must_change_password?: boolean;
  email: string;
  display_name: string;
  avatar_url: string;
  timezone: string;
  daily_goal_minutes: number;
  theme_preference: 'dark' | 'light' | 'system';
  role_title?: string;
  bio?: string;
  last_login?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  target_days: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  target_per_day: number;
  color: string;
  icon: string;
  reminder_time?: string;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string; // YYYY-MM-DD
  count: number;
  notes?: string;
  created_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: string;
  estimated_minutes: number;
  actual_minutes: number;
  tags: string[];
  subtasks?: Subtask[];
  created_at: string;
  updated_at: string;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  task_id?: string;
  duration_minutes: number;
  session_type: PomodoroType;
  notes?: string;
  completed_at: string;
}

export interface LiveActivitySession {
  id: string;
  user_id: string;
  topic: string;
  activity_type: ActivityType;
  status: 'active' | 'paused' | 'completed';
  started_at: string;
  elapsed_seconds: number;
  target_seconds: number;
  current_unit_label?: string; // e.g. "Pages Read", "Chapters", "Concepts"
  current_units?: number;
  target_units?: number;
  last_synced_at: string;
  source_device: 'mobile' | 'watch' | 'desktop';
  heart_rate_simulated?: number;
  notes?: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate30Days: number;
  isCompletedToday: boolean;
}

export interface AnalyticsSummary {
  dailyHabitRate: number;
  activeTasks: number;
  completedTasks: number;
  longestActiveStreak: number;
  todayProductiveMinutes: number;
  weeklyHabitVelocity: { day: string; habitsCompleted: number; tasksCompleted: number; target: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  recentHeatmap: { date: string; count: number; level: number }[];
}

// -------------------------------------------------------------
// UPSC DRUG INSPECTOR DAILY ACCOUNTABILITY TRACKER SYSTEM
// -------------------------------------------------------------

export type CoreTaskKey =
  | 'pyq_test'
  | 'pyq_solution'
  | 'marathon'
  | 'decode'
  | 'english'
  | 'review'
  | 'walk'
  | 'vipassana';

export type TaskExecutionStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'missed'
  | 'rescheduled';

export type MissedReason =
  | 'Lack of time'
  | 'Distraction'
  | 'Low energy'
  | 'Overslept'
  | 'Unexpected work'
  | 'Poor planning'
  | 'Procrastination'
  | 'Other';

export interface PYQTestDetails {
  testName: string; // e.g. "UPSC DI 2021 Mock 04"
  subject: string; // Pharmacology, Pharmaceutics, Jurisprudence, etc.
  numberOfQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  accuracy: number; // calculated: (correct / attempted) * 100
  timeTakenMinutes: number;
  mistakesAnalyzed: boolean;
}

export interface PYQSolutionDetails {
  questionsAnalyzed: number;
  wrongQuestions: number;
  conceptualMistakes: number;
  sillyMistakes: number;
  knowledgeGaps: number;
  notesUpdated: boolean;
  revisionRequired: boolean;
}

export interface MarathonDetails {
  subject: string;
  topic: string;
  durationMinutes: number;
  marathonCompleted: boolean;
  notes?: string;
}

export interface DecodeDetails {
  subject: string;
  topic: string; // Connected directly to PYQ work!
  topicCompleted: boolean;
  importantPointsExtracted: string;
  notesUpdated: boolean;
  revisionRequired: boolean;
}

export interface EnglishDetails {
  practiceDurationMinutes: number;
  topicSpokenAbout: string;
  confidenceLevel: number; // 1 to 5
  fluency: number; // 1 to 5
  vocabularyLearned: string[];
  majorMistakes: string;
  todayImprovement: string;
}

export interface WalkDetails {
  durationMinutes: number; // 30
  distanceKm?: number;
  stepCount?: number;
  notes?: string;
}

export interface VipassanaDetails {
  durationMinutes: number; // 45
  focusQuality: 'Deep' | 'Moderate' | 'Distracted';
  notes?: string;
}

export interface ReviewDetails {
  completedSummary: string; // 1. What did I complete today?
  missedSummary: string; // 2. What did I miss?
  missedReason: string; // 3. Why did I miss it?
  biggestDistraction: string; // 4. What was my biggest distraction?
  learnedToday: string; // 5. What did I learn today?
  improveTomorrow: string; // 6. What should I improve tomorrow?
  proudOf: string; // 7. One thing I am proud of today.
  tomorrowPriority: string;
  minutesSpent: number;
}

export interface DailyTaskItem {
  id: string;
  taskKey: CoreTaskKey;
  title: string;
  category: 'Study' | 'Personal';
  isBinary: boolean; // Walk, Vipassana, Marathon, English practice vs Quantity-based
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Monday, Tuesday...
  plannedStartTime: string; // e.g. "09:00"
  plannedEndTime: string; // e.g. "10:30"
  actualStartTime?: string; // e.g. "09:05"
  actualEndTime?: string; // e.g. "10:25"
  targetDurationMinutes: number;
  actualDurationMinutes: number;
  status: TaskExecutionStatus;
  completionPercentage: number; // 0 to 100
  notes?: string;
  missedReason?: MissedReason;

  // Domain-specific payloads
  pyqTestDetails?: PYQTestDetails;
  pyqSolutionDetails?: PYQSolutionDetails;
  marathonDetails?: MarathonDetails;
  decodeDetails?: DecodeDetails;
  englishDetails?: EnglishDetails;
  walkDetails?: WalkDetails;
  vipassanaDetails?: VipassanaDetails;
  reviewDetails?: ReviewDetails;
}

export interface DailyScheduleBlock {
  taskKey: CoreTaskKey;
  title: string;
  category: 'Study' | 'Personal';
  blockLabel: 'Morning' | 'Study Block' | 'Evening' | 'Night';
  plannedStartTime: string;
  plannedEndTime: string;
  targetDurationMinutes: number;
}

export interface DailyScoreBreakdown {
  totalScore: number; // out of 100
  taskCompletionScore: number; // up to 40
  studyExecutionScore: number; // up to 25
  timeAdherenceScore: number; // up to 15
  pyqPerformanceScore: number; // up to 10
  personalDisciplineScore: number; // up to 5
  dailyReviewScore: number; // up to 5
  feedback: string;
}

export interface TodaySummaryReport {
  totalTasks: 8;
  completedTasks: number;
  missedTasks: number;
  dailyScore: number;
  completionFraction: string; // e.g. "7/8"
  studyExecutionRate: number; // %
  habitExecutionRate: number; // %
  currentStreak: number;
  pyqAccuracy: number; // %
  totalStudyHours: number; // in hours with 1 decimal
  totalPersonalMinutes: number;
  weeklyCompletionRate: number;
  plannedStudyMinutes: number;
  actualStudyMinutes: number;
}

export interface WeeklyDashboardData {
  weeklyCompletionRate: number;
  studyCompletionRate: number;
  habitCompletionRate: number;
  pyqAverageScore: number;
  pyqAverageAccuracy: number;
  totalStudyHours: number;
  totalWalkingMinutes: number;
  totalVipassanaMinutes: number;
  totalEnglishMinutes: number;
  completedMarathons: number;
  completedDecodeTopics: number;
  bestExecutionDay: string;
  mostMissedTask: string;
  currentStreak: number;
  missedReasonsBreakdown: { reason: MissedReason; count: number }[];
  sevenDayHeatmap: {
    date: string;
    dayName: string;
    score: number;
    completedCount: number;
    studyCompleted: boolean;
    habitsCompleted: boolean;
    tasksStatus: Record<CoreTaskKey, TaskExecutionStatus>;
  }[];
}

export interface MonthlyDashboardData {
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  completionRate: number;
  totalStudyHours: number;
  averagePyqScore: number;
  averagePyqAccuracy: number;
  walkConsistencyRate: number;
  vipassanaConsistencyRate: number;
  englishSpeakingConsistencyRate: number;
  marathonConsistencyRate: number;
  decodeConsistencyRate: number;
  reviewConsistencyRate: number;
  trend: 'improving' | 'declining' | 'steady';
  weeklyTrend: { weekLabel: string; completionRate: number; studyHours: number; score: number }[];
}

export interface AllTimeDashboardData {
  startDate: string;
  daysTracked: number;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  completionRate: number;
  totalStudyHours: number;
  averagePyqScore: number;
  averagePyqAccuracy: number;
  walkConsistencyRate: number;
  vipassanaConsistencyRate: number;
  englishSpeakingConsistencyRate: number;
  marathonConsistencyRate: number;
  decodeConsistencyRate: number;
  reviewConsistencyRate: number;
  bestMonth: string;
  monthlyTrend: { monthLabel: string; completionRate: number; studyHours: number; daysTracked: number }[];
}

