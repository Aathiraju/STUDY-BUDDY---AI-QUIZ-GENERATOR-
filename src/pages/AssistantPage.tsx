import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Send,
  User,
  Upload,
  FolderOpen,
  ChevronDown,
  FileCheck,
  Paperclip,
  FileText,
  Lock,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { useAuth } from '../contexts/AuthContext';
import { uploadPdfToBackend, askChatAssistantBackend } from '../services/apiService';
import { DocumentItem } from '../types';

export const AssistantPage: React.FC = () => {
  const { documents, activeDocument, setActiveDocument, addDocument, chatMessages, sendChatMessage } = useStudy();
  const { isAuthenticated, setOpenAuthModal } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showSavedPdfDropdown, setShowSavedPdfDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close saved PDF dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSavedPdfDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const samplePrompts = [
    'Explain OSI Model layers in simple terms',
    'What is TCP 3-way handshake?',
    'Summarize Chapter 1 like a teacher',
    'What is the difference between TCP and UDP?',
    'Define ACID properties with examples',
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }

    if (!inputText.trim()) return;

    const query = inputText;
    setInputText('');

    // Send user message to context UI
    sendChatMessage(query);

    // Call Express API Assistant Backend
    try {
      const response = await askChatAssistantBackend(query, activeDocument?.text, activeDocument?.name);
      if (response && response.reply) {
        // Send assistant response to UI
        sendChatMessage(response.reply);
      }
    } catch (err) {
      console.error('Chat API Error:', err);
    }
  };

  const handleChipClick = (prompt: string) => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }
    setInputText(prompt);
  };

  // Button 1: Direct PDF Upload for Chat via Express Backend
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF document.');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadPdfToBackend(file);
      setIsUploading(false);

      const newDoc: DocumentItem = {
        id: `pdf_assistant_${Date.now()}`,
        name: result.filename,
        type: 'pdf',
        text: result.text,
        pageCount: result.pageCount,
        estimatedReadingTimeMinutes: result.estimatedReadingTimeMinutes,
        uploadDate: result.uploadDate,
        fileSizeFormatted: result.fileSizeFormatted,
        previewSnippet: result.previewSnippet,
      };

      addDocument(newDoc);
      setActiveDocument(newDoc);
      sendChatMessage(`Hello Teacher! I have uploaded "${file.name}". Can you explain the main concepts from this document?`);
    } catch (err) {
      console.error('Upload Error:', err);
      setIsUploading(false);
    }
  };

  // Button 2: Select Saved PDF for Chat
  const handleSelectSavedPdf = (doc: DocumentItem) => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }

    setActiveDocument(doc);
    setShowSavedPdfDropdown(false);
    sendChatMessage(`Switched context to "${doc.name}". Ask me anything about this document!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-4">
      {/* Assistant Title Header & Twin PDF Action Buttons Side-by-Side */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-emerald-600" />
            Friendly Teacher
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Your patient AI tutor powered by Express API & Google Gemini AI.
          </p>
        </div>

        {/* Twin PDF Action Buttons Placed Side-by-Side */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Button 1: Upload PDF for Chat */}
          <label
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                setOpenAuthModal(true);
              }
            }}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>{isUploading ? 'Parsing PDF...' : 'Upload PDF for Chat'}</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={isUploading} />
          </label>

          {/* Button 2: Saved PDF for Chat Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setOpenAuthModal(true);
                  return;
                }
                setShowSavedPdfDropdown(!showSavedPdfDropdown);
              }}
              className="h-10 px-4 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:bg-emerald-50"
            >
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>Saved PDF for Chat</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            {/* Saved PDF Dropdown Menu */}
            {showSavedPdfDropdown && (
              <div className="absolute right-0 mt-2 w-72 p-3 rounded-2xl glass-panel border border-emerald-200 bg-white shadow-xl text-slate-900 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 border-b border-emerald-100">
                  Select Saved PDF ({documents.length})
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {documents.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">No saved PDFs yet. Upload one first!</p>
                  ) : (
                    documents.map((doc) => {
                      const isSelected = activeDocument?.id === doc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => handleSelectSavedPdf(doc)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${isSelected
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-slate-100 text-slate-700 hover:bg-emerald-50/50'
                            }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <div className="truncate">
                              <span className="block truncate font-outfit">{doc.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono font-normal">
                                {doc.pageCount} Pages • {doc.fileSizeFormatted}
                              </span>
                            </div>
                          </div>
                          {isSelected && <span className="text-[10px] text-emerald-600 font-bold shrink-0">Active ✓</span>}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign-In Banner if Guest */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Please sign in to ask questions or chat with your Friendly Teacher.</span>
          </div>
          <button
            onClick={() => setOpenAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors shrink-0"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Active Document Indicator Bar */}
      <div className="p-3 rounded-2xl glass-panel border border-emerald-200 bg-white flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-semibold text-emerald-800 overflow-hidden">
          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-500 shrink-0">Current Study Lesson:</span>
          <span className="text-slate-900 truncate font-outfit font-bold">
            {activeDocument ? activeDocument.name : 'No PDF selected'}
          </span>
          {activeDocument && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 font-mono">
              {activeDocument.pageCount} Pages
            </span>
          )}
        </div>
      </div>

      {/* Sample Prompt Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleChipClick(prompt)}
            className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-medium transition-all"
          >
            💡 "{prompt}"
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="p-6 rounded-3xl glass-panel border border-emerald-200 bg-white h-[480px] flex flex-col justify-between shadow-md">
        <div className="overflow-y-auto space-y-4 pr-2">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${isUser ? 'bg-slate-800' : 'bg-emerald-600'
                    }`}
                >
                  {isUser ? <User className="w-4 h-4 text-white" /> : <GraduationCap className="w-4.5 h-4.5 text-white" />}
                </div>

                <div className={`space-y-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${isUser
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-tr-none shadow-sm'
                      : 'bg-emerald-50/50 border border-emerald-200 text-slate-800 rounded-tl-none font-sans whitespace-pre-wrap'
                      }`}
                  >
                    {msg.text}
                  </div>

                  {/* Citation Pill */}
                  {msg.sourceReferences && msg.sourceReferences.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono">
                      <FileText className="w-3 h-3" />
                      Page {msg.sourceReferences[0].pageNumber} Reference Grounded
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar with Attachment Button */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-emerald-100 flex items-center gap-2">
          <label
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                setOpenAuthModal(true);
              }
            }}
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 cursor-pointer transition-colors"
            title="Upload PDF Document directly to Chat"
          >
            <Paperclip className="w-4 h-4" />
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
          </label>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isAuthenticated ? `Ask your Friendly Teacher about ${activeDocument?.name || 'your PDF notes'}...` : 'Please sign in to ask questions...'}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
