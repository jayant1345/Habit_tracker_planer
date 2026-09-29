'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Category,
  Habit,
  HabitLog,
  Task,
  Subtask,
  PomodoroSession,
  LiveActivitySession,
  HabitStats,
  AnalyticsSummary,
  ActivityType,
  PomodoroType,
  TaskStatus,
  CoreTaskKey,
  DailyTaskItem,
  DailyScheduleBlock,
  TodaySummaryReport,
  WeeklyDashboardData,
  MonthlyDashboardData,
  ReviewDetails,
} from '@/types';
import { useAuth } from './AuthContext';
import { StorageEngine } from '@/lib/storage';
import { sounds, triggerMorPankhConfetti } from '@/lib/sound';
import {
  DEFAULT_SCHEDULE_BLOCKS,
  generateDailyTasksForDate,
  calculateTodaySummary,
  calculateWeeklyDashboard,
  calculateMonthlyDashboard,
  calculateTaskStreaks,
} from '@/lib/upscTracker';
import { format } from 'date-fns';

type NavigationTab =
  | 'upsc_tracker'
  | 'dashboard'
  | 'habits'
  | 'tasks'
  | 'reading_tracker'
  | 'pomodoro'
  | 'companion_watch'
  | 'settings';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  categories: Category[];
  habits: Habit[];
  habitLogs: HabitLog[];
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  liveSession: LiveActivitySession | null;

  // UPSC Daily Accountability Tracker
  upscTasksMap: Record<string, DailyTaskItem[]>;
  upscReviewsMap: Record<string, ReviewDetails>;
  upscScheduleBlocks: DailyScheduleBlock[];
  selectedTrackerDate: string;
  setSelectedTrackerDate: (date: string) => void;
  updateDailyTask: (date: string, taskKey: CoreTaskKey, updates: Partial<DailyTaskItem>) => void;
  updateTimeBlock: (taskKey: CoreTaskKey, updates: Partial<DailyScheduleBlock>) => void;
  saveDailyReview: (date: string, review: ReviewDetails) => void;
  getTodaySummary: (date?: string) => TodaySummaryReport;
  getWeeklyDashboardData: (refDate?: string) => WeeklyDashboardData;
  getMonthlyDashboardData: (refDate?: string) => MonthlyDashboardData;
  getTaskStreaks: () => Record<CoreTaskKey | 'overall', number>;

  // Habit Actions
  toggleHabitCompletion: (habitId: string, targetDate?: string) => void;
  addHabit: (data: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  getHabitStats: (habit: Habit) => HabitStats;

  // Task Actions
  addTask: (data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Pomodoro Actions
  logPomodoroSession: (durationMinutes: number, sessionType: PomodoroType, taskId?: string, notes?: string) => void;

  // Live Topic & Companion Watch Sync
  startLiveReadingSession: (topic: string, type?: ActivityType, targetSeconds?: number, unitLabel?: string, targetUnits?: number) => void;
  updateLiveSession: (updates: Partial<LiveActivitySession>) => void;
  togglePauseLiveSession: () => void;
  incrementLiveMilestone: (delta?: number) => void;
  completeLiveSession: () => void;
  resetLiveSession: () => void;

  // Analytics
  analyticsSummary: AnalyticsSummary;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SYNC_CHANNEL_NAME = 'morpankh_companion_sync';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('upsc_tracker');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [categories, setCategories] = useState<Category[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [liveSession, setLiveSession] = useState<LiveActivitySession | null>(null);

  // UPSC Daily Tracker State
  const [upscTasksMap, setUpscTasksMap] = useState<Record<string, DailyTaskItem[]>>({});
  const [upscReviewsMap, setUpscReviewsMap] = useState<Record<string, ReviewDetails>>({});
  const [upscScheduleBlocks, setUpscScheduleBlocks] = useState<DailyScheduleBlock[]>(DEFAULT_SCHEDULE_BLOCKS);
  const [selectedTrackerDate, setSelectedTrackerDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Sync BroadcastChannel for watch companion / multi-tab
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  // Load User Data whenever active user changes
  const loadUserData = useCallback(() => {
    if (!user?.id) {
      setCategories([]);
      setHabits([]);
      setHabitLogs([]);
      setTasks([]);
      setPomodoroSessions([]);
      setLiveSession(null);
      setUpscTasksMap({});
      setUpscReviewsMap({});
      return;
    }
    const loadedCategories = StorageEngine.getData<Category[]>(user.id, 'categories', []);
    const loadedHabits = StorageEngine.getData<Habit[]>(user.id, 'habits', []);
    const loadedLogs = StorageEngine.getData<HabitLog[]>(user.id, 'habit_logs', []);
    const loadedTasks = StorageEngine.getData<Task[]>(user.id, 'tasks', []);
    const loadedPom = StorageEngine.getData<PomodoroSession[]>(user.id, 'pomodoro_sessions', []);
    const loadedLive = StorageEngine.getData<LiveActivitySession | null>(user.id, 'live_session', null);
    const loadedUpscTasks = StorageEngine.getData<Record<string, DailyTaskItem[]>>(user.id, 'upsc_daily_tasks', {});
    const loadedUpscReviews = StorageEngine.getData<Record<string, ReviewDetails>>(user.id, 'upsc_daily_reviews', {});
    const loadedScheduleBlocks = StorageEngine.getData<DailyScheduleBlock[]>(user.id, 'upsc_schedule_blocks', DEFAULT_SCHEDULE_BLOCKS);

    setCategories(loadedCategories);
    setHabits(loadedHabits);
    setHabitLogs(loadedLogs);
    setTasks(loadedTasks);
    setPomodoroSessions(loadedPom);
    setLiveSession(loadedLive);
    setUpscTasksMap(loadedUpscTasks);
    setUpscReviewsMap(loadedUpscReviews);
    setUpscScheduleBlocks(loadedScheduleBlocks);

    // If Hitesh or UPSC aspirant, ensure UPSC tracker is selected tab
    if (user.id === 'user_hitesh_01' || user.username?.includes('hitesh') || user.role_title?.includes('UPSC')) {
      setActiveTab('upsc_tracker');
    }
  }, [user?.id, user?.username, user?.role_title]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle Theme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = (localStorage.getItem('morpankh_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('morpankh_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  // Setup BroadcastChannel for real-time Companion Watch synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        const { type, payload, senderUserId } = event.data;
        if (senderUserId === user?.id) {
          if (type === 'SYNC_LIVE_SESSION') {
            setLiveSession(payload);
          } else if (type === 'HABIT_TOGGLED') {
            loadUserData();
          } else if (type === 'TASK_UPDATED') {
            loadUserData();
          }
        }
      };
      setBroadcastChannel(channel);
    } catch {
      // BroadcastChannel not available
    }

    return () => {
      channel?.close();
    };
  }, [user?.id, loadUserData]);

  const broadcastEvent = useCallback((type: string, payload: unknown) => {
    if (broadcastChannel && user?.id) {
      broadcastChannel.postMessage({ type, payload, senderUserId: user.id });
    }
  }, [broadcastChannel, user?.id]);

  // Live session timer ticker when active
  useEffect(() => {
    if (!liveSession || liveSession.status !== 'active') return;

    const interval = setInterval(() => {
      setLiveSession((prev) => {
        if (!prev || prev.status !== 'active') return prev;
        const updated = {
          ...prev,
          elapsed_seconds: prev.elapsed_seconds + 1,
          last_synced_at: new Date().toISOString(),
          // subtle simulation of pulse/heart rate during deep reading / focus (68 - 78 bpm)
          heart_rate_simulated: Math.floor(70 + Math.sin(Date.now() / 10000) * 6),
        };
        if (user?.id) {
          StorageEngine.setData(user.id, 'live_session', updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [liveSession?.status, user?.id]);

  // Save changes to storage
  const saveHabits = (newHabits: Habit[]) => {
    if (!user?.id) return;
    setHabits(newHabits);
    StorageEngine.setData(user.id, 'habits', newHabits);
  };

  const saveLogs = (newLogs: HabitLog[]) => {
    if (!user?.id) return;
    setHabitLogs(newLogs);
    StorageEngine.setData(user.id, 'habit_logs', newLogs);
    broadcastEvent('HABIT_TOGGLED', newLogs);
  };

  const saveTasks = (newTasks: Task[]) => {
    if (!user?.id) return;
    setTasks(newTasks);
    StorageEngine.setData(user.id, 'tasks', newTasks);
    broadcastEvent('TASK_UPDATED', newTasks);
  };

  const saveLiveSessionState = (session: LiveActivitySession | null) => {
    if (!user?.id) return;
    setLiveSession(session);
    StorageEngine.setData(user.id, 'live_session', session);
    broadcastEvent('SYNC_LIVE_SESSION', session);
  };

  // 1. Habit Completion Toggle
  const toggleHabitCompletion = (habitId: string, targetDate?: string) => {
    if (!user?.id) return;
    const dateStr = targetDate || format(new Date(), 'yyyy-MM-dd');
    const existingIndex = habitLogs.findIndex(
      (l) => l.habit_id === habitId && l.completed_date === dateStr
    );

    let updatedLogs: HabitLog[];
    if (existingIndex >= 0) {
      // Remove completion
      updatedLogs = habitLogs.filter((_, idx) => idx !== existingIndex);
      sounds.playTick();
    } else {
      // Add completion
      const newLog: HabitLog = {
        id: `log_${habitId}_${dateStr}_${Date.now()}`,
        habit_id: habitId,
        user_id: user.id,
        completed_date: dateStr,
        count: 1,
        notes: 'Checked off on MorPankh',
        created_at: new Date().toISOString(),
      };
      updatedLogs = [newLog, ...habitLogs];
      sounds.playCompletionChime();
      triggerMorPankhConfetti();
    }

    saveLogs(updatedLogs);
  };

  const addHabit = (data: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;
    const newHabit: Habit = {
      ...data,
      id: `hab_${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveHabits([newHabit, ...habits]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, ...updates, updated_at: new Date().toISOString() } : h
    );
    saveHabits(updated);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter((h) => h.id !== id));
    saveLogs(habitLogs.filter((l) => l.habit_id !== id));
  };

  const getHabitStats = useCallback(
    (habit: Habit) => StorageEngine.calculateHabitStats(habit, habitLogs),
    [habitLogs]
  );

  // 2. Task Actions
  const addTask = (data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;
    const newTask: Task = {
      ...data,
      id: `task_${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtasks: data.subtasks || [],
    };
    saveTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    );
    saveTasks(updated);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        if (status === 'completed' && t.status !== 'completed') {
          sounds.playCompletionChime();
          triggerMorPankhConfetti();
        }
        return { ...t, status, updated_at: new Date().toISOString() };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId && t.subtasks) {
        const updatedSubs = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, is_completed: !s.is_completed } : s
        );
        const allCompleted = updatedSubs.length > 0 && updatedSubs.every((s) => s.is_completed);
        if (allCompleted && t.status !== 'completed') {
          sounds.playCompletionChime();
          triggerMorPankhConfetti();
        }
        return {
          ...t,
          subtasks: updatedSubs,
          status: allCompleted ? ('completed' as TaskStatus) : t.status,
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!user?.id) return;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const currentSubs = t.subtasks || [];
        const newSub: Subtask = {
          id: `sub_${Date.now()}`,
          task_id: taskId,
          user_id: user.id,
          title,
          is_completed: false,
          order_index: currentSubs.length,
          created_at: new Date().toISOString(),
        };
        return {
          ...t,
          subtasks: [...currentSubs, newSub],
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  // 3. Pomodoro Log
  const logPomodoroSession = (
    durationMinutes: number,
    sessionType: PomodoroType,
    taskId?: string,
    notes?: string
  ) => {
    if (!user?.id) return;
    const newSession: PomodoroSession = {
      id: `pom_${Date.now()}`,
      user_id: user.id,
      task_id: taskId,
      duration_minutes: durationMinutes,
      session_type: sessionType,
      notes,
      completed_at: new Date().toISOString(),
    };
    const updated = [newSession, ...pomodoroSessions];
    setPomodoroSessions(updated);
    StorageEngine.setData(user.id, 'pomodoro_sessions', updated);

    // If attached to a task, increment task actual_minutes
    if (taskId) {
      updateTask(taskId, {
        actual_minutes: (tasks.find((t) => t.id === taskId)?.actual_minutes || 0) + durationMinutes,
      });
    }

    sounds.playTimerDone();
    triggerMorPankhConfetti();
  };

  // 4. Live Reading & Topic Session Sync
  const startLiveReadingSession = (
    topic: string,
    type: ActivityType = 'reading',
    targetSeconds = 25 * 60,
    unitLabel = 'Pages Read',
    targetUnits = 20
  ) => {
    if (!user?.id) return;
    const session: LiveActivitySession = {
      id: `live_${Date.now()}`,
      user_id: user.id,
      topic,
      activity_type: type,
      status: 'active',
      started_at: new Date().toISOString(),
      elapsed_seconds: 0,
      target_seconds: targetSeconds,
      current_unit_label: unitLabel,
      current_units: 0,
      target_units: targetUnits,
      last_synced_at: new Date().toISOString(),
      source_device: 'mobile',
      heart_rate_simulated: 72,
    };
    saveLiveSessionState(session);
    sounds.playCompletionChime();
  };

  const updateLiveSession = (updates: Partial<LiveActivitySession>) => {
    if (!liveSession) return;
    const updated = {
      ...liveSession,
      ...updates,
      last_synced_at: new Date().toISOString(),
    };
    saveLiveSessionState(updated);
  };

  const togglePauseLiveSession = () => {
    if (!liveSession) return;
    const nextStatus = liveSession.status === 'active' ? 'paused' : 'active';
    updateLiveSession({ status: nextStatus });
    sounds.playTick();
  };

  const incrementLiveMilestone = (delta = 1) => {
    if (!liveSession) return;
    const newUnits = Math.max(0, (liveSession.current_units || 0) + delta);
    updateLiveSession({ current_units: newUnits });
    sounds.playTick();
  };

  const completeLiveSession = () => {
    if (!liveSession) return;
    const minutesTracked = Math.max(1, Math.round(liveSession.elapsed_seconds / 60));

    // Log as completed session
    logPomodoroSession(minutesTracked, 'work', undefined, `Completed topic session: ${liveSession.topic}`);

    // Auto-check corresponding reading habit if one exists
    const readingHabit = habits.find((h) =>
      h.title.toLowerCase().includes('read') || h.title.toLowerCase().includes('study')
    );
    if (readingHabit) {
      toggleHabitCompletion(readingHabit.id);
    }

    saveLiveSessionState({
      ...liveSession,
      status: 'completed',
    });

    sounds.playTimerDone();
    triggerMorPankhConfetti();
  };

  const resetLiveSession = () => {
    saveLiveSessionState(null);
  };

  // UPSC Daily Accountability Actions
  const updateDailyTask = useCallback(
    (date: string, taskKey: CoreTaskKey, updates: Partial<DailyTaskItem>) => {
      if (!user?.id) return;

      setUpscTasksMap((prev) => {
        const currentList = prev[date] ? [...prev[date]] : generateDailyTasksForDate(date, upscScheduleBlocks);
        const index = currentList.findIndex((t) => t.taskKey === taskKey);

        if (index === -1) return prev;

        const oldTask = currentList[index];
        const updatedTask: DailyTaskItem = {
          ...oldTask,
          ...updates,
        };

        // If status completed
        if (updates.status === 'completed' && oldTask.status !== 'completed') {
          updatedTask.completionPercentage = 100;
          if (!updatedTask.actualDurationMinutes || updatedTask.actualDurationMinutes === 0) {
            updatedTask.actualDurationMinutes = updatedTask.targetDurationMinutes;
          }
          sounds.playCompletionChime();
        }

        currentList[index] = updatedTask;
        const newMap = { ...prev, [date]: currentList };

        StorageEngine.setData(user.id, 'upsc_daily_tasks', newMap);

        // Check if all 8 tasks are completed
        const completedCount = currentList.filter((t) => t.status === 'completed').length;
        if (completedCount === 8) {
          triggerMorPankhConfetti();
        }

        return newMap;
      });
    },
    [user?.id, upscScheduleBlocks]
  );

  const updateTimeBlock = useCallback(
    (taskKey: CoreTaskKey, updates: Partial<DailyScheduleBlock>) => {
      if (!user?.id) return;

      setUpscScheduleBlocks((prev) => {
        const updated = prev.map((b) => (b.taskKey === taskKey ? { ...b, ...updates } : b));
        StorageEngine.setData(user.id, 'upsc_schedule_blocks', updated);
        return updated;
      });
    },
    [user?.id]
  );

  const saveDailyReview = useCallback(
    (date: string, review: ReviewDetails) => {
      if (!user?.id) return;

      setUpscReviewsMap((prev) => {
        const newMap = { ...prev, [date]: review };
        StorageEngine.setData(user.id, 'upsc_daily_reviews', newMap);
        return newMap;
      });

      // Automatically complete the review task on that day
      updateDailyTask(date, 'review', {
        status: 'completed',
        completionPercentage: 100,
        actualDurationMinutes: review.minutesSpent || 30,
        reviewDetails: review,
      });

      sounds.playCompletionChime();
      triggerMorPankhConfetti();
    },
    [user?.id, updateDailyTask]
  );

  const getTodaySummary = useCallback(
    (date?: string): TodaySummaryReport => {
      const targetDate = date || selectedTrackerDate;
      const tasks = upscTasksMap[targetDate] || generateDailyTasksForDate(targetDate, upscScheduleBlocks);
      const review = upscReviewsMap[targetDate];
      const streaks = calculateTaskStreaks(upscTasksMap);
      return calculateTodaySummary(tasks, review, streaks.overall, 86);
    },
    [selectedTrackerDate, upscTasksMap, upscReviewsMap, upscScheduleBlocks]
  );

  const getWeeklyDashboardData = useCallback(
    (refDate?: string): WeeklyDashboardData => {
      return calculateWeeklyDashboard(upscTasksMap, refDate ? new Date(refDate) : new Date());
    },
    [upscTasksMap]
  );

  const getMonthlyDashboardData = useCallback(
    (refDate?: string): MonthlyDashboardData => {
      return calculateMonthlyDashboard(upscTasksMap, refDate ? new Date(refDate) : new Date());
    },
    [upscTasksMap]
  );

  const getTaskStreaks = useCallback(() => {
    return calculateTaskStreaks(upscTasksMap);
  }, [upscTasksMap]);

  // Analytics Computation
  const analyticsSummary = useMemo(
    () =>
      user?.id
        ? StorageEngine.getAnalyticsSummary(user.id, habits, habitLogs, tasks, pomodoroSessions)
        : StorageEngine.getAnalyticsSummary('', [], [], [], []),
    [user?.id, habits, habitLogs, tasks, pomodoroSessions]
  );

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        categories,
        habits,
        habitLogs,
        tasks,
        pomodoroSessions,
        liveSession,
        upscTasksMap,
        upscReviewsMap,
        upscScheduleBlocks,
        selectedTrackerDate,
        setSelectedTrackerDate,
        updateDailyTask,
        updateTimeBlock,
        saveDailyReview,
        getTodaySummary,
        getWeeklyDashboardData,
        getMonthlyDashboardData,
        getTaskStreaks,
        toggleHabitCompletion,
        addHabit,
        updateHabit,
        deleteHabit,
        getHabitStats,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        logPomodoroSession,
        startLiveReadingSession,
        updateLiveSession,
        togglePauseLiveSession,
        incrementLiveMilestone,
        completeLiveSession,
        resetLiveSession,
        analyticsSummary,
        refreshData: loadUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
