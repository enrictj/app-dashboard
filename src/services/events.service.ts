import { endOfMonth, startOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getEventsForMonth(month: Date) {
  return prisma.calendarEvent.findMany({
    where: {
      date: {
        gte: startOfMonth(month),
        lte: endOfMonth(month),
      },
    },
    orderBy: { date: "asc" },
  });
}

export async function getUpcomingDeadlines(limit = 5) {
  const now = new Date();
  return prisma.calendarEvent.findMany({
    where: {
      date: { gte: now },
      category: { in: ["Deadlines", "Exams"] },
    },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function getAllEvents() {
  return prisma.calendarEvent.findMany({ orderBy: { date: "asc" } });
}
