"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stringifyTags } from "@/types";

const noteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(50000),
  tags: z.array(z.string()).optional(),
  pinned: z.boolean().optional(),
  favorite: z.boolean().optional(),
});

export async function createNote(data: z.infer<typeof noteSchema>) {
  const parsed = noteSchema.parse(data);
  await prisma.note.create({
    data: {
      ...parsed,
      tags: stringifyTags(parsed.tags ?? []),
    },
  });
  revalidatePath("/");
  revalidatePath("/notes");
}

export async function updateNote(
  id: string,
  data: Partial<z.infer<typeof noteSchema>>
) {
  const update: Record<string, unknown> = { ...data };
  if (data.tags) update.tags = stringifyTags(data.tags);
  await prisma.note.update({ where: { id }, data: update });
  revalidatePath("/");
  revalidatePath("/notes");
}

export async function deleteNote(id: string) {
  await prisma.note.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/notes");
}

export async function createQuickNote(content: string) {
  if (!content.trim()) return;
  await prisma.quickNote.create({ data: { content: content.trim() } });
  revalidatePath("/");
}

export async function deleteQuickNote(id: string) {
  await prisma.quickNote.delete({ where: { id } });
  revalidatePath("/");
}
