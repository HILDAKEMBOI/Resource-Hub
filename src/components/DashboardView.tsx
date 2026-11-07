import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Resource, EventItem, TaskItem, PlatformStats } from '../types';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckSquare,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  Bookmark,
  Plus,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  stats: PlatformStats | null;
  recentResources: Resource[];
  upcomingEvents: EventItem[];
  tasks: TaskItem[];
  onNavigateTab: (tab: 'dashboard' | 'resources' | 'events' | 'tasks') => void;
  onOpenResource: (resource: Resource) => void;
  onToggleTask: (taskId: string, current: boolean) => void;
  onToggleEventRSVP: (eventId: string) => void;
  onOpenAuth: () => void;
  onOpenNewResource: () => void;
  onOpenNewEvent: () => void;
  onOpenNewTask: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentResources,
  upcomingEvents,
  tasks,
  onNavigateTab,
  onOpenResource,
  onToggleTask,
  onToggleEventRSVP,
  onOpenAuth,
  onOpenNewResource,
  onOpenNewEvent,
  onOpenNewTask,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {todayStr}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {user ? <span className="capitalize text-blue-400">{user.username}</span> : 'Scholar'}! 🎓
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Welcome to your centralized academic portal. Discover peer-reviewed course materials, sync with campus events, and conquer your weekly assignment deadlines.
            </p>
          </div>

          {/* Quick Hub Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            {user ? (
              <>
                <button
                  onClick={onOpenNewResource}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Share Resource</span>
                </button>
                <button
                  onClick={onOpenNewEvent}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Host Event</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
              >
                <span>Sign In to Track Tasks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('resources')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Library Vault</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.total_resources ?? 8}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <span className="text-emerald-400 font-semibold">{stats?.total_saves ?? 1800}+</span>
            <span>peer saves</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('events')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Events</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.total_events ?? 6}</div>
          <div className="flex items-center gap-1 text-xs text-purple-300 mt-1">
            <span>Workshops, hackathons & mixers</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('tasks')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {user ? `${pendingTasks.length} pending` : '5 active'}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            {user ? `${taskProgress}% completed` : 'Sign in to sync'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Network</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.total_students ?? 3}+</div>
          <div className="flex items-center gap-1 text-xs text-amber-300 mt-1">
            <span>Across STEM & Humanities</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks + Trending Resources (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Tasks Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Academic To-Do List</h3>
                  <p className="text-xs text-slate-400">Stay on top of problem sets and milestones</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user && (
                  <button
                    onClick={onOpenNewTask}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Add Task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task list preview */}
            {!user ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-800/30 border border-slate-800/80">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <p className="text-sm font-semibold text-slate-300">Keep track of your coursework</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Sign in or use a 1-click demo account to create and check off tasks with course tags and due dates.
                </p>
                <button
                  onClick={onOpenAuth}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Sign In / Demo Login
                </button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-slate-800/30 border border-slate-800/80">
                <p className="text-sm font-medium text-slate-400">No tasks in your queue!</p>
                <button
                  onClick={onOpenNewTask}
                  className="mt-2 text-xs font-bold text-emerald-400 hover:underline"
                >
                  + Add your first assignment
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      task.completed
                        ? 'bg-slate-900/50 border-slate-800/50 opacity-60'
                        : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleTask(task.id, task.completed)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 hover:border-emerald-400 bg-slate-800'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {task.course_tag}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Due {task.due_date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        task.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Learning Materials */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Recommended Course Materials</h3>
                  <p className="text-xs text-slate-400">Peer-tested textbooks, video lectures & guides</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('resources')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentResources.slice(0, 3).map(res => (
                <div
                  key={res.id}
                  onClick={() => onOpenResource(res)}
                  className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {res.category}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300 font-semibold">
                        {res.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition truncate">
                      {res.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{res.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>By {res.author_name}</span>
                      <span>•</span>
                      <span>{res.saved_count} saves</span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Events Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upcoming Campus Events</h3>
                  <p className="text-xs text-slate-400">Chronological calendar feed</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('events')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition cursor-pointer"
              >
                <span>Full Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {upcomingEvents.slice(0, 3).map(event => {
                const dateParts = event.date.split('-');
                const month = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
                const dayNum = dateParts[2];

                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition flex items-start gap-3.5"
                  >
                    {/* Date badge */}
                    <div className="w-12 h-14 rounded-xl bg-purple-950/60 border border-purple-800/40 flex flex-col items-center justify-center shrink-0 text-center">
                      <span className="text-[10px] font-bold uppercase text-purple-300">{month}</span>
                      <span className="text-lg font-black text-white leading-none">{dayNum}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {event.category}
                        </span>
                        {event.is_virtual && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-blue-500/20 text-blue-300">
                            Virtual
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {event.start_time}
                        </span>
                        <span>•</span>
                        <span className="truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {event.venue}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {event.attendees_count ?? event.attendees.length} attending
                        </span>
                        <button
                          onClick={() => {
                            if (!user) onOpenAuth();
                            else onToggleEventRSVP(event.id);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            event.is_attending
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-700/80 hover:bg-purple-600 text-slate-200 hover:text-white'
                          }`}
                        >
                          {event.is_attending ? 'Attending ✓' : 'RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Academic Tip of the Day */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Study Pro Tip</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Break large exam topics into 25-minute Pomodoro intervals. Use our Resource Hub cheatsheets to review definitions before attending campus workshops!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
