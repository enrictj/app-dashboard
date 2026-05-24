import type { EventCategory } from "@/types";

export const t = {
  appName: "Dashboard Personal",
  nav: {
    dashboard: "Tauler",
    habits: "Hàbits",
    calendar: "Calendari",
    stats: "Estadístiques",
    notes: "Notes",
    collapse: "Replegar",
  },
  dashboard: {
    title: "Tauler",
    todayHabits: "Hàbits d'avui",
    completed: (n: number, total: number) => `${n}/${total} completats`,
    noHabits: "Encara no hi ha hàbits.",
    calendar: "Calendari",
    productivity: "Productivitat",
    thisWeek: "Aquesta setmana",
    habitRate: "Taxa d'hàbits",
    activeStreaks: "Ratxes actives",
    eventsThisWeek: "Esdeveniments aquesta setmana",
    dailyCuriosity: "Curiositat del dia",
    didYouKnow: "Ho sabies?",
    quickNotes: "Notes ràpides",
    captureFast: "Captura ràpida",
    quickNotesPlaceholder: "Escriu i prem Enter...",
    upcoming: "Propers",
    deadlinesExams: "Terminis i exàmens",
    nothingDue: "Res pendent aviat.",
  },
  habits: {
    title: "Seguiment d'hàbits",
    description: "Construeix constància amb ratxes i categories",
    empty: "Encara no hi ha hàbits. Crea el teu primer hàbit per començar.",
    newHabit: "Nou hàbit",
    createHabit: "Crear hàbit",
    name: "Nom",
    descriptionLabel: "Descripció",
    frequency: "Freqüència",
    category: "Categoria",
    color: "Color",
    create: "Crear",
    daily: "Diari",
    weekly: "Setmanal",
    streak: (n: number) => `${n} ratxa`,
    completions: (n: number) => `${n} complets`,
    doneToday: "Fet avui",
    complete: "Completar",
  },
  calendar: {
    title: "Calendari",
    description: "Exàmens, terminis, hàbits i esdeveniments personals",
    today: "Avui",
    noEvents: "Cap esdeveniment.",
    remove: "Eliminar",
    addEvent: "Afegir esdeveniment",
    titleLabel: "Títol",
    saveEvent: "Desar esdeveniment",
    more: (n: number) => `+${n} més`,
    weekdaysShort: ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"],
    weekdaysMini: ["D", "L", "M", "X", "J", "V", "S"],
  },
  stats: {
    title: "Estadístiques",
    description: "Analítica, mapes de calor i tendències de productivitat",
    weeklyCompletions: "Complets setmanals",
    productivityTrend: "Tendència de productivitat",
    activityHeatmap: "Mapa d'activitat",
    last12Weeks: "Últimes 12 setmanes d'activitat d'hàbits",
    habitCompletion: "Completat d'hàbits %",
    mostProductiveDays: "Dies més productius",
    dayNames: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
  },
  notes: {
    title: "Notes",
    description: "Captura ràpida, markdown, etiquetes i cerca instantània",
    searchPlaceholder: "Cercar notes...",
    all: "Totes",
    pinned: "Fixades",
    favorite: "Preferides",
    emptyNote: "Nota buida",
    newNote: "Nova nota",
    untitled: "Sense títol",
    writeMarkdown: "Escriu en markdown...",
    selectOrCreate: "Selecciona o crea una nota.",
    updated: (date: string) => `Actualitzat ${date}`,
  },
} as const;

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  Exams: "Exàmens",
  Habits: "Hàbits",
  Personal: "Personal",
  Deadlines: "Terminis",
};

export const HABIT_CATEGORY_LABELS: Record<string, string> = {
  Health: "Salut",
  Learning: "Aprenentatge",
  Productivity: "Productivitat",
  Fitness: "Fitness",
  Mindfulness: "Mindfulness",
  Other: "Altres",
  Salut: "Salut",
  Aprenentatge: "Aprenentatge",
  Productivitat: "Productivitat",
  Altres: "Altres",
};

export function eventCategoryLabel(category: string): string {
  return EVENT_CATEGORY_LABELS[category as EventCategory] ?? category;
}

export function habitCategoryLabel(category: string): string {
  return HABIT_CATEGORY_LABELS[category] ?? category;
}

export function frequencyLabel(frequency: string): string {
  if (frequency === "daily") return t.habits.daily;
  if (frequency === "weekly") return t.habits.weekly;
  return frequency;
}

export function noteFilterLabel(filter: "all" | "pinned" | "favorite"): string {
  if (filter === "all") return t.notes.all;
  if (filter === "pinned") return t.notes.pinned;
  return t.notes.favorite;
}
