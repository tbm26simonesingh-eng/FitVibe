import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Activity, User, Redemption } from '../types';
import { POINTS_CONFIG } from '../constants';
import { Trophy, Zap, Clock, History } from 'lucide-react';

interface DashboardProps {
  user: User;
  activities: Activity[];
  redemptions: Redemption[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, activities, redemptions }) => {

  // Stats Logic
  const totalActivities = activities.length;
  const totalMinutes = activities.reduce((acc, curr) => {
    return curr.type !== 'STEPS' ? acc + curr.value : acc;
  }, 0);
  
  // Chart Data Preparation (Last 7 Days)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(a => a.date.startsWith(dateStr));
      const points = dayActivities.reduce((sum, a) => sum + a.points_earned, 0);
      
      data.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        points: points
      });
    }
    return data;
  }, [activities]);

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500 mt-1">Here is your health overview for today.</p>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-teal-200 flex items-center gap-3">
          <Trophy className="text-yellow-300" />
          <div>
            <p className="text-xs font-medium text-teal-100 uppercase tracking-wider">Available Balance</p>
            <p className="text-2xl font-bold">{user.total_points.toLocaleString()} Pts</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Activities</p>
            <p className="text-2xl font-bold text-slate-900">{totalActivities}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Active Minutes</p>
            <p className="text-2xl font-bold text-slate-900">{totalMinutes}m</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <History size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Redeemed</p>
            <p className="text-2xl font-bold text-slate-900">{redemptions.length}</p>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Activity Points (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="points" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Recent History</h3>
           <div className="space-y-4">
             {recentActivities.length === 0 ? (
               <p className="text-slate-400 text-sm text-center py-8">No activities yet.</p>
             ) : (
               recentActivities.map((act) => {
                 const Config = POINTS_CONFIG[act.type];
                 const Icon = Config.icon;
                 return (
                   <div key={act.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                     <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg ${Config.color}`}>
                         <Icon size={18} />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-slate-900">{Config.label}</p>
                         <p className="text-xs text-slate-500">{new Date(act.date).toLocaleDateString()}</p>
                       </div>
                     </div>
                     <span className="text-sm font-bold text-teal-600">+{act.points_earned}</span>
                   </div>
                 );
               })
             )}
           </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;