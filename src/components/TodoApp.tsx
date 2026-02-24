import { useState } from "react";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Sparkles, CheckCircle2, Circle,
  ChevronRight, ListChecks, Rocket, Sun, Moon, Monitor,
} from "lucide-react";
import {
  type Category, type Priority,
  detectCategory, detectPriority, generateSubtasks,
  CATEGORY_COLORS, PRIORITY_STYLES,
} from "@/lib/taskUtils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  subtasks: { id: string; text: string; completed: boolean }[];
}

export default function TodoApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("todo-tasks-v2", []);
  const [input, setInput] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const order = ["light", "dark", "system"] as const;
    const current = order.indexOf(theme as typeof order[number]);
    setTheme(order[(current + 1) % order.length]);
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  const addTask = (text: string) => {
    if (!text.trim()) return;
    const category = detectCategory(text);
    const priority = detectPriority(text);
    const subtaskTexts = generateSubtasks(text, category);
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text: text.trim(),
      completed: false,
      category,
      priority,
      subtasks: subtaskTexts.map((s, i) => ({
        id: `sub-${Date.now()}-${i}`,
        text: s,
        completed: false,
      })),
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
    setExpandedTasks((prev) => new Set(prev).add(newTask.id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const toggleSubtask = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(input);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const previewCategory = input.trim() ? detectCategory(input) : null;
  const previewPriority = input.trim() ? detectPriority(input) : null;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="w-full flex justify-end mb-2">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
              title={`Theme: ${theme}`}
            >
              <ThemeIcon size={18} />
            </button>
          </div>
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <ListChecks size={22} className="text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              My Tasks
            </h1>
          </div>
          {tasks.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted-foreground">
                {completedCount} of {tasks.length} completed
              </p>
              {/* Progress bar */}
              <div className="mx-auto max-w-[200px] h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-md border border-border p-4 mb-6"
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-secondary/50 text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all border-0"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground rounded-xl px-5 py-3 font-medium text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </form>

          {/* Live preview */}
          <AnimatePresence>
            {previewCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex items-center gap-2 px-1">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[previewCategory].bg} ${CATEGORY_COLORS[previewCategory].text}`}>
                    {previewCategory}
                  </span>
                  {previewPriority && (
                    <span className={`text-[11px] ${PRIORITY_STYLES[previewPriority].className}`}>
                      ● {previewPriority} priority
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Sparkles size={10} /> Auto-detected
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-4 rounded-2xl bg-secondary/60 mb-4">
              <Rocket size={32} className="text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No tasks yet</p>
            <p className="text-xs mt-1.5 text-muted-foreground/60">
              Try: "Urgent meeting prep" or "Buy groceries"
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {tasks.map((task) => {
                const catColor = CATEGORY_COLORS[task.category];
                const priStyle = PRIORITY_STYLES[task.priority];
                const isExpanded = expandedTasks.has(task.id);
                const completedSubs = task.subtasks.filter((s) => s.completed).length;

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`group bg-card rounded-xl border border-border transition-colors hover:border-primary/20 hover:shadow-md ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    {/* Main task row */}
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 size={20} className="text-success" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-sm leading-snug ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {task.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}
                          >
                            {task.category}
                          </span>
                          <span className={`text-[10px] ${priStyle.className}`}>
                            {priStyle.label}
                          </span>
                          {task.subtasks.length > 0 && (
                            <span className="text-[10px] text-muted-foreground/70">
                              {completedSubs}/{task.subtasks.length} done
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand / Delete */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {task.subtasks.length > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                          >
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <ChevronRight size={14} />
                            </motion.div>
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks */}
                    <AnimatePresence>
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 pl-12 space-y-1 border-t border-border/50 pt-2">
                            {task.subtasks.map((sub, i) => (
                              <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-2 py-0.5"
                              >
                                <button
                                  onClick={() => toggleSubtask(task.id, sub.id)}
                                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {sub.completed ? (
                                    <CheckCircle2 size={14} className="text-success" />
                                  ) : (
                                    <Circle size={14} />
                                  )}
                                </button>
                                <span
                                  className={`text-xs ${
                                    sub.completed
                                      ? "line-through text-muted-foreground"
                                      : "text-foreground/80"
                                  }`}
                                >
                                  {sub.text}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
