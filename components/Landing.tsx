import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Gift, TrendingUp, ShieldCheck } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">FitVibe</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Log in</Link>
              <Link to="/signup" className="bg-teal-600 text-white px-5 py-2 rounded-full font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Turn your <span className="text-teal-600">Sweat</span> into <span className="text-purple-600">Rewards</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Track your daily steps, workouts, and mindfulness sessions. Earn points for every activity and redeem them for real vouchers from your favorite brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/signup" className="px-8 py-4 bg-teal-600 text-white rounded-full text-lg font-semibold hover:bg-teal-700 transition-all shadow-xl shadow-teal-200 hover:-translate-y-1">
              Start Earning Today
            </Link>
             <a href="#how-it-works" className="px-8 py-4 bg-slate-100 text-slate-700 rounded-full text-lg font-semibold hover:bg-slate-200 transition-all">
              How it Works
            </a>
          </div>
        </div>

        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
          <img 
            src="https://picsum.photos/seed/fitness_hero/1200/600" 
            alt="App Dashboard Preview" 
            className="w-full h-auto object-cover transform hover:scale-105 transition-duration-700"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Simple, rewarding, and fun</h2>
            <p className="mt-4 text-slate-600">Three steps to a healthier, wealthier you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: TrendingUp, 
                title: "Track Activity", 
                desc: "Log your running, cycling, gym sessions, or just daily steps. We support all major activity types.",
                color: "bg-blue-100 text-blue-600"
              },
              { 
                icon: ShieldCheck, 
                title: "Earn Points", 
                desc: "Every step counts. Our algorithm converts your effort into points instantly upon logging.",
                color: "bg-teal-100 text-teal-600"
              },
              { 
                icon: Gift, 
                title: "Get Rewards", 
                desc: "Exchange points for Amazon, Uber, or food delivery vouchers. Treat yourself for the hard work.",
                color: "bg-purple-100 text-purple-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Footer */}
       <footer className="bg-slate-900 text-slate-400 py-12">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 FitVibe Rewards. Built with Vibe Code.</p>
         </div>
       </footer>
    </div>
  );
};

export default Landing;