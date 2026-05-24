"use server";

import { revalidatePath } from "next/cache";
import { startOfDay } from "date-fns";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const habitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekly"]),
  category: z.string().min(1),
  color: z.string().optional(),
});

export async function createHabit(data: z.infer<typeof habitSchema>) {
  const parsed = habitSchema.parse(data);
  await prisma.habit.create({ data: parsed });
  revalidatePath("/");
  revalidatePath("/habits");
  revalidatePath("/stats");
  revalidatePath("/calendar");
}

export async function updateHabit(
  id: string,
  data: Partial<z.infer<typeof habitSchema>>
) {
  await prisma.habit.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/habits");
  revalidatePath("/stats");
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/habits");
  revalidatePath("/stats");
}

export async function toggleHabitCompletion(habitId: string, date?: Date) {
  const day = startOfDay(date ?? new Date());
  const existing = await prisma.habitCompletion.findFirst({
    where: { habitId, date: day },
  });

  if (existing) {
    await prisma.habitCompletion.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitCompletion.create({
      data: { habitId, date: day },
    });
  }

  revalidatePath("/");
  revalidatePath("/habits");
  revalidatePath("/stats");
  revalidatePath("/calendar");
}
