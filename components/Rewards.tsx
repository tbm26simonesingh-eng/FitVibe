import React, { useState } from 'react';
import { Reward, User } from '../types';
import { INITIAL_REWARDS } from '../constants';
import { Lock, CheckCircle } from 'lucide-react';

interface RewardsProps {
  user: User;
  onRedeem: (reward: Reward) => Promise<void>;
}

const Rewards: React.FC<RewardsProps> = ({ user, onRedeem }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRedeem = async (reward: Reward) => {
    if (user.total_points < reward.points_required) return;
    
    setProcessingId(reward.id);
    try {
      await onRedeem(reward);
      setSuccessMsg(`Successfully redeemed ${reward.name}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      alert("Redemption failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Rewards Store</h2>
        <p className="text-slate-500">Spend your hard-earned points on real vouchers.</p>
        
        {successMsg && (
            <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={20} />
                {successMsg}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_REWARDS.map((reward) => {
          const canAfford = user.total_points >= reward.points_required;
          const isProcessing = processingId === reward.id;

          return (
            <div key={reward.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={reward.image_url} 
                  alt={reward.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                  {reward.vendor}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{reward.name}</h3>
                  <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded-md text-sm font-bold">{reward.value_display}</span>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 flex-1">
                    Redeem instantly. Valid for 1 year.
                </p>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford || isProcessing}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                    ${canAfford 
                      ? 'bg-slate-900 text-white hover:bg-teal-600 shadow-lg shadow-slate-200 hover:shadow-teal-200' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  {isProcessing ? (
                      'Processing...'
                  ) : !canAfford ? (
                    <>
                      <Lock size={16} />
                      Need {reward.points_required - user.total_points} more
                    </>
                  ) : (
                    <>
                      Redeem for {reward.points_required} Pts
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;