import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Search,
  RotateCcw,
  Download,
  Calendar,
  Award,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { useAuth } from '../contexts/AuthContext';

export const FavQuizzesPage: React.FC = () => {
  const { quizHistory, toggleFavoriteQuiz, setActiveDocument, generateQuizForActiveDoc, documents } = useStudy();
  const { isAuthenticated, setOpenAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // If user is NOT signed in, block fav quizzes list and show sign-in prompt screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-10 rounded-3xl glass-panel border border-emerald-200 bg-white shadow-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Sign In Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Your starred favorite quizzes and study reports are saved privately for your email account. Please sign in to access your saved favorites.
          </p>
          <button
            onClick={() => setOpenAuthModal(true)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
          >
            Sign In to View Fav Quizzes
          </button>
        </div>
      </div>
    );
  }

  const favQuizzes = quizHistory.filter(
    (q) =>
      q.isFavorite &&
      (q.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.difficulty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRetake = (item: typeof quizHistory[0]) => {
    const matchedDoc = documents.find((d) => d.id === item.documentId) || documents[0];
    if (matchedDoc) {
      setActiveDocument(matchedDoc);
      generateQuizForActiveDoc();
      navigate('/quiz');
    }
  };

  const handleDownloadReport = (item: typeof quizHistory[0]) => {
    const reportContent = `AI STUDY BUDDY - FAVORITE QUIZ REPORT
Document: ${item.documentName}
Date: ${item.date}
Difficulty: ${item.difficulty.toUpperCase()}
Score: ${item.score} (${item.percentage}%)
Grade: ${item.grade}
Time Taken: ${Math.floor(item.timeTakenSeconds / 60)}m ${item.timeTakenSeconds % 60}s
Total Questions: ${item.totalQuestions}
Correct: ${item.correctCount} | Wrong: ${item.wrongCount} | Skipped: ${item.skippedCount}

==================================================
`;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fav_Quiz_${item.documentName}_${item.date}.txt`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit flex items-center gap-2">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            Fav Quizzes
          </h1>
          <p className="text-slate-600 text-sm">Your starred and saved favorite quiz attempts.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search favorite quizzes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Favorites List */}
      {favQuizzes.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-emerald-200 bg-white space-y-4 shadow-sm">
          <Star className="w-12 h-12 text-amber-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-outfit">No Favorite Quizzes Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            After completing any quiz, click "Yes, Add to Fav Quiz" on the results page to save it here!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" /> Start a Quiz Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favQuizzes.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl glass-panel border border-amber-200 bg-white hover:border-amber-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500 shrink-0" />
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">{item.documentName}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Grade {item.grade}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}
                  </span>
                  <span>•</span>
                  <span>Difficulty: {item.difficulty.toUpperCase()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Award className="w-3.5 h-3.5" /> {item.percentage}% ({item.correctCount}/{item.totalQuestions})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {Math.floor(item.timeTakenSeconds / 60)}m {item.timeTakenSeconds % 60}s
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRetake(item)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  title="Retake Quiz"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>

                <button
                  onClick={() => handleDownloadReport(item)}
                  className="p-2 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:text-slate-900 hover:bg-emerald-50 text-xs"
                  title="Download Summary Report"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleFavoriteQuiz(item.id)}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs"
                  title="Remove from Fav Quizzes"
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
