# FitVibe Rewards 🏃‍♂️🎁

FitVibe is a gamified health and fitness activity tracker that rewards users for their physical efforts. Users can log activities like walking, running, and workouts to earn points, which can then be redeemed for real-world vouchers from top brands.

## 🚀 Features

- **Activity Tracking**: Log Steps, Running, Cycling, Gym, Meditation, and Swimming.
- **Points System**: Automatic conversion of effort into points (e.g., 1000 steps = 10 points).
- **Rewards Marketplace**: Redeem points for vouchers (Amazon, Uber, Swiggy, etc.).
- **Dashboard**: Visual analytics of your activity history and point balance.
- **Authentication**: User accounts to save progress.

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Recharts
- **Database**: Supabase (PostgreSQL) or LocalStorage (Demo Mode)
- **Deployment**: Vibe / Netlify / Vercel

## 📂 Database Schema (Supabase)

To connect this app to Supabase, run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Syncs with Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  total_points integer default 0,
  joined_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Activities Table
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  type text not null, -- 'STEPS', 'RUNNING', etc.
  value integer not null, -- count or duration
  points_earned integer not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Rewards Table (Pre-populate this)
create table public.rewards (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  vendor text not null,
  points_required integer not null,
  value_display text not null,
  image_url text
);

-- 4. Redemptions Table
create table public.redemptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  reward_id uuid references public.rewards(id),
  redeemed_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.activities enable row level security;
alter table public.redemptions enable row level security;

-- Policies (Simple example)
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can view own activities" on public.activities for select using (auth.uid() = user_id);
create policy "Users can insert own activities" on public.activities for insert with check (auth.uid() = user_id);
create policy "Users can delete own activities" on public.activities for delete using (auth.uid() = user_id);
```

## 📦 Scripts

- `npm install`: Install dependencies
- `npm run dev`: Start development server
- `npm run build`: Build for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
