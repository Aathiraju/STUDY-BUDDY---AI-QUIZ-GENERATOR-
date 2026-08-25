export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_blanks' | 'short_answer';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuizLanguage = 'English' | 'Tamil' | 'Hindi' | 'Spanish' | 'French';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation: string;
  referenceSnippet: string;
  pageNumber: number;
  relatedConcept: string;
  whyWrongOptions?: { [key: string]: string };
}

export interface QuizSettings {
  difficulty: DifficultyLevel;
  questionCount: number;
  questionTypes: QuestionType[];
  timerMinutes: number; // 0 for no timer
  language: QuizLanguage;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  focusTopics: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResult {
  id: string;
  documentId: string;
  documentName: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  timeTakenSeconds: number;
  difficulty: DifficultyLevel;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Fail';
  userAnswers: UserAnswer[];
  questions: Question[];
  isFavorite?: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  text: string;
  pageCount: number;
  estimatedReadingTimeMinutes: number;
  uploadDate: string;
  fileSizeFormatted: string;
  previewSnippet: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindMapNode[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceReferences?: {
    pageNumber: number;
    snippet: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  studyGoal: string;
  preferredLanguage: QuizLanguage;
  preferredDifficulty: DifficultyLevel;
  darkMode: boolean;
  notifications: boolean;
  lastActiveDate: string;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AnalyticsData {
  weeklyScores: { day: string; score: number; count: number }[];
  topicPerformance: { topic: string; accuracy: number }[];
  difficultyPerformance: { difficulty: string; score: number }[];
  totalStudyTimeMinutes: number;
  quizzesCompleted: number;
  averageAccuracy: number;
  recommendations: string[];
}
