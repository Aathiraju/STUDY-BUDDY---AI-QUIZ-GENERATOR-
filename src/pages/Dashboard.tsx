import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStudy } from '../contexts/StudyContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { quizHistory, documents } = useStudy();

  const actionCards = [
    {
      title: 'Upload PDF Notes',
      subtitle: 'Drag & drop study notes or textbooks to generate quizzes',
      icon: Upload,
      path: '/upload',
      badge: 'PDF Upload',
    },
    {
      title: 'Uploaded PDFs',
      subtitle: 'Access saved PDF materials and launch AI quizzes',
      icon: FileText,
      path: '/uploaded-pdfs',
      badge: `${documents.length} Files`,
    },
    {
      title: 'Fav Quizzes',
      subtitle: 'Review starred favorite quiz results and study reports',
      icon: Star,
      path: '/favorites',
      badge: `${quizHistory.filter((q) => q.isFavorite).length} Starred`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-4">
      {/* Fresh Light Green Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">
            Welcome back, {user?.name || 'Scholar'}! 👋
          </h1>
          <p className="text-xs text-slate-600">
            Goal: <span className="text-emerald-700 font-semibold">{user?.studyGoal || 'Computer Science Midterms Prep'}</span>
          </p>
        </div>

        <Link
          to="/upload"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Sparkles className="w-4 h-4" /> + New Study Quiz
        </Link>
      </div>

      {/* Main Action Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Quick Actions & Study Options
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} whileHover={{ y: -3 }}>
                <Link
                  to={card.path}
                  className="block h-full p-6 rounded-2xl glass-panel border border-emerald-100 hover:border-emerald-300 bg-white transition-all group space-y-4 relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-outfit group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                      {card.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-600" />
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
