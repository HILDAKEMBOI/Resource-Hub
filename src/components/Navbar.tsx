import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  Plus,
  LogIn,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'resources' | 'events' | 'tasks';
  onSelectTab: (tab: 'dashboard' | 'resources' | 'events' | 'tasks') => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenNewResource: () => void;
  onOpenNewEvent: () => void;
  onOpenNewTask: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenProfile,
  onOpenNewResource,
  onOpenNewEvent,
  onOpenNewTask,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources' as const, label: 'Learning Hub', icon: BookOpen },
    { id: 'events' as const, label: 'Campus Events', icon: Calendar },
    { id: 'tasks' as const, label: 'My Tasks', icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20 group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition">
                  Student Hub
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Resources • Events • Tasks</p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCreateDropdownOpen(!createDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2 px-3 sm:px-3.5 rounded-xl shadow-md shadow-blue-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Contribute</span>
            </button>

            {createDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCreateDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-scale-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Actions
                  </div>

                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      if (!user) onOpenAuth('login');
                      else onOpenNewResource();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <div>
                      <div>Upload Resource</div>
                      <div className="text-[10px] text-slate-400 font-normal">PDF, Video, Code, Guide</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      if (!user) onOpenAuth('login');
                      else onOpenNewEvent();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <div>Host Campus Event</div>
                      <div className="text-[10px] text-slate-400 font-normal">Workshop, Study, Hackathon</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      if (!user) onOpenAuth('login');
                      else onOpenNewTask();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Add Task / Assignment</div>
                      <div className="text-[10px] text-slate-400 font-normal">Coursework & Deadlines</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile or Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setCreateDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white capitalize leading-tight truncate max-w-[100px]">
                    {user.username}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                    {user.major || 'Student'}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${user.avatar_color || 'from-blue-500 to-indigo-600'} text-white font-extrabold text-xs flex items-center justify-center uppercase shadow`}>
                  {user.username.slice(0, 2)}
                </div>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in">
                    <div className="p-2 border-b border-slate-800 mb-1">
                      <div className="text-xs font-bold text-white capitalize">{user.username}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      <span>Student Profile & Saved</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSelectTab('tasks');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>My Academic Tasks</span>
                    </button>

                    <div className="my-1 border-t border-slate-800" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-xl transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-blue-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {!user && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-2.5 rounded-xl transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
