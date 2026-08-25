import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { StudyProvider } from './contexts/StudyContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/UploadPage';
import { QuizSettingsPage } from './pages/QuizSettingsPage';
import { QuizPlayerPage } from './pages/QuizPlayerPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { FavQuizzesPage } from './pages/FavQuizzesPage';
import { UploadedPdfsPage } from './pages/UploadedPdfsPage';
import { AssistantPage } from './pages/AssistantPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#f6fbf8] text-slate-900 font-sans">
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/quiz-settings" element={<QuizSettingsPage />} />
                  <Route path="/quiz" element={<QuizPlayerPage />} />
                  <Route path="/quiz-results" element={<QuizResultsPage />} />
                  <Route path="/favorites" element={<FavQuizzesPage />} />
                  <Route path="/uploaded-pdfs" element={<UploadedPdfsPage />} />
                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </main>
              <Footer />
              <AuthModal />
            </div>
          </Router>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
