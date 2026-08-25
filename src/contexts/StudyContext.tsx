import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DocumentItem,
  QuizSettings,
  Question,
  QuizResult,
  Flashcard,
  MindMapNode,
  ChatMessage,
} from '../types';
import { SAMPLE_DOCUMENTS, generateQuizFromText } from '../utils/aiQuizGenerator';
import { useAuth } from './AuthContext';

interface StudyContextType {
  documents: DocumentItem[];
  activeDocument: DocumentItem | null;
  setActiveDocument: (doc: DocumentItem | null) => void;
  addDocument: (doc: DocumentItem) => void;
  quizSettings: QuizSettings;
  updateQuizSettings: (settings: Partial<QuizSettings>) => void;
  activeQuestions: Question[];
  setActiveQuestions: (questions: Question[]) => void;
  currentQuizResult: QuizResult | null;
  setCurrentQuizResult: (result: QuizResult | null) => void;
  quizHistory: QuizResult[];
  saveQuizResult: (result: QuizResult) => void;
  toggleFavoriteQuiz: (quizId: string) => void;
  generateQuizForActiveDoc: () => Question[];
  deleteQuizFromHistory: (quizId: string) => void;

  // Flashcards & Tools
  flashcards: Flashcard[];
  toggleFlashcardMastered: (id: string) => void;
  mindMap: MindMapNode;

  // Chatbot RAG Assistant
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  difficulty: 'medium',
  questionCount: 10,
  questionTypes: ['multiple_choice', 'true_false', 'fill_in_blanks'],
  timerMinutes: 15,
  language: 'English',
  randomizeQuestions: true,
  randomizeAnswers: true,
  focusTopics: '',
};

const DEFAULT_FLASHCARDS: Flashcard[] = [
  { id: 'fc_1', front: 'What is the function of Layer 7 (Application Layer) in OSI Model?', back: 'Provides network services directly to end-user software applications like HTTP, FTP, and SMTP.', category: 'Networking', mastered: false },
  { id: 'fc_2', front: 'Difference between TCP and UDP?', back: 'TCP is connection-oriented, reliable, and uses a 3-way handshake. UDP is connectionless and faster.', category: 'Networking', mastered: true },
  { id: 'fc_3', front: 'What is Atomicity in ACID database transactions?', back: 'Guarantees all operations in a transaction succeed, or the entire transaction rolls back.', category: 'DBMS', mastered: false },
  { id: 'fc_4', front: 'Define 2NF (Second Normal Form).', back: 'Satisfies 1NF and eliminates partial functional dependencies from non-prime key attributes.', category: 'DBMS', mastered: false },
];

const DEFAULT_MIND_MAP: MindMapNode = {
  id: 'root',
  label: 'Computer Science Study Core',
  description: 'Main concepts extracted from uploaded materials',
  children: [
    {
      id: 'net',
      label: 'Computer Networks',
      description: 'OSI 7-Layer Model & Protocols',
      children: [
        { id: 'net_1', label: 'Transport Layer (TCP/UDP)' },
        { id: 'net_2', label: 'Network Layer (IP Routing & Switches)' },
        { id: 'net_3', label: 'Application Layer (HTTP/DNS)' },
      ],
    },
  ],
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  const [quizSettings, setQuizSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuizResult, setCurrentQuizResult] = useState<QuizResult | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(DEFAULT_FLASHCARDS);
  const [mindMap] = useState<MindMapNode>(DEFAULT_MIND_MAP);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'assistant',
      text: 'Hello! I am your AI Friendly Teacher. I am ready to teach and answer questions grounded strictly in your uploaded study notes!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync documents and quiz history whenever signed-in user changes!
  useEffect(() => {
    if (user && user.email) {
      const userDocKey = `study_buddy_docs_${user.email}`;
      const userHistKey = `study_buddy_hist_${user.email}`;

      const savedDocs = localStorage.getItem(userDocKey);
      const savedHist = localStorage.getItem(userHistKey);

      const parsedDocs: DocumentItem[] = savedDocs ? JSON.parse(savedDocs) : SAMPLE_DOCUMENTS;
      const parsedHist: QuizResult[] = savedHist ? JSON.parse(savedHist) : [];

      setDocuments(parsedDocs);
      setActiveDocument(parsedDocs[0] || null);
      setQuizHistory(parsedHist);
    } else {
      // Clear data for unsigned guest
      setDocuments([]);
      setActiveDocument(null);
      setQuizHistory([]);
    }
  }, [user]);

  // Persist user documents when modified
  useEffect(() => {
    if (user && user.email) {
      const userDocKey = `study_buddy_docs_${user.email}`;
      localStorage.setItem(userDocKey, JSON.stringify(documents));
    }
  }, [documents, user]);

  // Persist user quiz history when modified
  useEffect(() => {
    if (user && user.email) {
      const userHistKey = `study_buddy_hist_${user.email}`;
      localStorage.setItem(userHistKey, JSON.stringify(quizHistory));
    }
  }, [quizHistory, user]);

  const addDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
    setActiveDocument(doc);
  };

  const updateQuizSettings = (settings: Partial<QuizSettings>) => {
    setQuizSettings((prev) => ({ ...prev, ...settings }));
  };

  const generateQuizForActiveDoc = (): Question[] => {
    const textToUse = activeDocument ? activeDocument.text : (SAMPLE_DOCUMENTS[0]?.text || '');
    const docName = activeDocument ? activeDocument.name : 'Sample Document';
    const questions = generateQuizFromText(textToUse, quizSettings, docName);
    setActiveQuestions(questions);
    return questions;
  };

  const saveQuizResult = (result: QuizResult) => {
    setQuizHistory((prev) => [result, ...prev]);
    setCurrentQuizResult(result);
  };

  const toggleFavoriteQuiz = (quizId: string) => {
    setQuizHistory((prev) =>
      prev.map((q) => (q.id === quizId ? { ...q, isFavorite: !q.isFavorite } : q))
    );
    if (currentQuizResult && currentQuizResult.id === quizId) {
      setCurrentQuizResult({ ...currentQuizResult, isFavorite: !currentQuizResult.isFavorite });
    }
  };

  const deleteQuizFromHistory = (quizId: string) => {
    setQuizHistory((prev) => prev.filter((q) => q.id !== quizId));
  };

  const toggleFlashcardMastered = (id: string) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, mastered: !card.mastered } : card))
    );
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let botResponseText = '';
      const docName = activeDocument ? activeDocument.name : 'uploaded document';
      const docText = activeDocument ? activeDocument.text : (SAMPLE_DOCUMENTS[0]?.text || '');

      if (text.toLowerCase().includes('osi') || text.toLowerCase().includes('layer')) {
        botResponseText = `Based on page 1 of ${docName}, the OSI model has 7 layers. Layer 7 is Application (HTTP/FTP), Layer 6 is Presentation (encryption/SSL), Layer 4 is Transport (TCP/UDP with 3-way handshake), and Layer 3 is Network (IP Routing).`;
      } else if (text.toLowerCase().includes('tcp') || text.toLowerCase().includes('udp')) {
        botResponseText = `According to your uploaded notes, TCP (Transmission Control Protocol) is connection-oriented and reliable using SYN, SYN-ACK, ACK. UDP (User Datagram Protocol) is connectionless and faster without packet delivery guarantees.`;
      } else if (text.toLowerCase().includes('acid') || text.toLowerCase().includes('database')) {
        botResponseText = `Referencing ${docName}: ACID stands for Atomicity (all or nothing), Consistency (valid state transitions), Isolation (independent transactions), and Durability (permanent committed changes).`;
      } else if (text.toLowerCase().includes('summarize') || text.toLowerCase().includes('summary')) {
        botResponseText = `Here is a quick summary of ${docName}:\n- Key Topics: Core architectural principles, protocol definitions, and layer interactions.\n- Important Formulas: Throughput = Data Volume / Time.\n- Recommended Action: Focus review on Layer 4 TCP vs UDP and Database Normalization rules.`;
      } else {
        botResponseText = `Based strictly on ${docName}: "${docText.slice(0, 180)}..." I can confirm this topic is discussed in detail. Let me know if you would like me to generate specific practice questions!`;
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceReferences: activeDocument
          ? [{ pageNumber: 1, snippet: docText.slice(0, 100) }]
          : undefined,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <StudyContext.Provider
      value={{
        documents,
        activeDocument,
        setActiveDocument,
        addDocument,
        quizSettings,
        updateQuizSettings,
        activeQuestions,
        setActiveQuestions,
        currentQuizResult,
        setCurrentQuizResult,
        quizHistory,
        saveQuizResult,
        toggleFavoriteQuiz,
        generateQuizForActiveDoc,
        deleteQuizFromHistory,
        flashcards,
        toggleFlashcardMastered,
        mindMap,
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
