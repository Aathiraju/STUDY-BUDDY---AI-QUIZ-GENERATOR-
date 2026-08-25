import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Layers,
  GitPullRequest,
  FileText,
  Key,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RotateCw,
  Award,
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

export const ToolsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'flashcards' | 'mindmap' | 'notes' | 'formulas') || 'flashcards';

  const [activeTab, setActiveTab] = useState<'flashcards' | 'mindmap' | 'notes' | 'formulas'>(initialTab);
  const { flashcards, toggleFlashcardMastered, activeDocument, mindMap } = useStudy();

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentFlashcard = flashcards[cardIndex] || flashcards[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
          AI Study Tools & <span className="gradient-text">Revision Assets</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Interactive flashcards, visual Mind Maps, summary notes, and formula sheets derived from{' '}
          <span className="text-indigo-300 font-semibold">{activeDocument?.name || 'Selected Document'}</span>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 border-b border-slate-800 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
            activeTab === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> AI Flashcards Deck
        </button>

        <button
          onClick={() => setActiveTab('mindmap')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
            activeTab === 'mindmap'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GitPullRequest className="w-4 h-4" /> Visual Mind Map
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
            activeTab === 'notes'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Summary Notes
        </button>

        <button
          onClick={() => setActiveTab('formulas')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
            activeTab === 'formulas'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Key className="w-4 h-4" /> Formulas & Keywords
        </button>
      </div>

      {/* TAB 1: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Card {cardIndex + 1} of {flashcards.length}</span>
            <span className="font-semibold text-indigo-300">Category: {currentFlashcard.category}</span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 rounded-3xl glass-panel border border-indigo-500/40 bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 p-8 flex flex-col justify-between cursor-pointer hover:border-indigo-400 transition-all shadow-2xl relative overflow-hidden select-none"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>{isFlipped ? 'ANSWER / BACK' : 'QUESTION / FRONT'}</span>
              <RotateCw className="w-4 h-4 text-slate-400" />
            </div>

            <div className="my-auto text-center space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-outfit leading-relaxed">
                {isFlipped ? currentFlashcard.back : currentFlashcard.front}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">(Click anywhere to flip card)</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlashcardMastered(currentFlashcard.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  currentFlashcard.mastered
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentFlashcard.mastered ? 'Mastered' : 'Mark as Mastered'}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={cardIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-40"
            >
              Previous Card
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev + 1) % flashcards.length);
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MIND MAP */}
      {activeTab === 'mindmap' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-slate-900/90 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-purple-400" /> Interactive Hierarchy Mind Map
            </h3>
            <span className="text-xs text-slate-400">Auto-Generated Node Tree</span>
          </div>

          <div className="space-y-6 text-sm font-sans">
            {/* Root node */}
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Domain</span>
              <h4 className="text-lg font-bold text-white">{mindMap.label}</h4>
              <p className="text-xs text-slate-300">{mindMap.description}</p>
            </div>

            {/* Child nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-purple-500/40">
              {mindMap.children?.map((child) => (
                <div key={child.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-purple-300 font-outfit">{child.label}</h5>
                  <p className="text-xs text-slate-400">{child.description}</p>

                  <ul className="space-y-1 pl-3 text-xs text-slate-300">
                    {child.children?.map((sub) => (
                      <li key={sub.id} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {sub.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUMMARY NOTES */}
      {activeTab === 'notes' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-slate-900/90 space-y-6">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Executive One-Page Summary Notes
          </h3>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm">Key Takeaways</h4>
              <p>
                1. Standardized architecture ensures interoperability across heterogeneous network systems.
                <br />
                2. Layer 4 Transport protocols balance throughput speed (UDP) vs strict error recovery reliability (TCP).
                <br />
                3. Database transactions preserve data integrity through ACID constraint guarantees.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm">Important Exam Tips</h4>
              <p>
                • Remember TCP 3-way handshake flag order: SYN → SYN-ACK → ACK.
                <br />
                • 2NF specifically eliminates partial functional dependencies, whereas 3NF eliminates transitive dependencies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FORMULAS & KEYWORDS */}
      {activeTab === 'formulas' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-slate-900/90 space-y-6">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Key className="w-5 h-5 text-pink-400" /> Formulas & Definition Sheet
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] uppercase font-bold text-pink-400">Networking Formula</span>
              <p className="text-slate-200 font-bold">Throughput = Data Volume / RTT</p>
              <p className="text-[11px] text-slate-400 font-sans">Calculates maximum theoretical data bandwidth over latency.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Subnet Formula</span>
              <p className="text-slate-200 font-bold">Usable IPs = (2 ^ (32 - Mask)) - 2</p>
              <p className="text-[11px] text-slate-400 font-sans">Subtracts network address and broadcast address.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
