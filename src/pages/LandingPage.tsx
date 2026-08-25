import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, GraduationCap, ArrowRight, Star } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-4">
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 text-center space-y-6">
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Quiz Generator & Friendly Teacher Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight font-outfit text-slate-900 leading-tight"
          >
            Study Smarter with <span className="gradient-text">AI Quizzes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Upload your PDF notes to generate instant multiple-choice quizzes, step-by-step explanations, and ask your Friendly Teacher.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/upload"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" /> Start Studying Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Core Features Grid */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: FileText, title: 'Upload PDF Notes', desc: 'Parse PDF notes & textbooks with Express API', path: '/upload' },
          { icon: Star, title: 'Fav Quizzes', desc: 'Save & review starred quiz reports', path: '/favorites' },
          { icon: GraduationCap, title: 'Friendly Teacher', desc: 'Ask questions to your patient AI tutor', path: '/assistant' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.title}
              to={f.path}
              className="p-6 rounded-2xl glass-panel border border-emerald-100 bg-white hover:border-emerald-300 transition-all space-y-3 group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-outfit group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                  {f.title}
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};
