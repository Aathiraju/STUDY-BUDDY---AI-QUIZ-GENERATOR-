import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  FileText,
  Sparkles,
  Heart,
  Github,
  Twitter,
  Globe,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-emerald-100 pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Study Buddy Logo"
                className="width-height20 h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              AI-powered web study platform for students and scholars. Upload PDF notes, extract text via OCR, generate instant multiple-choice quizzes, and Q&A with Gemini AI.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini AI RAG
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">Web Platform</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link to="/dashboard" className="hover:text-emerald-700 transition-colors">Dashboard Overview</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-emerald-700 transition-colors">Upload PDF & OCR Notes</Link>
              </li>
              <li>
                <Link to="/uploaded-pdfs" className="hover:text-emerald-700 transition-colors">Saved PDF Library</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-emerald-700 transition-colors">Starred Favorite Quizzes</Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-emerald-700 transition-colors">AI RAG Assistant Chat</Link>
              </li>
            </ul>
          </div>

          {/* Connect & Specs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">Technology</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>React + TypeScript + Vite</li>
              <li>Express API Backend (Node.js)</li>
              <li>Google Gemini AI RAG Engine</li>
              <li>pdf-parse & Tesseract OCR</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 StudyBuddy Web Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for web scholars with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
