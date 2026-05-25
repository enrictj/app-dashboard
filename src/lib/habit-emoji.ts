const CATEGORY_EMOJI: Record<string, string> = {
  Salut: "💪",
  Aprenentatge: "📚",
  Productivitat: "⚡",
  Fitness: "🏃",
  Mindfulness: "🧘",
  Altres: "✨",
  Health: "💪",
  Learning: "📚",
  Productivity: "⚡",
  Other: "✨",
};

export function habitEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "✨";
}
