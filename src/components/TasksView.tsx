import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TaskItem } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit2,
  X,
  Check,
} from 'lucide-react';

interface TasksViewProps {
  tasks: TaskItem[];
  loading: boolean;
  onToggleTask: (taskId: string, current: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  onOpenNewTask: () => void;
  onOpenAuth: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  loading,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onOpenNewTask,
  onOpenAuth,
}) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'high' | 'today'>('all');
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineCourse, setInlineCourse] = useState('CS 101');
  const [inlinePriority, setInlinePriority] = useState<TaskItem['priority']>('medium');
  const [inlineDueDate, setInlineDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [addingInline, setAddingInline] = useState(false);

  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editPriority, setEditPriority] = useState<TaskItem['priority']>('medium');
  const [editDueDate, setEditDueDate] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggle = (task: TaskItem) => {
    const willBeCompleted = !task.completed;
    onToggleTask(task.id, task.completed);

    if (willBeCompleted) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore if canvas not supported
      }
      showToast('Assignment completed! Great job! 🎉', 'success');
    }
  };

  const handleInlineAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      onOpenAuth();
      return;
    }

    if (!inlineTitle.trim()) return;

    setAddingInline(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: inlineTitle.trim(),
          course_tag: inlineCourse.trim() || 'General',
          priority: inlinePriority,
          due_date: inlineDueDate,
        }),
      });

      if (!res.ok) throw new Error('Failed to create task');

      const newTask = await res.json();
      showToast('Task added to schedule!', 'success');
      setInlineTitle('');
    } catch {
      showToast('Failed to add task', 'error');
    } finally {
      setAddingInline(false);
    }
  };

  const startEdit = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditCourse(task.course_tag);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date);
  };

  const saveEdit = (taskId: string) => {
    if (!editTitle.trim()) return;
    onUpdateTask(taskId, {
      title: editTitle.trim(),
      course_tag: editCourse.trim() || 'General',
      priority: editPriority,
      due_date: editDueDate,
    });
    setEditingTaskId(null);
    showToast('Task updated!', 'success');
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    if (activeFilter === 'high') return task.priority === 'high';
    if (activeFilter === 'today') return task.due_date === todayStr;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
              Productivity & Assignments
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Task Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Organize coursework, problem sets, and project milestones by course code and priority. Never miss an exam or submission deadline.
          </p>
        </div>

        {/* Progress gauge card */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Completion Rate</span>
            <span className="text-xs font-black text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>{completedCount} completed</span>
            <span>{tasks.length - completedCount} remaining</span>
          </div>
        </div>
      </div>

      {/* Inline Quick Add Task Box */}
      {user ? (
        <form
          onSubmit={handleInlineAdd}
          className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Quick Add Assignment / Study Task</span>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            <input
              type="text"
              required
              placeholder="What needs to get done? (e.g. Read Chapters 3-4 for midterm)"
              value={inlineTitle}
              onChange={e => setInlineTitle(e.target.value)}
              className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Course (CS 101)"
                value={inlineCourse}
                onChange={e => setInlineCourse(e.target.value)}
                className="w-28 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <select
                value={inlinePriority}
                onChange={e => setInlinePriority(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={inlineDueDate}
                onChange={e => setInlineDueDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={addingInline}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sign In to Save & Sync Your Tasks</h4>
              <p className="text-xs text-slate-400">Keep your academic assignments synchronized across devices.</p>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer shrink-0"
          >
            Sign In / Demo Login
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({tasks.length - completedCount})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Done ({completedCount})
          </button>
          <button
            onClick={() => setActiveFilter('high')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'high'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setActiveFilter('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'today'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Due Today
          </button>
        </div>

        {user && (
          <button
            onClick={onOpenNewTask}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Detailed Modal</span>
          </button>
        )}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-3">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50" />
          <h3 className="text-base font-bold text-slate-200">No tasks in this category!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are all caught up or no assignments match your filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const isEditing = editingTaskId === task.id;
            const isOverdue = !task.completed && task.due_date < todayStr;
            const isDueToday = !task.completed && task.due_date === todayStr;

            if (isEditing) {
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-850 border border-emerald-500/40 space-y-3"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={editCourse}
                      onChange={e => setEditCourse(e.target.value)}
                      placeholder="Course Tag"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                    />
                    <select
                      value={editPriority}
                      onChange={e => setEditPriority(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={e => setEditDueDate(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
                    />
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                  task.completed
                    ? 'bg-slate-900/50 border-slate-800/50 opacity-60'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Checkbox & Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggle(task)}
                    className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black'
                        : 'border-slate-600 hover:border-emerald-400 bg-slate-800/80 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {task.course_tag}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {isOverdue && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
                          <AlertCircle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      )}

                      {isDueToday && (
                        <span className="text-[10px] font-bold text-amber-400">
                          • Due Today
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold transition ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Due {task.due_date}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
