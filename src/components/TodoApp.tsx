import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, Sparkles, Loader2, CheckCircle2, Circle } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const MOCK_SUGGESTIONS: Record<string, string[]> = {
  default: [
    "Break it into smaller steps",
    "Research best practices",
    "Create an outline",
    "Set a deadline",
  ],
};

function generateSuggestions(taskText: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = taskText.toLowerCase();
      if (lower.includes("website") || lower.includes("app")) {
        resolve(["Design wireframes", "Set up project structure", "Build landing page", "Add responsive styles"]);
      } else if (lower.includes("learn") || lower.includes("study")) {
        resolve(["Find online courses", "Take notes", "Practice with exercises", "Build a project"]);
      } else if (lower.includes("clean") || lower.includes("organize")) {
        resolve(["Declutter surfaces", "Sort into categories", "Label storage bins", "Set weekly schedule"]);
      } else {
        resolve(MOCK_SUGGESTIONS.default);
      }
    }, 1200);
  });
}

export default function TodoApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("todo-tasks", []);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text: text.trim(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
    setSuggestions([]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(input);
  };

  const handleSuggest = async () => {
    if (!input.trim()) return;
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const results = await generateSuggestions(input);
      setSuggestions(results);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

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
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-3">
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

          {/* AI Suggest button */}
          <div className="mt-3 flex justify-start">
            <button
              type="button"
              onClick={handleSuggest}
              disabled={!input.trim() || loadingSuggestions}
              className="flex items-center gap-1.5 text-xs font-medium text-ai hover:text-ai/80 bg-ai-muted rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
            >
              {loadingSuggestions ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              AI Suggest Subtasks
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium px-1">
                Suggested subtasks — click to add:
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    addTask(s);
                    setSuggestions((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  className="w-full text-left text-sm bg-ai-muted text-accent-foreground rounded-lg px-3 py-2 hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Plus size={14} className="text-ai shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3 transition-all hover:shadow-sm ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} className="text-success" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
