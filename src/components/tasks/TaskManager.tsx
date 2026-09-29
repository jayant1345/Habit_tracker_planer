'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, Priority, TaskStatus } from '@/types';
import {
  KanbanSquare,
  ListTodo,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const PRIORITY_BADGES: Record<Priority, { label: string; class: string }> = {
  urgent: { label: 'Urgent', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  high: { label: 'High', class: 'bg-gold-500/20 text-gold-300 border-gold-500/30' },
  medium: { label: 'Medium', class: 'bg-peacock-500/20 text-peacock-300 border-peacock-500/30' },
  low: { label: 'Low', class: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};

export function TaskManager() {
  const {
    tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
  } = useApp();

  const [activeView, setActiveView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [tagsInput, setTagsInput] = useState('Productivity, Architecture');

  // New subtask input for inline addition
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<Record<string, string>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setEstimatedMinutes(30);
    setTagsInput('Sprint, DeepWork');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description || '');
    setPriority(t.priority);
    setStatus(t.status);
    setDueDate(t.due_date ? format(parseISO(t.due_date), 'yyyy-MM-dd') : '');
    setEstimatedMinutes(t.estimated_minutes || 30);
    setTagsInput(t.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        estimated_minutes: estimatedMinutes,
        tags,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        estimated_minutes: estimatedMinutes,
        actual_minutes: 0,
        tags,
        subtasks: [],
      });
    }

    setIsModalOpen(false);
  };

  const handleAddInlineSubtask = (taskId: string) => {
    const text = newSubtaskTitles[taskId]?.trim();
    if (!text) return;
    addSubtask(taskId, text);
    setNewSubtaskTitles((prev) => ({ ...prev, [taskId]: '' }));
  };

  // Calculate Subtask Progress %
  const getSubtaskProgress = (t: Task) => {
    if (!t.subtasks || t.subtasks.length === 0) return t.status === 'completed' ? 100 : 0;
    const done = t.subtasks.filter((s) => s.is_completed).length;
    return Math.round((done / t.subtasks.length) * 100);
  };

  // Calendar View Data
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const monthDays = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & View Switcher */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <KanbanSquare className="h-6 w-6 text-gold-400" />
            <span>Activity & Task Pipeline</span>
          </h2>
          <p className="text-xs text-peacock-300">
            Organize complex work with subtask checklists, Kanban boards, and deadline calendars.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Switcher */}
          <div className="flex rounded-xl border border-peacock-800 bg-peacock-950 p-1">
            <button
              onClick={() => setActiveView('kanban')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeView === 'kanban'
                  ? 'bg-peacock-800 text-gold-300 shadow-sm'
                  : 'text-peacock-400 hover:text-white'
              }`}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeView === 'list'
                  ? 'bg-peacock-800 text-gold-300 shadow-sm'
                  : 'text-peacock-400 hover:text-white'
              }`}
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeView === 'calendar'
                  ? 'bg-peacock-800 text-gold-300 shadow-sm'
                  : 'text-peacock-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-3.5 py-2 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400 hover:to-gold-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((colStatus) => {
            const columnTasks = tasks.filter((t) => t.status === colStatus);
            const colTitles: Record<TaskStatus, { label: string; color: string }> = {
              todo: { label: 'To Do Backlog', color: 'text-peacock-300' },
              in_progress: { label: 'In Progress', color: 'text-gold-300' },
              completed: { label: 'Completed', color: 'text-feather-400' },
            };

            return (
              <div
                key={colStatus}
                className="rounded-2xl border border-peacock-800/80 bg-peacock-950/60 p-4 backdrop-blur-sm shadow-lg flex flex-col min-h-[420px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-peacock-800/80 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${colTitles[colStatus].color}`}>
                      {colTitles[colStatus].label}
                    </span>
                    <span className="rounded-full bg-peacock-900 px-2 py-0.5 text-[10px] font-bold text-peacock-300 border border-peacock-700">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnTasks.map((task) => {
                    const progress = getSubtaskProgress(task);
                    const isExpanded = expandedTasks[task.id];

                    return (
                      <div
                        key={task.id}
                        className="group relative rounded-xl border border-peacock-800/90 bg-peacock-900/80 p-3.5 shadow-md transition hover:border-gold-500/40"
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              PRIORITY_BADGES[task.priority].class
                            }`}
                          >
                            {PRIORITY_BADGES[task.priority].label}
                          </span>

                          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => openEditModal(task)}
                              title="Edit task"
                              className="rounded p-1 text-peacock-400 hover:text-white"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete task"
                              className="rounded p-1 text-peacock-400 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <h4 className="mt-2 text-xs font-bold text-white leading-snug">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="mt-1 text-[11px] text-peacock-300 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Progress bar for subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-2.5">
                            <div className="flex justify-between text-[10px] text-peacock-300 mb-1">
                              <span>Checklist</span>
                              <span>
                                {task.subtasks.filter((s) => s.is_completed).length}/{task.subtasks.length} ({progress}%)
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-peacock-950 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-feather-400 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {task.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-peacock-950/80 px-1.5 py-0.5 text-[9px] text-peacock-300 border border-peacock-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Footer: Due date & status transitions */}
                        <div className="mt-3 flex items-center justify-between border-t border-peacock-800/80 pt-2 text-[10px] text-peacock-400">
                          {task.due_date && (
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gold-400" />
                              <span>{format(parseISO(task.due_date), 'MMM d')}</span>
                            </span>
                          )}

                          {/* Quick Column Transition Buttons */}
                          <div className="flex items-center space-x-1">
                            {colStatus !== 'todo' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'todo')}
                                title="Move to To Do"
                                className="rounded bg-peacock-950 px-1.5 py-0.5 text-[9px] text-peacock-300 hover:text-white"
                              >
                                ← ToDo
                              </button>
                            )}
                            {colStatus !== 'in_progress' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                title="Move to In Progress"
                                className="rounded bg-peacock-950 px-1.5 py-0.5 text-[9px] text-gold-400 hover:bg-gold-500/20"
                              >
                                In Progress
                              </button>
                            )}
                            {colStatus !== 'completed' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'completed')}
                                title="Mark Completed"
                                className="rounded bg-feather-600/30 px-1.5 py-0.5 text-[9px] font-bold text-feather-400 hover:bg-feather-500/40"
                              >
                                Done ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-peacock-800/60 p-6 text-center text-xs text-peacock-500">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: DETAILED LIST WITH SUBTASK CHECKLISTS */}
      {activeView === 'list' && (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isExpanded = expandedTasks[task.id] ?? true;
            const progress = getSubtaskProgress(task);

            return (
              <div
                key={task.id}
                className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-4 backdrop-blur-sm shadow-md transition hover:border-gold-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="rounded p-1 text-peacock-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() =>
                        updateTaskStatus(
                          task.id,
                          task.status === 'completed' ? 'in_progress' : 'completed'
                        )
                      }
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                        task.status === 'completed'
                          ? 'border-feather-400 bg-feather-500 text-peacock-950 font-bold'
                          : 'border-peacock-700 bg-peacock-900 text-transparent hover:border-gold-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>

                    <div>
                      <h3
                        className={`text-sm font-bold text-white ${
                          task.status === 'completed' ? 'line-through text-peacock-400' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-0.5 text-[11px]">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${PRIORITY_BADGES[task.priority].class}`}>
                          {PRIORITY_BADGES[task.priority].label}
                        </span>
                        <span className="text-peacock-400">
                          {task.estimated_minutes} min estimated
                        </span>
                        {task.due_date && (
                          <span className="text-gold-400">
                            Due {format(parseISO(task.due_date), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gold-300">{progress}%</span>
                    <button
                      onClick={() => openEditModal(task)}
                      className="rounded-lg p-1.5 text-peacock-400 hover:bg-peacock-900 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg p-1.5 text-peacock-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion */}
                {isExpanded && (
                  <div className="mt-3.5 space-y-2 border-t border-peacock-800/80 pt-3 pl-8">
                    {task.subtasks?.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between rounded-lg bg-peacock-900/60 px-3 py-1.5 text-xs text-peacock-200"
                      >
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={sub.is_completed}
                            onChange={() => toggleSubtask(task.id, sub.id)}
                            className="h-4 w-4 rounded border-peacock-700 text-gold-500 focus:ring-gold-400"
                          />
                          <span className={sub.is_completed ? 'line-through text-peacock-500' : 'text-white'}>
                            {sub.title}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteSubtask(task.id, sub.id)}
                          className="text-peacock-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add Subtask inline input */}
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="text"
                        value={newSubtaskTitles[task.id] || ''}
                        onChange={(e) =>
                          setNewSubtaskTitles((prev) => ({ ...prev, [task.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddInlineSubtask(task.id);
                        }}
                        placeholder="Add subtask step..."
                        className="flex-1 rounded-lg border border-peacock-700 bg-peacock-900/80 px-2.5 py-1 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddInlineSubtask(task.id)}
                        className="rounded-lg bg-peacock-800 px-2.5 py-1 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-peacock-950 transition"
                      >
                        Add Step
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: CALENDAR VIEW */}
      {activeView === 'calendar' && (
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gold-400" />
              <span>{format(new Date(), 'MMMM yyyy')} Deadlines</span>
            </h3>
            <span className="text-xs text-peacock-300">Today: {format(new Date(), 'MMM d, yyyy')}</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-peacock-400 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {monthDays.map((d, i) => {
              const dStr = format(d, 'yyyy-MM-dd');
              const dayTasks = tasks.filter((t) => t.due_date && isSameDay(parseISO(t.due_date), d));
              const isToday = isSameDay(d, new Date());

              return (
                <div
                  key={i}
                  className={`min-h-[80px] rounded-xl border p-2 text-left transition ${
                    isToday
                      ? 'border-gold-400 bg-peacock-900/90 shadow-gold-sm'
                      : 'border-peacock-800/80 bg-peacock-950/90'
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-gold-300' : 'text-peacock-300'}`}>
                    {format(d, 'd')}
                  </span>

                  <div className="mt-1 space-y-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => openEditModal(t)}
                        title={t.title}
                        className="cursor-pointer truncate rounded bg-peacock-800/90 px-1.5 py-0.5 text-[9px] font-medium text-white border border-peacock-700 hover:border-gold-400"
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gold-500/40 bg-peacock-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gold-300 flex items-center space-x-2">
              <KanbanSquare className="h-5 w-5 text-gold-400" />
              <span>{editingTask ? 'Edit Activity Task' : 'Create New Activity Task'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Architect Multi-Tenant RLS Microservice"
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Include composite indexing on (user_id, status) and automated integration tests."
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., Backend, Security, Database"
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-2 pt-2 border-t border-peacock-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-peacock-800 px-3.5 py-2 text-xs font-medium text-peacock-300 hover:bg-peacock-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400 hover:to-gold-500"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
