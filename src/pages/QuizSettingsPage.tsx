import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sliders,
  Sparkles,
  Play,
  FileText,
  Clock,
  Globe,
  Shuffle,
  Target,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { QuestionType, DifficultyLevel, QuizLanguage } from '../types';

export const QuizSettingsPage: React.FC = () => {
  const { activeDocument, quizSettings, updateQuizSettings, generateQuizForActiveDoc } = useStudy();
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    generateQuizForActiveDoc();
    navigate('/quiz');
  };

  const handleToggleQuestionType = (type: QuestionType) => {
    const current = quizSettings.questionTypes;
    let updated: QuestionType[];
    if (current.includes(type)) {
      updated = current.filter((t) => t !== type);
    } else {
      updated = [...current, type];
    }
    if (updated.length === 0) updated = ['multiple_choice'];
    updateQuizSettings({ questionTypes: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
          Configure <span className="gradient-text">Quiz Settings</span>
        </h1>
        <p className="text-slate-600 text-sm">
          Customize difficulty, length, timer, and focus topics for{' '}
          <span className="text-emerald-700 font-semibold">{activeDocument?.name || 'Selected Material'}</span>.
        </p>
      </div>

      {/* Settings Form Card */}
      <div className="p-8 rounded-3xl glass-panel border border-emerald-200 bg-white space-y-8 shadow-md">
        {/* 1. Select Difficulty */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 font-outfit flex items-center justify-between">
            <span>1. Select Difficulty Level</span>
            <span className="text-xs font-semibold text-emerald-700 uppercase">{quizSettings.difficulty}</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'easy', label: 'Easy', desc: 'Simple factual recall & definitions' },
              { id: 'medium', label: 'Medium', desc: 'Concept understanding & applications' },
              { id: 'hard', label: 'Hard', desc: 'Critical thinking & complex scenarios' },
            ].map((diff) => (
              <button
                key={diff.id}
                onClick={() => updateQuizSettings({ difficulty: diff.id as DifficultyLevel })}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  quizSettings.difficulty === diff.id
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : 'bg-emerald-50/50 border-emerald-100 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <div className={`font-bold text-sm ${quizSettings.difficulty === diff.id ? 'text-white' : 'text-slate-900'}`}>{diff.label}</div>
                <div className={`text-[11px] mt-1 leading-tight ${quizSettings.difficulty === diff.id ? 'text-emerald-100' : 'text-slate-500'}`}>{diff.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Select Number of Questions */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 font-outfit">2. Number of Questions</label>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {[10, 20, 30, 40, 50].map((count) => (
              <button
                key={count}
                onClick={() => updateQuizSettings({ questionCount: count })}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                  quizSettings.questionCount === count
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        {/* 3. Question Types */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 font-outfit">3. Question Types (Select all that apply)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { type: 'multiple_choice', label: 'Multiple Choice' },
              { type: 'true_false', label: 'True / False' },
              { type: 'fill_in_blanks', label: 'Fill in Blanks' },
              { type: 'short_answer', label: 'Short Answer' },
            ].map((item) => {
              const isSelected = quizSettings.questionTypes.includes(item.type as QuestionType);
              return (
                <button
                  key={item.type}
                  onClick={() => handleToggleQuestionType(item.type as QuestionType)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Time Limit & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Time Limit
            </label>
            <select
              value={quizSettings.timerMinutes}
              onChange={(e) => updateQuizSettings({ timerMinutes: Number(e.target.value) })}
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value={0}>No Timer (Self-Paced)</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" /> Language
            </label>
            <select
              value={quizSettings.language}
              onChange={(e) => updateQuizSettings({ language: e.target.value as QuizLanguage })}
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>

        {/* 5. Randomize & Focus Topics */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">Randomize Questions</span>
              <input
                type="checkbox"
                checked={quizSettings.randomizeQuestions}
                onChange={(e) => updateQuizSettings({ randomizeQuestions: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">Randomize Answer Choices</span>
              <input
                type="checkbox"
                checked={quizSettings.randomizeAnswers}
                onChange={(e) => updateQuizSettings({ randomizeAnswers: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" /> Focus Topics (Optional)
            </label>
            <input
              type="text"
              value={quizSettings.focusTopics}
              onChange={(e) => updateQuizSettings({ focusTopics: e.target.value })}
              placeholder='e.g., "Generate questions only from Chapter 4" or "Focus on Networking protocols"'
              className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Start Quiz CTA */}
        <button
          onClick={handleStartQuiz}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
        >
          <Play className="w-6 h-6 fill-white" />
          Generate AI Quiz & Start Attempt
        </button>
      </div>
    </div>
  );
};
