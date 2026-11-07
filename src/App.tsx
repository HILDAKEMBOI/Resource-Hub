import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ResourcesView } from './components/ResourcesView';
import { EventsView } from './components/EventsView';
import { TasksView } from './components/TasksView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CreateResourceModal } from './components/CreateResourceModal';
import { CreateEventModal } from './components/CreateEventModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { Resource, EventItem, TaskItem, PlatformStats } from './types';
import { GraduationCap, Heart, BookOpen, Calendar, CheckSquare, Sparkles } from 'lucide-react';

function StudentHubApp() {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'resources' | 'events' | 'tasks'>('dashboard');

  // Data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);

  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Filter states
  const [resourceCategory, setResourceCategory] = useState('All');
  const [resourceType, setResourceType] = useState('All');
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceSort, setResourceSort] = useState('recent');

  const [eventCategory, setEventCategory] = useState('All');
  const [eventSearch, setEventSearch] = useState('');
  const [eventTimeframe, setEventTimeframe] = useState('all');

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [createResourceOpen, setCreateResourceOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [detailResource, setDetailResource] = useState<Resource | null>(null);

  // Fetch Resources
  const fetchResources = useCallback(async () => {
    setResourcesLoading(true);
    try {
      const params = new URLSearchParams();
      if (resourceCategory !== 'All') params.append('category', resourceCategory);
      if (resourceType !== 'All') params.append('type', resourceType);
      if (resourceSearch.trim()) params.append('q', resourceSearch.trim());
      if (resourceSort) params.append('sortBy', resourceSort);

      const res = await fetch(`/api/resources?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setResourcesLoading(false);
    }
  }, [resourceCategory, resourceType, resourceSearch, resourceSort, token]);

  // Fetch Events
  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const params = new URLSearchParams();
      if (eventCategory !== 'All') params.append('category', eventCategory);
      if (eventSearch.trim()) params.append('q', eventSearch.trim());
      if (eventTimeframe !== 'all') params.append('timeframe', eventTimeframe);

      const res = await fetch(`/api/events?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setEventsLoading(false);
    }
  }, [eventCategory, eventSearch, eventTimeframe, token]);

  // Fetch Tasks (only if authenticated)
  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      return;
    }
    setTasksLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  }, [token]);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load platform stats:', err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Action handlers
  const handleToggleBookmark = async (resourceId: string) => {
    if (!token) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/resources/${resourceId}/bookmark`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResources(prev =>
          prev.map(r =>
            r.id === resourceId
              ? { ...r, is_saved: data.bookmarked, saved_count: data.saved_count }
              : r
          )
        );
        if (detailResource && detailResource.id === resourceId) {
          setDetailResource(prev =>
            prev
              ? { ...prev, is_saved: data.bookmarked, saved_count: data.saved_count }
              : null
          );
        }
        showToast(
          data.bookmarked ? 'Saved to your profile bookmarks!' : 'Removed from bookmarks',
          'success'
        );
      }
    } catch {
      showToast('Error updating bookmark', 'error');
    }
  };

  const handleToggleEventRSVP = async (eventId: string) => {
    if (!token) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(prev =>
          prev.map(e =>
            e.id === eventId
              ? {
                  ...e,
                  is_attending: data.attending,
                  attendees_count: data.attendee_count,
                }
              : e
          )
        );
        showToast(
          data.attending ? 'RSVP confirmed! See you there!' : 'RSVP cancelled',
          'info'
        );
      }
    } catch {
      showToast('Error updating RSVP', 'error');
    }
  };

  const handleToggleTask = async (taskId: string, current: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !current }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch {
      showToast('Error updating task', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        showToast('Task removed from queue', 'info');
      }
    } catch {
      showToast('Error deleting task', 'error');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskItem>) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch {
      showToast('Error updating task', 'error');
    }
  };

  const openAuthWithMode = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={openAuthWithMode}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenNewResource={() => setCreateResourceOpen(true)}
        onOpenNewEvent={() => setCreateEventOpen(true)}
        onOpenNewTask={() => setCreateTaskOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            recentResources={resources}
            upcomingEvents={events}
            tasks={tasks}
            onNavigateTab={setCurrentTab}
            onOpenResource={setDetailResource}
            onToggleTask={handleToggleTask}
            onToggleEventRSVP={handleToggleEventRSVP}
            onOpenAuth={() => openAuthWithMode('login')}
            onOpenNewResource={() => setCreateResourceOpen(true)}
            onOpenNewEvent={() => setCreateEventOpen(true)}
            onOpenNewTask={() => setCreateTaskOpen(true)}
          />
        )}

        {currentTab === 'resources' && (
          <ResourcesView
            resources={resources}
            loading={resourcesLoading}
            selectedCategory={resourceCategory}
            onSelectCategory={setResourceCategory}
            selectedType={resourceType}
            onSelectType={setResourceType}
            searchQuery={resourceSearch}
            onSearchChange={setResourceSearch}
            sortBy={resourceSort}
            onSortChange={setResourceSort}
            onOpenResource={setDetailResource}
            onToggleBookmark={handleToggleBookmark}
            onOpenNewResource={() => setCreateResourceOpen(true)}
            onOpenAuth={() => openAuthWithMode('login')}
          />
        )}

        {currentTab === 'events' && (
          <EventsView
            events={events}
            loading={eventsLoading}
            selectedCategory={eventCategory}
            onSelectCategory={setEventCategory}
            searchQuery={eventSearch}
            onSearchChange={setEventSearch}
            timeframe={eventTimeframe}
            onTimeframeChange={setEventTimeframe}
            onToggleRSVP={handleToggleEventRSVP}
            onOpenNewEvent={() => setCreateEventOpen(true)}
            onOpenAuth={() => openAuthWithMode('login')}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            loading={tasksLoading}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
            onOpenNewTask={() => setCreateTaskOpen(true)}
            onOpenAuth={() => openAuthWithMode('login')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300">Student Resource Hub</span>
            <span>—</span>
            <span>Empowering campus collaboration, learning materials & productivity</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('resources')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              Library Vault
            </button>
            <button
              onClick={() => setCurrentTab('events')}
              className="hover:text-purple-400 transition cursor-pointer"
            >
              Events Calendar
            </button>
            <button
              onClick={() => setCurrentTab('tasks')}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Task Tracker
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSelectResource={setDetailResource}
      />

      <CreateResourceModal
        isOpen={createResourceOpen}
        onClose={() => setCreateResourceOpen(false)}
        onCreated={newRes => {
          setResources(prev => [newRes, ...prev]);
          fetchStats();
        }}
      />

      <CreateEventModal
        isOpen={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onCreated={newEvent => {
          setEvents(prev => [newEvent, ...prev]);
          fetchStats();
        }}
      />

      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={newTask => {
          setTasks(prev => [newTask, ...prev]);
        }}
      />

      <ResourceDetailModal
        resource={detailResource}
        isOpen={Boolean(detailResource)}
        onClose={() => setDetailResource(null)}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StudentHubApp />
      </AuthProvider>
    </ToastProvider>
  );
}
