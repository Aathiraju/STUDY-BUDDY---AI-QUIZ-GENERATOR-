import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { useAuth } from '../contexts/AuthContext';
import { uploadPdfToBackend } from '../services/apiService';
import { DocumentItem } from '../types';

export const UploadPage: React.FC = () => {
  const { addDocument, setActiveDocument } = useStudy();
  const { isAuthenticated, setOpenAuthModal } = useAuth();
  const navigate = useNavigate();

  // PDF Upload State
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedPdfDoc, setUploadedPdfDoc] = useState<DocumentItem | null>(null);

  // PDF File Drop / Selection handler using Backend API
  const handlePdfFileSelect = async (file: File) => {
    // Require Sign In
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF document.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    try {
      const result = await uploadPdfToBackend(file);
      setUploadProgress(100);
      setIsUploading(false);

      const newDoc: DocumentItem = {
        id: `pdf_${Date.now()}`,
        name: result.filename,
        type: 'pdf',
        text: result.text,
        pageCount: result.pageCount,
        estimatedReadingTimeMinutes: result.estimatedReadingTimeMinutes,
        uploadDate: result.uploadDate,
        fileSizeFormatted: result.fileSizeFormatted,
        previewSnippet: result.previewSnippet,
      };

      setUploadedPdfDoc(newDoc);
      addDocument(newDoc);
    } catch (err) {
      console.error('Upload Error:', err);
      setIsUploading(false);
    }
  };

  const handleProceedToQuiz = () => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }

    if (uploadedPdfDoc) {
      setActiveDocument(uploadedPdfDoc);
      navigate('/quiz-settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-4">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
          Upload PDF Study Notes & <span className="gradient-text">Generate AI Quiz</span>
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Upload your PDF lecture notes, textbooks, or study materials to extract text and generate personalized AI quizzes.
        </p>
      </div>

      {/* Sign-In Requirement Banner if Guest */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sign in to your StudyBuddy account to upload PDFs and generate AI quizzes.</span>
          </div>
          <button
            onClick={() => setOpenAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors shrink-0"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* PDF UPLOAD CARD */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {!uploadedPdfDoc ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!isAuthenticated) {
                setOpenAuthModal(true);
                return;
              }
              if (e.dataTransfer.files?.[0]) {
                handlePdfFileSelect(e.dataTransfer.files[0]);
              }
            }}
            className={`p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all text-center space-y-6 glass-panel ${
              dragOver ? 'border-emerald-500 bg-emerald-50 scale-[1.01]' : 'border-emerald-200 bg-white'
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Upload className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 font-outfit">Drag & Drop your PDF notes here</h3>
              <p className="text-xs text-slate-500">Supports PDF format up to 25MB (Parsed by Express API)</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <label
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    setOpenAuthModal(true);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
              >
                Browse PDF File
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePdfFileSelect(e.target.files[0])}
                />
              </label>
            </div>

            {isUploading && (
              <div className="max-w-md mx-auto space-y-2 pt-4">
                <div className="flex justify-between text-xs text-emerald-800 font-mono">
                  <span>Extracting PDF text via Express API...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Upload Success Result Card */
          <div className="p-8 rounded-3xl glass-panel border border-emerald-200 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">{uploadedPdfDoc.name}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">PDF Extracted via Express Backend API ✓</p>
                </div>
              </div>
              <button
                onClick={() => setUploadedPdfDoc(null)}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="block text-xs text-slate-500">Total Pages</span>
                <span className="text-xl font-bold text-slate-900">{uploadedPdfDoc.pageCount} Pages</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="block text-xs text-slate-500">File Size</span>
                <span className="text-xl font-bold text-slate-900">{uploadedPdfDoc.fileSizeFormatted}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="block text-xs text-slate-500">Est. Reading Time</span>
                <span className="text-xl font-bold text-emerald-700">~{uploadedPdfDoc.estimatedReadingTimeMinutes} mins</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700">Extracted Text Preview:</span>
              <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100 text-xs text-slate-800 font-mono leading-relaxed max-h-40 overflow-y-auto">
                {uploadedPdfDoc.previewSnippet}
              </div>
            </div>

            <button
              onClick={handleProceedToQuiz}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-5 h-5 text-white" />
              Configure Quiz Settings
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
