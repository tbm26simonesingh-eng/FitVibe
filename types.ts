export interface User {
  id: string;
  name: string;
  email: string;
  total_points: number;
  joined_at: string;
}

export type ActivityType = 'STEPS' | 'RUNNING' | 'CYCLING' | 'GYM' | 'MEDITATION' | 'SWIMMING';

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  value: number; // steps count or duration in minutes
  points_earned: number;
  date: string; // ISO date string
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  vendor: 'Amazon' | 'Flipkart' | 'Swiggy' | 'Zomato' | 'Uber' | 'Nike';
  points_required: number;
  value_display: string; // e.g., "$10" or "₹500"
  image_url: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  reward_snapshot: Reward; // Snapshot in case reward changes
  redeemed_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}