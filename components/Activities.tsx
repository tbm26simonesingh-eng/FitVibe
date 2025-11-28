import React, { useState } from 'react';
import { Activity, ActivityType } from '../types';
import { POINTS_CONFIG } from '../constants';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface ActivitiesProps {
  activities: Activity[];
  onAddActivity: (type: ActivityType, value: number, date: string) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
}

const Activities: React.FC<ActivitiesProps> = ({ activities, onAddActivity, onDeleteActivity }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [type, setType] = useState<ActivityType>('STEPS');
  const [value, setValue] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isNaN(Number(value))) return;
    
    setLoading(true);
    await onAddActivity(type, Number(value), date);
    setLoading(false);
    setIsFormOpen(false);
    setValue('');
  };

  const activityTypes = Object.keys(POINTS_CONFIG) as ActivityType[];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Activity Log</h2>
          <p className="text-slate-500">Track your daily progress and boost your score.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-lg shadow-teal-100"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Log Activity</span>
        </button>
      </div>

      {/* Add Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Log New Activity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {activityTypes.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        type === t 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-slate-200 text-slate-600 hover:border-teal-200'
                      }`}
                    >
                      {POINTS_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {POINTS_CONFIG[type].unit === 'steps' ? 'Steps Count' : 'Duration (minutes)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="e.g. 5000 or 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Calendar size={32} />
            </div>
            <p className="text-slate-500 text-lg">No activities recorded yet.</p>
            <button onClick={() => setIsFormOpen(true)} className="text-teal-600 font-medium mt-2 hover:underline">Log your first one!</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((act) => {
              const Config = POINTS_CONFIG[act.type];
              const Icon = Config.icon;
              return (
                <div key={act.id} className="p-4 sm:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${Config.color} flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{Config.label}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{new Date(act.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{act.value} {Config.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className="block font-bold text-teal-600">+{act.points_earned} Pts</span>
                    </div>
                    <button 
                      onClick={() => onDeleteActivity(act.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;