import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EventItem, Resource } from '../types';
import {
  X,
  User as UserIcon,
  Calendar,
  Bookmark,
  CheckCircle2,
  Edit3,
  ExternalLink,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResource?: (res: Resource) => void;
}

interface ProfileData {
  user: {
    id: string;
    username: string;
    email: string;
    major: string;
    bio: string;
    avatar_color: string;
    created_at: string;
  };
  stats: {
    posted_events_count: number;
    saved_resources_count: number;
    completed_tasks_count: number;
    total_tasks_count: number;
  };
  posted_events: EventItem[];
  saved_resources: Resource[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSelectResource }) => {
  const { user, token, updateProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'events' | 'edit'>('overview');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit form state
  const [editMajor, setEditMajor] = useState(user?.major || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setEditMajor(user.major || '');
      setEditBio(user.bio || '');
      fetchUserProfile();
    }
  }, [isOpen, user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ major: editMajor, bio: editBio });
    setSaving(false);
    if (res.success) {
      showToast('Profile updated successfully!', 'success');
      setActiveTab('overview');
      fetchUserProfile();
    } else {
      showToast(res.error || 'Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    onClose();
  };

  const formattedJoinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner with gradient */}
        <div className="relative h-28 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-5 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide uppercase">
              Student ID Card
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pt-0 pb-4 relative -mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-slate-800">
          <div className="flex items-end gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${user.avatar_color || 'from-blue-500 to-indigo-600'} p-0.5 shadow-xl border-4 border-slate-900 flex items-center justify-center text-white font-black text-2xl uppercase`}>
              {user.username.slice(0, 2)}
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white capitalize">{user.username}</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
              <p className="text-xs text-blue-400 font-semibold mt-0.5">{user.major || 'Undergraduate'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{activeTab === 'edit' ? 'View Details' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-slate-800 bg-slate-900/60 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Academic Overview
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Materials ({profileData?.saved_resources.length ?? '...'})</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'events'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Posted Events ({profileData?.posted_events.length ?? '...'})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio block */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About & Academic Goals</h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {user.bio || 'No academic bio added yet. Click "Edit Profile" above to describe your major, research focus, or campus clubs!'}
                </p>
                <div className="mt-3 text-[11px] text-slate-400">
                  Member of Student Resource Hub since {formattedJoinDate}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-900/30 text-center">
                  <Bookmark className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                  <div className="text-2xl font-black text-white">{profileData?.stats.saved_resources_count ?? 0}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Saved Resources</div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-900/30 text-center">
                  <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                  <div className="text-2xl font-black text-white">{profileData?.stats.posted_events_count ?? 0}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Organized Events</div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-900/30 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                  <div className="text-2xl font-black text-white">{profileData?.stats.completed_tasks_count ?? 0}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Tasks Completed</div>
                </div>
              </div>

              {/* Quick links summary */}
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-200">Study Streak & Engagement</h5>
                    <p className="text-xs text-slate-400">Keep bookmarking course materials and tracking your deadlines!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-10 text-slate-400 text-sm">Loading saved items...</div>
              ) : !profileData?.saved_resources.length ? (
                <div className="text-center py-12 text-slate-400">
                  <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                  <p className="text-sm font-medium">No saved materials yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Browse the Resource Hub and click the bookmark icon on any guide or cheatsheet!</p>
                </div>
              ) : (
                profileData.saved_resources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                            {res.category}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                            {res.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate">{res.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{res.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-10 text-slate-400 text-sm">Loading events...</div>
              ) : !profileData?.posted_events.length ? (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                  <p className="text-sm font-medium">You haven&apos;t posted any events yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Host a study group, project session, or workshop for your peers!</p>
                </div>
              ) : (
                profileData.posted_events.map(ev => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {ev.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {ev.day_name}, {ev.date}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{ev.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {ev.start_time} - {ev.end_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {ev.venue}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {ev.attendees.length} Attendees
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Major / Focus
                </label>
                <input
                  type="text"
                  required
                  value={editMajor}
                  onChange={e => setEditMajor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Electrical Engineering & Computer Sciences"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student Bio & Campus Activities
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Tell peers what you study, clubs you organize, or topics you love discussing."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
