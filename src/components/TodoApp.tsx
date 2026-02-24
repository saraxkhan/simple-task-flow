import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  Plus, Trash2, Sparkles, CheckCircle2, Circle,
  ChevronDown, ChevronRight,
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
    // Auto-expand new task
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
  const previewCategory = input.trim() ? detectCategory(input) : null;
  const previewPriority = input.trim() ? detectPriority(input) : null;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            My Tasks
          </h1>
          {tasks.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {completedCount} of {tasks.length} completed
            </p>
          )}
        </div>

        {/* Input area */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-secondary/50 text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow border-0"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-3 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 shrink-0"
            >
              <Plus size={16} />
              Add
            </button>
          </form>

          {/* Live preview of detected category & priority */}
          {previewCategory && (
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
          )}
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No tasks yet. Add one above!</p>
            <p className="text-xs mt-1 text-muted-foreground/70">
              Try: "Urgent meeting prep" or "Buy groceries"
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const catColor = CATEGORY_COLORS[task.category];
              const priStyle = PRIORITY_STYLES[task.priority];
              const isExpanded = expandedTasks.has(task.id);
              const completedSubs = task.subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  className={`group bg-card rounded-xl border border-border transition-all hover:shadow-sm ${
                    task.completed ? "opacity-50" : ""
                  }`}
                >
                  {/* Main task row */}
                  <div className="flex items-center gap-3 px-4 py-3">
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}
                        >
                          {task.category}
                        </span>
                        <span className={`text-[10px] ${priStyle.className}`}>
                          {priStyle.label}
                        </span>
                        {task.subtasks.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {completedSubs}/{task.subtasks.length} subtasks
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand / Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      {task.subtasks.length > 0 && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  {isExpanded && task.subtasks.length > 0 && (
                    <div className="px-4 pb-3 pl-12 space-y-1.5 border-t border-border/50 pt-2">
                      {task.subtasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
