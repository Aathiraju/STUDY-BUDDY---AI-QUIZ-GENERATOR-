import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  BookOpen,
  FileText,
  Sparkles,
  Star,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

export const QuizResultsPage: React.FC = () => {
  const { currentQuizResult, generateQuizForActiveDoc, toggleFavoriteQuiz } = useStudy();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentQuizResult && currentQuizResult.percentage >= 60) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [currentQuizResult]);

  if (!currentQuizResult) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <Trophy className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 font-outfit">No Quiz Result to Display</h3>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const {
    id: quizId,
    percentage,
    grade,
    score,
    totalQuestions,
    correctCount,
    wrongCount,
    skippedCount,
    timeTakenSeconds,
    difficulty,
    documentName,
    questions,
    userAnswers,
    isFavorite,
  } = currentQuizResult;

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'A+':
      case 'A':
        return 'from-emerald-500 to-teal-600 text-emerald-700 border-emerald-300';
      case 'B':
        return 'from-teal-500 to-cyan-600 text-teal-700 border-teal-300';
      case 'C':
        return 'from-amber-500 to-orange-600 text-amber-700 border-amber-300';
      default:
        return 'from-rose-500 to-red-600 text-rose-700 border-rose-300';
    }
  };

  const handleRetake = () => {
    generateQuizForActiveDoc();
    navigate('/quiz');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-4">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-200 bg-gradient-to-tr from-emerald-50 via-white to-teal-50 shadow-md text-center space-y-6 relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Quiz Completed for {documentName}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Grade Badge Circle */}
          <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${getGradeColor(grade)} p-1 flex items-center justify-center shadow-lg`}>
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-outfit text-slate-900">{grade}</span>
              <span className="text-[10px] uppercase font-bold text-slate-500">Grade</span>
            </div>
          </div>

          <div className="text-left space-y-1 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-outfit">{percentage}%</h1>
            <p className="text-sm font-semibold text-emerald-700">
              Scored {score} Points ({correctCount} / {totalQuestions} Correct)
            </p>
            <p className="text-xs text-slate-500">Difficulty: {difficulty.toUpperCase()}</p>
          </div>
        </div>

        {/* Favorite Quiz Prompt Card */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-outfit">
                {isFavorite ? 'Saved in Favorite Quizzes! ⭐' : 'Save to Favorite Quiz? ⭐'}
              </h4>
              <p className="text-xs text-slate-600">
                {isFavorite ? 'Access anytime from your Fav Quiz page' : 'Save this quiz result to your dedicated Fav Quiz page'}
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleFavoriteQuiz(quizId)}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5 ${
              isFavorite
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
            }`}
          >
            <Star className="w-4 h-4 fill-white" />
            {isFavorite ? 'Favorited ✓' : 'Yes, Add to Fav Quiz'}
          </button>
        </div>

        {/* Breakdown Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-100">
          <div className="p-3 rounded-xl bg-white border border-emerald-100">
            <span className="block text-[11px] text-slate-500">Correct Answers</span>
            <span className="text-lg font-bold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {correctCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-100">
            <span className="block text-[11px] text-slate-500">Wrong Answers</span>
            <span className="text-lg font-bold text-rose-600 flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4" /> {wrongCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-100">
            <span className="block text-[11px] text-slate-500">Skipped</span>
            <span className="text-lg font-bold text-slate-600">{skippedCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-100">
            <span className="block text-[11px] text-slate-500">Time Taken</span>
            <span className="text-lg font-bold text-emerald-700 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" /> {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>

          <Link
            to="/favorites"
            className="px-6 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center gap-2"
          >
            <Star className="w-4 h-4 fill-amber-500" /> View Fav Quizzes
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50 font-semibold text-xs flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Detailed Per-Question Explanation & Page Citations Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Detailed Question Explanations & Source PDF References
          </h2>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAns = userAnswers.find((ua) => ua.questionId === q.id);
            const isCorrect = userAns?.isCorrect;
            const isSkipped = !userAns?.selectedAnswer;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl glass-panel border space-y-4 ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : isSkipped
                    ? 'border-slate-200 bg-white'
                    : 'border-rose-200 bg-rose-50/40'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Question {idx + 1}</span>
                  {isCorrect ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+10 XP)
                    </span>
                  ) : isSkipped ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">Skipped</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                {/* Question */}
                <h3 className="text-base font-bold text-slate-900 font-outfit">{q.question}</h3>

                {/* Choices breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-emerald-100">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Your Selected Answer</span>
                    <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {userAns?.selectedAnswer || '(No answer provided)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-100">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Correct Answer</span>
                    <span className="font-semibold text-emerald-700">{q.correctAnswer}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Concept Explanation</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{q.explanation}</p>
                  </div>

                  {/* Direct PDF Page Reference Snippet */}
                  <div className="pt-2 border-t border-emerald-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <FileText className="w-3.5 h-3.5" /> Source Document Reference
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                        Page {q.pageNumber}
                      </span>
                    </div>
                    <blockquote className="text-xs text-slate-700 font-mono italic bg-emerald-50/50 p-2.5 rounded-lg border-l-2 border-emerald-500">
                      "{q.referenceSnippet}"
                    </blockquote>
                  </div>

                  {/* Why wrong choices are incorrect */}
                  {q.whyWrongOptions && (
                    <div className="pt-2 border-t border-emerald-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Why Other Options Are Incorrect</span>
                      <div className="space-y-1 text-[11px] text-slate-600">
                        {Object.entries(q.whyWrongOptions).map(([opt, reason]) => (
                          <div key={opt}>
                            <span className="text-slate-900 font-semibold">• {opt}:</span> {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
