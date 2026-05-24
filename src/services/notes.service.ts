import { prisma } from "@/lib/prisma";

export async function getNotes() {
  return prisma.note.findMany({
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });
}

export async function searchNotes(query: string) {
  if (!query.trim()) return getNotes();
  const q = query.toLowerCase();
  const notes = await getNotes();
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.toLowerCase().includes(q)
  );
}
