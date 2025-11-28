import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Rewards from './components/Rewards';
import Auth from './components/Auth';
import { User, Activity, Redemption, ActivityType, Reward } from './types';
import { MockDB } from './services/storage';
import { POINTS_CONFIG } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  // Initialize Auth
  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await MockDB.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await refreshData(currentUser.id);
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshData = async (userId: string) => {
    const [acts, reds, updatedUser] = await Promise.all([
      MockDB.getActivities(userId),
      MockDB.getRedemptions(userId),
      MockDB.getCurrentUser()
    ]);
    setActivities(acts);
    setRedemptions(reds);
    if (updatedUser) setUser(updatedUser);
  };

  const handleLogin = async (email: string) => {
    const loggedUser = await MockDB.login(email);
    if (!loggedUser) throw new Error("User not found (Try signing up first or use demo)");
    setUser(loggedUser);
    await refreshData(loggedUser.id);
  };

  const handleSignup = async (name: string, email: string) => {
    const newUser = await MockDB.signup(name, email);
    setUser(newUser);
    await refreshData(newUser.id);
  };

  const handleLogout = async () => {
    await MockDB.logout();
    setUser(null);
    setActivities([]);
    setRedemptions([]);
  };

  const handleAddActivity = async (type: ActivityType, value: number, date: string) => {
    if (!user) return;
    const points = Math.round(value * POINTS_CONFIG[type].rate);
    await MockDB.addActivity({
      user_id: user.id,
      type,
      value,
      date,
      points_earned: points
    });
    await refreshData(user.id);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!user) return;
    await MockDB.deleteActivity(id);
    await refreshData(user.id);
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user) return;
    await MockDB.redeemReward(user.id, reward);
    await refreshData(user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/landing" 
          element={!user ? <Landing /> : <Navigate to="/" />} 
        />
        <Route 
          path="/login" 
          element={!user ? <Auth mode="login" onLogin={handleLogin} onSignup={handleSignup} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Auth mode="signup" onLogin={handleLogin} onSignup={handleSignup} /> : <Navigate to="/" />} 
        />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard user={user} activities={activities} redemptions={redemptions} />} />
                  <Route 
                    path="/activities" 
                    element={
                      <Activities 
                        activities={activities} 
                        onAddActivity={handleAddActivity} 
                        onDeleteActivity={handleDeleteActivity}
                      />
                    } 
                  />
                  <Route 
                    path="/rewards" 
                    element={
                      <Rewards 
                        user={user} 
                        onRedeem={handleRedeem}
                      />
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/landing" />
            )
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;