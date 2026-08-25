import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Brain,
  AlertCircle,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

export const AnalyticsPage: React.FC = () => {
  const { quizHistory } = useStudy();

  const weeklyData = [
    { day: 'Mon', score: 75, quizzes: 2 },
    { day: 'Tue', score: 82, quizzes: 3 },
    { day: 'Wed', score: 90, quizzes: 4 },
    { day: 'Thu', score: 88, quizzes: 2 },
    { day: 'Fri', score: 94, quizzes: 3 },
    { day: 'Sat', score: 85, quizzes: 1 },
    { day: 'Sun', score: 95, quizzes: 2 },
  ];

  const topicData = [
    { topic: 'Networking', accuracy: 68 },
    { topic: 'Databases', accuracy: 92 },
    { topic: 'OS & CPU', accuracy: 84 },
    { topic: 'Data Structures', accuracy: 78 },
    { topic: 'Algorithms', accuracy: 88 },
  ];

  const recommendations = [
    { type: 'warning', text: 'You struggle with Computer Networking protocols (Layer 4 TCP Handshake).' },
    { type: 'success', text: 'You are exceptionally strong in Database Normalization & ACID guarantees.' },
    { type: 'tip', text: 'Revise Chapter 3 on Operating System critical sections and semaphores.' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
          Performance & <span className="gradient-text">Study Analytics</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Track accuracy trends, identify topic strengths, and get AI-powered study recommendations.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Score</span>
          <div className="text-2xl font-black text-indigo-400 font-outfit">87.4%</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5.2% this week
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Quizzes Completed</span>
          <div className="text-2xl font-black text-purple-400 font-outfit">17 Quizzes</div>
          <span className="text-[10px] text-slate-400">Total 170+ questions</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Study Time</span>
          <div className="text-2xl font-black text-pink-400 font-outfit">8h 45m</div>
          <span className="text-[10px] text-slate-400">Avg 30m per day</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Overall Accuracy</span>
          <div className="text-2xl font-black text-emerald-400 font-outfit">91.2%</div>
          <span className="text-[10px] text-emerald-400">Top 5% Student Rank</span>
        </div>
      </div>

      {/* Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Line Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Weekly Score Trend (%)
          </h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Accuracy Bar Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" /> Topic Mastery Breakdown
          </h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="topic" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="accuracy" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendations Card */}
      <div className="p-8 rounded-3xl glass-panel border border-indigo-500/30 bg-slate-900/90 space-y-6">
        <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-400" />
          AI Automated Study Recommendations
        </h3>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                rec.type === 'warning'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : rec.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
              }`}
            >
              {rec.type === 'warning' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {rec.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {rec.type === 'tip' && <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />}
              <span>{rec.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
