import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Play,
  GraduationCap,
  Upload,
  Search,
  Lock,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { useAuth } from '../contexts/AuthContext';

export const UploadedPdfsPage: React.FC = () => {
  const { documents, setActiveDocument, generateQuizForActiveDoc } = useStudy();
  const { isAuthenticated, setOpenAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // If user is NOT signed in, block document list and show sign-in prompt screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="p-10 rounded-3xl glass-panel border border-emerald-200 bg-white shadow-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Sign In Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Uploaded PDFs and study notes are saved privately for your email account. Please sign in to access your uploaded document library.
          </p>
          <button
            onClick={() => setOpenAuthModal(true)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
          >
            Sign In to View Your PDFs
          </button>
        </div>
      </div>
    );
  }

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartQuiz = (doc: typeof documents[0]) => {
    setActiveDocument(doc);
    generateQuizForActiveDoc();
    navigate('/quiz-settings');
  };

  const handleAskAssistant = (doc: typeof documents[0]) => {
    setActiveDocument(doc);
    navigate('/assistant');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit flex items-center gap-2">
            <FileText className="w-8 h-8 text-emerald-600" />
            Uploaded PDFs & Documents
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Review your uploaded materials, generate AI quizzes, or chat directly with your Friendly Teacher.
          </p>
        </div>

        {/* Search & Upload CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search uploaded PDFs..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Link
            to="/upload"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0 transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> + Upload PDF
          </Link>
        </div>
      </div>

      {/* Documents Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-emerald-200 bg-white space-y-4">
          <FileText className="w-12 h-12 text-emerald-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-outfit">No Uploaded PDFs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your lecture notes or textbooks to build quizzes and ask your Friendly Teacher!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md"
          >
            <Upload className="w-4 h-4" /> Upload First PDF
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded-2xl glass-panel border border-emerald-100 bg-white hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:shadow-md"
            >
              {/* Info */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-outfit">{doc.name}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="text-emerald-700 font-semibold">{doc.pageCount} Pages</span>
                      <span>•</span>
                      <span>~{doc.estimatedReadingTimeMinutes} min read</span>
                      <span>•</span>
                      <span>{doc.fileSizeFormatted}</span>
                      <span>•</span>
                      <span>Uploaded {doc.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 font-mono leading-relaxed line-clamp-2">
                  "{doc.previewSnippet}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => handleStartQuiz(doc)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" /> Generate Quiz
                </button>

                <button
                  onClick={() => handleAskAssistant(doc)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" /> Ask Friendly Teacher
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
