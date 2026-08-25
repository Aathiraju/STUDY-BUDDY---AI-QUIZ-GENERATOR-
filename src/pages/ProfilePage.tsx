import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Award,
  CheckCircle2,
  Save,
  LogOut,
  Sparkles,
  Target,
  Bell,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { QuizLanguage, DifficultyLevel } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile, badges } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [studyGoal, setStudyGoal] = useState(user?.studyGoal || '');
  const [language, setLanguage] = useState<QuizLanguage>(user?.preferredLanguage || 'English');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(user?.preferredDifficulty || 'medium');
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      studyGoal,
      preferredLanguage: language,
      preferredDifficulty: difficulty,
      notifications,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
            Student Profile & <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-slate-600 text-xs mt-1">Manage your learning preferences, study goals, and achievements.</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Profile Header Banner with Avatar */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatarUrl}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-400/40 shadow-md"
          />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-emerald-700 font-semibold pt-1 flex items-center justify-center sm:justify-start gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-600" /> {user?.studyGoal}
            </p>
          </div>
        </div>
      </div>

      {/* Unlocked Badges & Achievements Section */}
      <div className="p-6 rounded-3xl glass-panel border border-emerald-200 bg-white space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" /> Unlocked Achievements & Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                b.unlocked
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold font-outfit text-slate-900">{b.title}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{b.description}</p>
              {b.unlocked && <span className="inline-block text-[9px] text-emerald-700 font-semibold">Unlocked ✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Profile Form Settings */}
      <form onSubmit={handleSave} className="p-8 rounded-3xl glass-panel border border-emerald-200 bg-white space-y-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 font-outfit">Learning Preferences</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Study Goal</label>
            <input
              type="text"
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as QuizLanguage)}
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Default Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-emerald-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" /> Daily Study Reminders & Notifications
            </span>
            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifications ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" /> Save Profile Preferences
        </button>

        {savedSuccess && (
          <p className="text-center text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
          </p>
        )}
      </form>
    </div>
  );
};
