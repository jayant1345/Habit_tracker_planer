# 🦚 MorPankh Activity, Habit Tracker & Smartwatch Companion

A multi-user, responsive Activity & Habit/To-Do Progress Tracker web application styled with an elegant **Mor Pankh (Deep Peacock Teal & Royal Blue)** and **Swarna (Rich Golden)** palette. Designed for high-concurrency, mobile PWA installation, live Mobile-to-Smartwatch companion tracking, and instant deployment on **Railway.app**.

---

## ✨ Key Features

### 1. 🦚 Mor Pankh & Golden Luxury Aesthetic
- Deep Peacock Teal (`#0b3340`, `#147694`), Feather Emerald (`#17b890`), and Royal Indigo (`#5368e5`) paired with shimmering Metallic Gold (`#d4af37`, `#f4a313`).
- Fully responsive dark & light modes with glowing gold borders and glassmorphism.

### 2. ⌚ Live Mobile & Smartwatch Companion Sync
- **Topic & Book Reading Sprints**: Launch reading sessions (e.g. *Designing Data-Intensive Applications*, *Atomic Habits*) on mobile.
- **Smartwatch View (`/watch` or Companion Tab)**: Interactive Wear OS / Apple Watch round & squircle dial syncing elapsed stopwatch time, +1/-1 pages read, heart rate simulation (68-78 bpm), and pause/resume in real-time over WebSocket/BroadcastChannel.
- **Automated Habit Completion**: Finishing a reading session automatically updates your reading streak and logs productive minutes to your dashboard!

### 3. 👥 Multi-User Strict Data Isolation & Concurrency
- Instant switching between pre-seeded demo user profiles:
  - **Arjun Sharma** (Tech Lead / Architect - System Design & Engineering habits)
  - **Priya Nair** (Design Lead - UI/UX systems & mindfulness habits)
  - **Vikram Patel** (Founder & Endurance Athlete - Marathon training)
- Strict Foreign-Key sandboxing: Every entity (`habits`, `habit_logs`, `tasks`, `subtasks`, `pomodoro_sessions`) is scoped by `user_id`.
- Complete Supabase PostgreSQL migration file (`supabase_schema.sql`) with composite indices and Row-Level Security (`auth.uid() = user_id`) policies.

### 4. 📈 Rich Momentum & Personal Analytics Dashboard
- 4 Key Top KPI Cards (Habit Completion %, Active vs Done Tasks, Longest Streak, Today's Productive Minutes).
- **7-Day Completion Velocity Chart** comparing daily habits vs tasks completed.
- **Category Focus Allocation Donut Chart**.
- **45-Day Consistency Heatmap** (GitHub contribution style) with interactive hover levels.

### 5. 📋 Activity Pipeline (Kanban, Checklist & Calendar)
- **Kanban Board**: Drag-and-drop / single-click column transitions (To-Do, In Progress, Done).
- **Subtask Checklists**: Real-time auto-calculated completion percentage.
- **Calendar View**: Monthly deadline tracker.

### 6. 📱 Progressive Web App (PWA) Mobile Ready
- Web App Manifest (`/manifest.json`), service worker cache (`/sw.js`), standalone mobile display, app icons, and in-app iOS / Android installation guides.

---

## 🚀 How to Deploy on Railway.app

### Option A: Deploy via GitHub (Recommended)
1. Push this repository to GitHub.
2. Go to [Railway.app](https://railway.app) and click **New Project** → **Deploy from GitHub repo**.
3. Select your repository. Railway will automatically detect the `Dockerfile` and `railway.json`.
4. Add environment variables in Railway dashboard:
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_SUPABASE_URL` *(Optional: if connecting live Supabase)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(Optional)*
5. Railway will build the standalone multi-stage container and pass the `/api/health` liveness probe.

### Option B: Deploy via Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 📱 How to Install as a Mobile App (PWA)

### Android (Google Chrome)
1. Open your deployed URL on Chrome for Android.
2. Tap the **"Install Now (PWA)"** banner or tap the Chrome three dots menu `⋮` → **Add to Home Screen** / **Install App**.

### iOS (Apple Safari)
1. Open your deployed URL in Safari on iPhone / iPad.
2. Tap the **Share** button (box with upward arrow) at the bottom.
3. Tap **Add to Home Screen**, then tap **Add**.

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build standalone production image
npm run build

# Start production server
npm run start
```

---

## 🗄️ Database & Supabase PostgreSQL Migration

The complete SQL schema is located in `supabase_schema.sql`.

To run on Supabase:
1. Open your Supabase Project Dashboard → **SQL Editor**.
2. Paste the contents of `supabase_schema.sql` and click **Run**.
3. Row-Level Security (RLS) is automatically enabled on all 7 tables with strict user boundaries.
