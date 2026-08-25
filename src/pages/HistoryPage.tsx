import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  RotateCcw,
  Trash2,
  Download,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

export const HistoryPage: React.FC = () => {
  const { quizHistory, deleteQuizFromHistory, setActiveDocument, generateQuizForActiveDoc, documents } = useStudy();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredHistory = quizHistory.filter(
    (item) =>
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
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
    const reportContent = `AI STUDY BUDDY - QUIZ REPORT
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
    link.download = `Quiz_Report_${item.documentName}_${item.date}.txt`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-outfit flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-400" />
            Quiz History & Saved Results
          </h1>
          <p className="text-slate-400 text-sm">Review, retake, or download past AI quiz attempts.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document or difficulty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800 space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-outfit">No Saved Quizzes Found</h3>
          <p className="text-xs text-slate-400">Complete a quiz from the Upload page to store records here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white font-outfit">{item.documentName}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Grade {item.grade}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> {item.date}
                  </span>
                  <span>•</span>
                  <span>Difficulty: {item.difficulty.toUpperCase()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                    <Award className="w-3.5 h-3.5" /> {item.percentage}% ({item.correctCount}/{item.totalQuestions})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {Math.floor(item.timeTakenSeconds / 60)}m {item.timeTakenSeconds % 60}s
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRetake(item)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  title="Retake Quiz"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>

                <button
                  onClick={() => handleDownloadReport(item)}
                  className="p-2 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white text-xs"
                  title="Download Report Summary"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteQuizFromHistory(item.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
