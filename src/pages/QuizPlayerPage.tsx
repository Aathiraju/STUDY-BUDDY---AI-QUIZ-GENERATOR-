import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { UserAnswer, QuizResult } from '../types';

export const QuizPlayerPage: React.FC = () => {
  const { activeQuestions, activeDocument, quizSettings, saveQuizResult } = useStudy();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: string }>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(() => {
    return quizSettings.timerMinutes ? quizSettings.timerMinutes * 60 : 0;
  });
  const [startTime] = useState<number>(Date.now());

  // Countdown timer effect
  useEffect(() => {
    if (!quizSettings.timerMinutes || quizSettings.timerMinutes === 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizSettings.timerMinutes]);

  if (!activeQuestions || activeQuestions.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 font-outfit">No Active Quiz Found</h3>
        <p className="text-xs text-slate-500">Please select or upload a document to generate questions.</p>
        <button
          onClick={() => navigate('/upload')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-md"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentIndex];
  const progressPercent = ((currentIndex + 1) / activeQuestions.length) * 100;
  const isBookmarked = bookmarkedIds.includes(currentQuestion.id);

  const handleOptionSelect = (ans: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: ans,
    }));
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      setBookmarkedIds((prev) => prev.filter((id) => id !== currentQuestion.id));
    } else {
      setBookmarkedIds((prev) => [...prev, currentQuestion.id]);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishQuiz = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const answerRecords: UserAnswer[] = activeQuestions.map((q) => {
      const sel = userAnswers[q.id];
      if (!sel) {
        skippedCount++;
        return {
          questionId: q.id,
          selectedAnswer: '',
          isCorrect: false,
          timeSpentSeconds: Math.round(timeTaken / activeQuestions.length),
        };
      }
      const isRight = sel.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isRight) correctCount++;
      else wrongCount++;

      return {
        questionId: q.id,
        selectedAnswer: sel,
        isCorrect: isRight,
        timeSpentSeconds: Math.round(timeTaken / activeQuestions.length),
      };
    });

    const percentage = Math.round((correctCount / activeQuestions.length) * 100);
    let grade: QuizResult['grade'] = 'Fail';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';

    const result: QuizResult = {
      id: `res_${Date.now()}`,
      documentId: activeDocument?.id || 'doc_custom',
      documentName: activeDocument?.name || 'Uploaded Notes',
      date: new Date().toISOString().split('T')[0],
      score: correctCount * 10,
      totalQuestions: activeQuestions.length,
      percentage,
      correctCount,
      wrongCount,
      skippedCount,
      timeTakenSeconds: timeTaken,
      difficulty: quizSettings.difficulty,
      grade,
      userAnswers: answerRecords,
      questions: activeQuestions,
    };

    saveQuizResult(result);
    navigate('/quiz-results');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-4">
      {/* Top Bar (Progress, Timer, Bookmarks) */}
      <div className="p-4 rounded-2xl glass-panel border border-emerald-200 bg-white flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-800 font-outfit uppercase tracking-wider">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-xs font-medium text-slate-600">
            {quizSettings.difficulty.toUpperCase()} Difficulty
          </span>
        </div>

        {/* Timer Pill */}
        {quizSettings.timerMinutes > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>
        )}

        {/* Bookmark Button */}
        <button
          onClick={handleToggleBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isBookmarked
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-white border-emerald-200 text-slate-600 hover:bg-emerald-50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          {isBookmarked ? 'Review Later' : 'Bookmark'}
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
        />
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-8 rounded-3xl glass-panel border border-emerald-200 bg-white space-y-6 shadow-md"
        >
          {/* Concept Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topic: {currentQuestion.relatedConcept}</span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-outfit leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answers Selection Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false' ? (
              (currentQuestion.options || ['True', 'False']).map((opt, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className={`w-full p-4 rounded-2xl text-left font-medium text-sm border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm ring-2 ring-emerald-400/40'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                );
              })
            ) : (
              /* Fill in Blanks / Short Answer Input */
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">Type Your Answer Below:</label>
                <textarea
                  rows={3}
                  value={userAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleOptionSelect(e.target.value)}
                  placeholder="Type your answer here based on the source text..."
                  className="w-full p-4 rounded-2xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-5 py-3 rounded-xl bg-white border border-emerald-200 text-slate-700 font-semibold text-xs hover:bg-emerald-50 disabled:opacity-40 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentIndex < activeQuestions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs"
          >
            Skip Question
          </button>

          {currentIndex < activeQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishQuiz}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit & View Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
