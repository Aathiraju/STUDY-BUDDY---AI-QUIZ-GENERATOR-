import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Brain,
  Zap,
  Flame,
  User,
  FileText,
  LayoutDashboard,
  Upload,
  Star,
  GraduationCap,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStudy } from '../../contexts/StudyContext';

export const Navbar: React.FC = () => {
  const { user, logout, setOpenAuthModal } = useAuth();
  const { activeDocument } = useStudy();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Notes', path: '/upload', icon: Upload },
    { label: 'Uploaded PDFs', path: '/uploaded-pdfs', icon: FileText },
    { label: 'Fav Quizzes', path: '/favorites', icon: Star },
    { label: 'Friendly Teacher', path: '/assistant', icon: GraduationCap },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm">
      {/* SaaS Website Main Top Header */}
      <div className="w-full bg-white/95 backdrop-blur-xl border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="/logo.png"
              alt="Study Buddy Logo"
              className="width-height30 h-10 w-auto object-contain group-hover:scale-105 transition-all"
            />
          </Link>

          {/* Desktop Web Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Active PDF Status Pill */}
            {activeDocument && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 font-medium">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900 font-outfit max-w-[140px] truncate">{activeDocument.name}</span>
              </div>
            )}

            {/* User Profile Avatar Link & Sign Out Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all ring-2 ring-emerald-400/40 hover:scale-105"
                  title="View Profile Page"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenAuthModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile Web Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-emerald-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Web Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 border-t border-emerald-100 bg-white space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all mt-2"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out ({user.email})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
