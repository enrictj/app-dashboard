"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  category: z.enum(["Exams", "Habits", "Personal", "Deadlines"]),
  color: z.string().optional(),
  allDay: z.boolean().optional(),
});

export async function createEvent(data: z.infer<typeof eventSchema>) {
  const parsed = eventSchema.parse(data);
  await prisma.calendarEvent.create({ data: parsed });
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function updateEvent(
  id: string,
  data: Partial<z.infer<typeof eventSchema>>
) {
  await prisma.calendarEvent.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function deleteEvent(id: string) {
  await prisma.calendarEvent.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/calendar");
}
