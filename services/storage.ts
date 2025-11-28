import { User, Activity, Redemption, Reward } from '../types';
import { INITIAL_REWARDS } from '../constants';

// Keys
const USERS_KEY = 'fitvibe_users';
const ACTIVITIES_KEY = 'fitvibe_activities';
const REDEMPTIONS_KEY = 'fitvibe_redemptions';
const CURRENT_USER_ID_KEY = 'fitvibe_current_user';

// Helpers
const getStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const MockDB = {
  // Auth
  login: async (email: string): Promise<User | null> => {
    await new Promise(r => setTimeout(r, 500)); // Simulate latency
    const users = getStorage<User[]>(USERS_KEY, []);
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
      return user;
    }
    return null;
  },

  signup: async (name: string, email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const users = getStorage<User[]>(USERS_KEY, []);
    if (users.find(u => u.email === email)) throw new Error('User already exists');
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      total_points: 0,
      joined_at: new Date().toISOString()
    };
    
    users.push(newUser);
    setStorage(USERS_KEY, users);
    localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id);
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const id = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!id) return null;
    const users = getStorage<User[]>(USERS_KEY, []);
    return users.find(u => u.id === id) || null;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  },

  // Activities
  getActivities: async (userId: string): Promise<Activity[]> => {
    const all = getStorage<Activity[]>(ACTIVITIES_KEY, []);
    return all.filter(a => a.user_id === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addActivity: async (activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> => {
    const all = getStorage<Activity[]>(ACTIVITIES_KEY, []);
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    all.push(newActivity);
    setStorage(ACTIVITIES_KEY, all);

    // Update User Points
    const users = getStorage<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.id === activity.user_id);
    if (userIndex >= 0) {
      users[userIndex].total_points += activity.points_earned;
      setStorage(USERS_KEY, users);
    }

    return newActivity;
  },

  deleteActivity: async (activityId: string): Promise<void> => {
    let all = getStorage<Activity[]>(ACTIVITIES_KEY, []);
    const activity = all.find(a => a.id === activityId);
    if (!activity) return;

    all = all.filter(a => a.id !== activityId);
    setStorage(ACTIVITIES_KEY, all);

    // Deduct points
    const users = getStorage<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.id === activity.user_id);
    if (userIndex >= 0) {
      users[userIndex].total_points = Math.max(0, users[userIndex].total_points - activity.points_earned);
      setStorage(USERS_KEY, users);
    }
  },

  // Rewards
  getRewards: async (): Promise<Reward[]> => {
    return INITIAL_REWARDS;
  },

  redeemReward: async (userId: string, reward: Reward): Promise<Redemption> => {
    const users = getStorage<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) throw new Error("User not found");
    if (users[userIndex].total_points < reward.points_required) throw new Error("Insufficient points");

    // Deduct
    users[userIndex].total_points -= reward.points_required;
    setStorage(USERS_KEY, users);

    // Record Redemption
    const redemptions = getStorage<Redemption[]>(REDEMPTIONS_KEY, []);
    const newRedemption: Redemption = {
      id: crypto.randomUUID(),
      user_id: userId,
      reward_id: reward.id,
      reward_snapshot: reward,
      redeemed_at: new Date().toISOString()
    };
    redemptions.push(newRedemption);
    setStorage(REDEMPTIONS_KEY, redemptions);
    
    return newRedemption;
  },
  
  getRedemptions: async (userId: string): Promise<Redemption[]> => {
    const all = getStorage<Redemption[]>(REDEMPTIONS_KEY, []);
    return all.filter(r => r.user_id === userId).sort((a,b) => new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime());
  }
};