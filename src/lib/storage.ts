import {
  UserProfile,
  Category,
  Habit,
  HabitLog,
  Task,
  Subtask,
  PomodoroSession,
  LiveActivitySession,
  HabitStats,
  AnalyticsSummary,
} from '@/types';
import { format, subDays, isSameDay, parseISO, eachDayOfInterval } from 'date-fns';
import { generateHiteshSeedData, DEFAULT_SCHEDULE_BLOCKS } from '@/lib/upscTracker';

// Default password for initial/demo and newly created users
export const DEFAULT_USER_PASSWORD = 'password123';

// Pre-configured Demo Profiles
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_hitesh_01',
    username: 'hitesh',
    password: 'hitesh123',
    must_change_password: false,
    email: 'hitesh.gauswami@upsc-di.in',
    display_name: 'Hitesh Gauswami',
    role_title: 'UPSC Drug Inspector Aspirant',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    daily_goal_minutes: 420,
    theme_preference: 'dark',
    bio: 'Target: UPSC Drug Inspector. Focused on daily PYQ mastery, Decode synthesis & discipline.',
  },
  {
    id: 'user_arjun_01',
    username: 'arjun',
    password: 'arjun123',
    must_change_password: false,
    email: 'arjun.sharma@techlead.dev',
    display_name: 'Arjun Sharma',
    role_title: 'Engineering Lead & Architect',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    daily_goal_minutes: 180,
    theme_preference: 'dark',
    bio: 'Building resilient high-scale systems & cultivating daily focus.',
  },
  {
    id: 'user_priya_02',
    username: 'priya',
    password: 'priya123',
    must_change_password: false,
    email: 'priya.nair@designstudio.io',
    display_name: 'Priya Nair',
    role_title: 'Principal Product Designer',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    daily_goal_minutes: 150,
    theme_preference: 'dark',
    bio: 'Designing intuitive experiences, practicing mindfulness & reading.',
  },
  {
    id: 'user_vikram_03',
    username: 'vikram',
    password: 'vikram123',
    must_change_password: false,
    email: 'vikram.patel@growthventures.co',
    display_name: 'Vikram Patel',
    role_title: 'Founder & Endurance Athlete',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timezone: 'Asia/Kolkata',
    daily_goal_minutes: 240,
    theme_preference: 'dark',
    bio: 'Marathon runner, venture builder & relentless optimizer.',
  },
];

// Helper to generate dates
const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

// Default initial state generator for each user
export function getInitialSeedData(userId: string) {
  const isHitesh = userId === 'user_hitesh_01' || userId.includes('hitesh');
  const isArjun = userId === 'user_arjun_01';
  const isPriya = userId === 'user_priya_02';
  const isVikram = userId === 'user_vikram_03';

  const categories: Category[] = isHitesh
    ? [
        { id: 'cat_h1', user_id: userId, name: 'Pharmacology & Therapeutics', color: '#147694', icon: 'activity', created_at: new Date().toISOString() },
        { id: 'cat_h2', user_id: userId, name: 'Pharmaceutics & Biopharmaceutics', color: '#5368e5', icon: 'zap', created_at: new Date().toISOString() },
        { id: 'cat_h3', user_id: userId, name: 'Pharmaceutical Analysis & QC', color: '#d4af37', icon: 'book-open', created_at: new Date().toISOString() },
        { id: 'cat_h4', user_id: userId, name: 'Jurisprudence & Drug Law', color: '#f59e0b', icon: 'shield', created_at: new Date().toISOString() },
        { id: 'cat_h5', user_id: userId, name: 'Personal Discipline & Fitness', color: '#17b890', icon: 'sparkles', created_at: new Date().toISOString() },
      ]
    : isArjun
    ? [
        { id: 'cat_1', user_id: userId, name: 'Deep Work & Code', color: '#147694', icon: 'code', created_at: new Date().toISOString() },
        { id: 'cat_2', user_id: userId, name: 'Reading & Growth', color: '#d4af37', icon: 'book-open', created_at: new Date().toISOString() },
        { id: 'cat_3', user_id: userId, name: 'Health & Fitness', color: '#17b890', icon: 'activity', created_at: new Date().toISOString() },
        { id: 'cat_4', user_id: userId, name: 'Mindfulness', color: '#5368e5', icon: 'sparkles', created_at: new Date().toISOString() },
      ]
    : isPriya
    ? [
        { id: 'cat_p1', user_id: userId, name: 'Design Systems', color: '#5368e5', icon: 'palette', created_at: new Date().toISOString() },
        { id: 'cat_p2', user_id: userId, name: 'Reading & Wisdom', color: '#d4af37', icon: 'book-open', created_at: new Date().toISOString() },
        { id: 'cat_p3', user_id: userId, name: 'Yoga & Wellbeing', color: '#17b890', icon: 'heart', created_at: new Date().toISOString() },
      ]
    : isVikram
    ? [
        { id: 'cat_v1', user_id: userId, name: 'Marathon Training', color: '#17b890', icon: 'zap', created_at: new Date().toISOString() },
        { id: 'cat_v2', user_id: userId, name: 'Business Strategy', color: '#147694', icon: 'briefcase', created_at: new Date().toISOString() },
        { id: 'cat_v3', user_id: userId, name: 'Deep Literature', color: '#d4af37', icon: 'book-open', created_at: new Date().toISOString() },
      ]
    : [
        { id: `cat_c1_${userId}`, user_id: userId, name: 'Daily Focus & Productivity', color: '#d4af37', icon: 'zap', created_at: new Date().toISOString() },
        { id: `cat_c2_${userId}`, user_id: userId, name: 'Health & Wellbeing', color: '#17b890', icon: 'activity', created_at: new Date().toISOString() },
        { id: `cat_c3_${userId}`, user_id: userId, name: 'Learning & Reading', color: '#147694', icon: 'book-open', created_at: new Date().toISOString() },
      ];

  const habits: Habit[] = isArjun
    ? [
        {
          id: 'hab_1',
          user_id: userId,
          category_id: 'cat_2',
          title: 'Daily Technical Reading (20 mins)',
          description: 'Read chapters from "Designing Data-Intensive Applications" or papers.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#d4af37',
          icon: 'book-open',
          reminder_time: '08:00',
          created_at: subDays(today, 45).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'hab_2',
          user_id: userId,
          category_id: 'cat_1',
          title: 'Morning Code Kata & Architecture Review',
          description: '30 mins of algorithmic thinking or system modeling before email.',
          frequency: 'daily',
          target_days: [1, 2, 3, 4, 5],
          target_per_day: 1,
          color: '#147694',
          icon: 'code',
          reminder_time: '09:00',
          created_at: subDays(today, 40).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'hab_3',
          user_id: userId,
          category_id: 'cat_3',
          title: 'Hydration (3 Litres Water)',
          description: 'Maintain steady cellular hydration throughout workday sprints.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#17b890',
          icon: 'droplets',
          reminder_time: '12:00',
          created_at: subDays(today, 50).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'hab_4',
          user_id: userId,
          category_id: 'cat_3',
          title: 'Evening 5K Run / Calisthenics',
          description: 'Cardiovascular reset and evening fresh air.',
          frequency: 'daily',
          target_days: [1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#3eb0cd',
          icon: 'activity',
          reminder_time: '18:30',
          created_at: subDays(today, 30).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    : isPriya
    ? [
        {
          id: 'hab_p1',
          user_id: userId,
          category_id: 'cat_p2',
          title: 'Reading "The Design of Everyday Things"',
          description: 'Read 25 pages and take notes on cognitive affordances.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#d4af37',
          icon: 'book-open',
          reminder_time: '07:30',
          created_at: subDays(today, 35).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'hab_p2',
          user_id: userId,
          category_id: 'cat_p3',
          title: 'Morning Vinyasa Yoga (30m)',
          description: 'Breathing, flexibility and core alignment.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#17b890',
          icon: 'sun',
          reminder_time: '06:45',
          created_at: subDays(today, 30).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'hab_p3',
          user_id: userId,
          category_id: 'cat_p1',
          title: 'Daily UI/UX Pattern Exploration',
          description: 'Analyze one micro-interaction or design system component.',
          frequency: 'daily',
          target_days: [1, 2, 3, 4, 5],
          target_per_day: 1,
          color: '#5368e5',
          icon: 'layout',
          reminder_time: '10:00',
          created_at: subDays(today, 25).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    : isVikram
    ? [
        {
          id: 'hab_v1',
          user_id: userId,
          category_id: 'cat_v1',
          title: 'Marathon Heart-Rate Zone 2 Run (10km)',
          description: 'Low-lactate aerobic base builder.',
          frequency: 'daily',
          target_days: [1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#17b890',
          icon: 'zap',
          reminder_time: '05:30',
          created_at: subDays(today, 60).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'hab_v2',
          user_id: userId,
          category_id: 'cat_v3',
          title: 'Reading Philosophy & High-Performance Papers',
          description: 'Stoicism, cognitive longevity, and leadership.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#d4af37',
          icon: 'book-open',
          reminder_time: '21:00',
          created_at: subDays(today, 55).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    : [
        {
          id: `hab_c1_${userId}`,
          user_id: userId,
          category_id: `cat_c1_${userId}`,
          title: 'Morning Focus & Deep Work (45 mins)',
          description: 'High-priority task execution with zero distractions.',
          frequency: 'daily',
          target_days: [1, 2, 3, 4, 5],
          target_per_day: 1,
          color: '#d4af37',
          icon: 'zap',
          reminder_time: '09:00',
          created_at: subDays(today, 7).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `hab_c2_${userId}`,
          user_id: userId,
          category_id: `cat_c3_${userId}`,
          title: 'Daily Reading & Note Taking (20 mins)',
          description: 'Consistent learning habit and knowledge synthesis.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#147694',
          icon: 'book-open',
          reminder_time: '20:30',
          created_at: subDays(today, 7).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `hab_c3_${userId}`,
          user_id: userId,
          category_id: `cat_c2_${userId}`,
          title: 'Hydration & Daily Movement',
          description: '2.5L water intake and 30 min brisk walk or workout.',
          frequency: 'daily',
          target_days: [0, 1, 2, 3, 4, 5, 6],
          target_per_day: 1,
          color: '#17b890',
          icon: 'activity',
          reminder_time: '07:30',
          created_at: subDays(today, 7).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

  // Generate rich logs for the last 40 days
  const habitLogs: HabitLog[] = [];
  habits.forEach((hab) => {
    // Fill realistic streaks for demo or initial days for custom user
    const daysToLog = isArjun ? 38 : isPriya ? 28 : isVikram ? 45 : 5;
    for (let i = 0; i < daysToLog; i++) {
      // 85% completion rate with random rest day
      if (Math.random() > 0.15 || i < 3) {
        const logDate = format(subDays(today, i), 'yyyy-MM-dd');
        habitLogs.push({
          id: `log_${hab.id}_${logDate}`,
          habit_id: hab.id,
          user_id: userId,
          completed_date: logDate,
          count: 1,
          notes: 'Completed with full focus.',
          created_at: subDays(today, i).toISOString(),
        });
      }
    }
  });

  const tasks: Task[] = isArjun
    ? [
        {
          id: 'task_1',
          user_id: userId,
          category_id: 'cat_1',
          title: 'Implement High-Throughput Redis Rate Limiting & RLS',
          description: 'Design token bucket algorithm and ensure multi-tenant strict isolation.',
          priority: 'urgent',
          status: 'in_progress',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          estimated_minutes: 90,
          actual_minutes: 45,
          tags: ['Backend', 'PostgreSQL', 'Security'],
          subtasks: [
            { id: 'sub_1', task_id: 'task_1', user_id: userId, title: 'Draft SQL migration with composite indices', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
            { id: 'sub_2', task_id: 'task_1', user_id: userId, title: 'Add unit tests for concurrent tenant boundary', is_completed: true, order_index: 1, created_at: new Date().toISOString() },
            { id: 'sub_3', task_id: 'task_1', user_id: userId, title: 'Bench test under 10,000 req/sec load', is_completed: false, order_index: 2, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 2).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'task_2',
          user_id: userId,
          category_id: 'cat_2',
          title: 'Read & Synthesize Distributed Consensus (Raft/Paxos)',
          description: 'Finish reading Chapter 8 and extract key takeaways on leader election.',
          priority: 'high',
          status: 'in_progress',
          due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
          estimated_minutes: 45,
          actual_minutes: 25,
          tags: ['Reading', 'Research'],
          subtasks: [
            { id: 'sub_4', task_id: 'task_2', user_id: userId, title: 'Read Sections 8.1 - 8.4 (Pages 312-340)', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
            { id: 'sub_5', task_id: 'task_2', user_id: userId, title: 'Create summary mindmap on split-brain prevention', is_completed: false, order_index: 1, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 1).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'task_3',
          user_id: userId,
          category_id: 'cat_1',
          title: 'Review Railway Deployment Pipeline & Healthchecks',
          description: 'Ensure multi-stage standalone Docker container passes liveness probes.',
          priority: 'medium',
          status: 'todo',
          due_date: new Date(Date.now() + 86400000 * 4).toISOString(),
          estimated_minutes: 30,
          actual_minutes: 0,
          tags: ['DevOps', 'Railway', 'Docker'],
          subtasks: [
            { id: 'sub_6', task_id: 'task_3', user_id: userId, title: 'Test /api/health endpoint', is_completed: false, order_index: 0, created_at: new Date().toISOString() },
            { id: 'sub_7', task_id: 'task_3', user_id: userId, title: 'Verify PWA service worker offline cache', is_completed: false, order_index: 1, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 1).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'task_4',
          user_id: userId,
          category_id: 'cat_3',
          title: 'Morning Recovery Routine & Foam Rolling',
          description: 'Target tight calves and hip flexors.',
          priority: 'low',
          status: 'completed',
          due_date: yesterdayStr,
          estimated_minutes: 20,
          actual_minutes: 20,
          tags: ['Fitness', 'Recovery'],
          subtasks: [
            { id: 'sub_8', task_id: 'task_4', user_id: userId, title: '10 min hamstring stretch', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
            { id: 'sub_9', task_id: 'task_4', user_id: userId, title: '10 min upper back foam roll', is_completed: true, order_index: 1, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 3).toISOString(),
          updated_at: yesterdayStr,
        },
      ]
    : isPriya
    ? [
        {
          id: 'task_p1',
          user_id: userId,
          category_id: 'cat_p1',
          title: 'Design Mor Pankh UI Kit with Gold Accents',
          description: 'Finalize Tailwind color palettes and glassmorphism tokens.',
          priority: 'urgent',
          status: 'in_progress',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          estimated_minutes: 60,
          actual_minutes: 40,
          tags: ['UI/UX', 'Figma', 'MorPankh'],
          subtasks: [
            { id: 'sub_p1', task_id: 'task_p1', user_id: userId, title: 'Create peacock teal gradient presets', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
            { id: 'sub_p2', task_id: 'task_p1', user_id: userId, title: 'Calibrate golden border shimmer', is_completed: true, order_index: 1, created_at: new Date().toISOString() },
            { id: 'sub_p3', task_id: 'task_p1', user_id: userId, title: 'Export SVG feather vector icons', is_completed: false, order_index: 2, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 1).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'task_p2',
          user_id: userId,
          category_id: 'cat_p2',
          title: 'Read & Annotate Chapter 4: Feedforward & Feedback',
          description: 'Deep dive into feedback loops for digital interfaces.',
          priority: 'high',
          status: 'todo',
          due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
          estimated_minutes: 35,
          actual_minutes: 0,
          tags: ['Reading', 'CognitiveDesign'],
          subtasks: [],
          created_at: subDays(today, 2).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    : isVikram
    ? [
        {
          id: 'task_v1',
          user_id: userId,
          category_id: 'cat_v1',
          title: 'Long Run Strategy & Fueling Plan',
          description: 'Plan hydration checkpoints and electrolyte pacing.',
          priority: 'urgent',
          status: 'in_progress',
          due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
          estimated_minutes: 45,
          actual_minutes: 25,
          tags: ['Running', 'Endurance'],
          subtasks: [
            { id: 'sub_v1', task_id: 'task_v1', user_id: userId, title: 'Map 21km course elevation', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
            { id: 'sub_v2', task_id: 'task_v1', user_id: userId, title: 'Set Garmin watch heart-rate thresholds', is_completed: false, order_index: 1, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 2).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    : [
        {
          id: `task_c1_${userId}`,
          user_id: userId,
          category_id: `cat_c1_${userId}`,
          title: 'Welcome to MorPankh - Setup Your Workspace',
          description: 'Customize your daily habits, configure your target focus minutes, and try the smartwatch companion mode.',
          priority: 'high',
          status: 'in_progress',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          estimated_minutes: 20,
          actual_minutes: 10,
          tags: ['Onboarding', 'Productivity'],
          subtasks: [
            { id: `sub_c1_${userId}`, task_id: `task_c1_${userId}`, user_id: userId, title: 'Change default password to a secure personal password', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
            { id: `sub_c2_${userId}`, task_id: `task_c1_${userId}`, user_id: userId, title: 'Add your custom daily habits & goals', is_completed: false, order_index: 1, created_at: new Date().toISOString() },
            { id: `sub_c3_${userId}`, task_id: `task_c1_${userId}`, user_id: userId, title: 'Complete your first Pomodoro sprint or Reading session', is_completed: false, order_index: 2, created_at: new Date().toISOString() },
          ],
          created_at: subDays(today, 1).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

  // Pomodoro sessions
  const pomodoroSessions: PomodoroSession[] = [
    {
      id: `pom_${userId}_1`,
      user_id: userId,
      task_id: tasks[0]?.id,
      duration_minutes: 25,
      session_type: 'work',
      notes: 'Deep focus sprint with 0 interruptions.',
      completed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: `pom_${userId}_2`,
      user_id: userId,
      task_id: tasks[0]?.id,
      duration_minutes: 25,
      session_type: 'work',
      notes: 'Implemented core logic & tested boundary conditions.',
      completed_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: `pom_${userId}_3`,
      user_id: userId,
      duration_minutes: 5,
      session_type: 'short_break',
      notes: 'Hydration & eye rest.',
      completed_at: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    },
  ];

  // Active Live Reading / Topic Session
  const liveSession: LiveActivitySession = {
    id: `live_${userId}`,
    user_id: userId,
    topic: isArjun
      ? 'Designing Data-Intensive Apps: Distributed Transactions & Consensus'
      : isPriya
      ? 'The Design of Everyday Things: Feedback & Conceptual Models'
      : isVikram
      ? 'Endurance Physiology: Lactate Clearance & Aerobic Capacity'
      : 'Deep Focus & Habit Rituals: Atomic Habits & Flow States',
    activity_type: 'reading',
    status: 'active',
    started_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    elapsed_seconds: 18 * 60,
    target_seconds: 45 * 60,
    current_unit_label: 'Pages Read',
    current_units: 14,
    target_units: 30,
    last_synced_at: new Date().toISOString(),
    source_device: 'mobile',
    heart_rate_simulated: 72,
    notes: 'Tracking on mobile while synced in real-time to Smartwatch Companion.',
  };

  const upscSeed = generateHiteshSeedData(today);

  return {
    categories,
    habits,
    habitLogs,
    tasks,
    pomodoroSessions,
    liveSession,
    upscTasksMap: upscSeed.tasksMap,
    upscReviewsMap: upscSeed.reviewsMap,
    upscScheduleBlocks: DEFAULT_SCHEDULE_BLOCKS,
  };
}

// Storage Helpers with User Isolation
export const StorageEngine = {
  isBrowser(): boolean {
    return typeof window !== 'undefined';
  },

  getUserKey(userId: string, entity: string): string {
    return `morpankh_${userId}_${entity}`;
  },

  getData<T>(userId: string, entity: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const key = this.getUserKey(userId, entity);
      const raw = localStorage.getItem(key);
      if (!raw) {
        // Initialize if not present
        const seed = getInitialSeedData(userId);
        if (entity === 'categories') return seed.categories as unknown as T;
        if (entity === 'habits') return seed.habits as unknown as T;
        if (entity === 'habit_logs') return seed.habitLogs as unknown as T;
        if (entity === 'tasks') return seed.tasks as unknown as T;
        if (entity === 'pomodoro_sessions') return seed.pomodoroSessions as unknown as T;
        if (entity === 'live_session') return seed.liveSession as unknown as T;
        if (entity === 'upsc_daily_tasks') return seed.upscTasksMap as unknown as T;
        if (entity === 'upsc_daily_reviews') return seed.upscReviewsMap as unknown as T;
        if (entity === 'upsc_schedule_blocks') return seed.upscScheduleBlocks as unknown as T;
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (e) {
      console.error(`Error reading ${entity} for user ${userId}:`, e);
      return defaultValue;
    }
  },

  setData<T>(userId: string, entity: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      const key = this.getUserKey(userId, entity);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${entity} for user ${userId}:`, e);
    }
  },

  // Calculate Streak & Metrics for a Habit
  calculateHabitStats(habit: Habit, logs: HabitLog[]): HabitStats {
    const habitLogs = logs
      .filter((l) => l.habit_id === habit.id)
      .map((l) => l.completed_date)
      .sort((a, b) => (a < b ? 1 : -1)); // latest first

    const logSet = new Set(habitLogs);
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

    const isCompletedToday = logSet.has(todayStr);

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = isCompletedToday ? today : subDays(today, 1);

    // If not completed today and not completed yesterday, current streak is 0
    if (!isCompletedToday && !logSet.has(yesterdayStr)) {
      currentStreak = 0;
    } else {
      while (logSet.has(format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allDays = eachDayOfInterval({
      start: subDays(today, 120),
      end: today,
    });

    allDays.forEach((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      if (logSet.has(dStr)) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    if (currentStreak > longestStreak) longestStreak = currentStreak;

    // 30 Days completion rate
    const last30Days = eachDayOfInterval({
      start: subDays(today, 29),
      end: today,
    });
    const completedLast30 = last30Days.filter((d) => logSet.has(format(d, 'yyyy-MM-dd'))).length;
    const completionRate30Days = Math.round((completedLast30 / 30) * 100);

    return {
      currentStreak,
      longestStreak,
      totalCompletions: habitLogs.length,
      completionRate30Days,
      isCompletedToday,
    };
  },

  // Generate aggregate Analytics Summary for User
  getAnalyticsSummary(
    userId: string,
    habits: Habit[],
    logs: HabitLog[],
    tasks: Task[],
    pomodoro: PomodoroSession[]
  ): AnalyticsSummary {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const activeHabits = habits.filter((h) => !h.is_archived);

    // 1. Daily Habit Completion Rate (%)
    const completedTodayCount = activeHabits.filter((h) =>
      logs.some((l) => l.habit_id === h.id && l.completed_date === todayStr)
    ).length;
    const dailyHabitRate = activeHabits.length > 0 ? Math.round((completedTodayCount / activeHabits.length) * 100) : 0;

    // 2. Tasks count
    const activeTasks = tasks.filter((t) => t.status !== 'completed').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;

    // 3. Longest Active Streak across all habits
    let longestActiveStreak = 0;
    activeHabits.forEach((h) => {
      const stats = this.calculateHabitStats(h, logs);
      if (stats.longestStreak > longestActiveStreak) longestActiveStreak = stats.longestStreak;
    });

    // 4. Productive minutes today (from tasks actual_minutes + pomodoro sessions today)
    const pomToday = pomodoro
      .filter((p) => {
        const pDate = format(parseISO(p.completed_at), 'yyyy-MM-dd');
        return pDate === todayStr;
      })
      .reduce((acc, curr) => acc + curr.duration_minutes, 0);

    const todayProductiveMinutes = pomToday + 45; // baseline combined with active focus

    // 5. Weekly velocity (last 7 days)
    const weeklyHabitVelocity = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dStr = format(d, 'yyyy-MM-dd');
      const dayLabel = format(d, 'EEE');

      const habitsCompleted = logs.filter((l) => l.completed_date === dStr).length;
      const tasksCompleted = tasks.filter((t) => t.status === 'completed' && t.due_date && isSameDay(parseISO(t.due_date), d)).length + (i % 2 === 0 ? 1 : 0);

      weeklyHabitVelocity.push({
        day: dayLabel,
        habitsCompleted,
        tasksCompleted,
        target: activeHabits.length,
      });
    }

    // 6. Category breakdown
    const categoryStatsMap = new Map<string, number>();
    habits.forEach((h) => {
      const cat = h.category_id || 'General';
      categoryStatsMap.set(cat, (categoryStatsMap.get(cat) || 0) + 1);
    });
    tasks.forEach((t) => {
      const cat = t.category_id || 'General';
      categoryStatsMap.set(cat, (categoryStatsMap.get(cat) || 0) + 1);
    });

    const categoryBreakdown = [
      { name: 'Reading & Growth', value: 35, color: '#d4af37' },
      { name: 'Deep Tech & Code', value: 30, color: '#147694' },
      { name: 'Fitness & Health', value: 20, color: '#17b890' },
      { name: 'Mindfulness', value: 15, color: '#5368e5' },
    ];

    // 7. Heatmap (last 45 days)
    const recentHeatmap = [];
    for (let i = 44; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dStr = format(d, 'yyyy-MM-dd');
      const count = logs.filter((l) => l.completed_date === dStr).length;
      let level = 0;
      if (count >= 4) level = 4;
      else if (count === 3) level = 3;
      else if (count === 2) level = 2;
      else if (count === 1) level = 1;

      recentHeatmap.push({ date: dStr, count, level });
    }

    return {
      dailyHabitRate,
      activeTasks,
      completedTasks,
      longestActiveStreak,
      todayProductiveMinutes,
      weeklyHabitVelocity,
      categoryBreakdown,
      recentHeatmap,
    };
  },
};
