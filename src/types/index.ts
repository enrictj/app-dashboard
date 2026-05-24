export type HabitFrequency = "daily" | "weekly";

export type EventCategory =
  | "Exams"
  | "Habits"
  | "Personal"
  | "Deadlines";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Exams",
  "Habits",
  "Personal",
  "Deadlines",
];

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Exams: "#f43f5e",
  Habits: "#8b5cf6",
  Personal: "#3b82f6",
  Deadlines: "#f59e0b",
};

export const HABIT_CATEGORIES = [
  "Salut",
  "Aprenentatge",
  "Productivitat",
  "Fitness",
  "Mindfulness",
  "Altres",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}
