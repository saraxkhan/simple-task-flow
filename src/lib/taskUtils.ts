export type Category = "Work" | "Personal" | "Health" | "Shopping" | "Learning" | "Finance" | "General";
export type Priority = "High" | "Medium" | "Low";

interface CategoryRule {
  keywords: string[];
  category: Category;
}

const CATEGORY_RULES: CategoryRule[] = [
  { keywords: ["meeting", "project", "report", "deadline", "client", "presentation", "email", "office", "work", "task", "review", "sprint", "deploy", "code", "bug", "feature"], category: "Work" },
  { keywords: ["grocery", "buy", "shop", "order", "purchase", "pick up", "store", "amazon"], category: "Shopping" },
  { keywords: ["exercise", "gym", "run", "yoga", "doctor", "medicine", "health", "diet", "workout", "sleep", "meditate", "walk", "jog"], category: "Health" },
  { keywords: ["learn", "study", "read", "course", "tutorial", "practice", "book", "research", "class", "lecture"], category: "Learning" },
  { keywords: ["pay", "bill", "budget", "tax", "invoice", "bank", "insurance", "rent", "loan", "invest"], category: "Finance" },
  { keywords: ["cook", "clean", "laundry", "home", "family", "call", "birthday", "gift", "party", "travel", "vacation", "plan"], category: "Personal" },
];

const PRIORITY_KEYWORDS: Record<Priority, string[]> = {
  High: ["urgent", "asap", "immediately", "critical", "deadline", "important", "emergency", "today", "now"],
  Medium: ["soon", "this week", "review", "update", "prepare", "schedule", "plan"],
  Low: ["someday", "maybe", "whenever", "eventually", "later", "consider", "think about", "explore"],
};

export function detectCategory(text: string): Category {
  const lower = text.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }
  return "General";
}

export function detectPriority(text: string): Priority {
  const lower = text.toLowerCase();
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS) as [Priority, string[]][]) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return priority;
    }
  }
  return "Medium";
}

const SUBTASK_MAP: Record<Category, string[][]> = {
  Work: [
    ["Draft initial outline", "Review with team", "Submit final version"],
    ["Set up environment", "Implement changes", "Test thoroughly"],
    ["Schedule meeting", "Prepare agenda", "Send follow-up notes"],
  ],
  Shopping: [
    ["Check existing stock", "Compare prices online", "Add to cart"],
    ["Make a list", "Set budget", "Visit store"],
  ],
  Health: [
    ["Set a reminder", "Prepare gear/supplies", "Track progress"],
    ["Research options", "Schedule appointment", "Follow up"],
  ],
  Learning: [
    ["Find resources", "Take notes", "Practice what you learned"],
    ["Set learning goals", "Block study time", "Quiz yourself"],
  ],
  Finance: [
    ["Gather documents", "Review amounts", "Process payment"],
    ["Check due dates", "Set up auto-pay", "Confirm completion"],
  ],
  Personal: [
    ["Plan the details", "Set a reminder", "Follow through"],
    ["Research options", "Make a decision", "Take action"],
  ],
  General: [
    ["Break into smaller steps", "Set a timeline", "Review progress"],
    ["Define the goal", "Identify next action", "Complete and review"],
  ],
};

export function generateSubtasks(text: string, category: Category): string[] {
  const options = SUBTASK_MAP[category];
  const index = text.length % options.length;
  return options[index];
}

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  Work: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  Shopping: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  Health: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
  Learning: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300" },
  Finance: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300" },
  Personal: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-300" },
  General: { bg: "bg-secondary", text: "text-secondary-foreground" },
};

export const PRIORITY_STYLES: Record<Priority, { label: string; className: string }> = {
  High: { label: "High", className: "text-destructive font-semibold" },
  Medium: { label: "Med", className: "text-primary font-medium" },
  Low: { label: "Low", className: "text-muted-foreground" },
};
