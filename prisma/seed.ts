import { PrismaClient } from "@prisma/client";
import { addDays, startOfDay, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.habitCompletion.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.note.deleteMany();
  await prisma.quickNote.deleteMany();

  const today = startOfDay(new Date());

  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        name: "Morning meditation",
        description: "10 minutes mindfulness",
        frequency: "daily",
        category: "Mindfulness",
        color: "#8b5cf6",
      },
    }),
    prisma.habit.create({
      data: {
        name: "Deep work block",
        description: "2h focused work",
        frequency: "daily",
        category: "Productivity",
        color: "#3b82f6",
      },
    }),
    prisma.habit.create({
      data: {
        name: "Weekly review",
        description: "Plan the upcoming week",
        frequency: "weekly",
        category: "Productivity",
        color: "#f59e0b",
      },
    }),
    prisma.habit.create({
      data: {
        name: "Exercise",
        description: "30 min movement",
        frequency: "daily",
        category: "Fitness",
        color: "#10b981",
      },
    }),
  ]);

  for (const habit of habits.slice(0, 3)) {
    for (let i = 0; i < 14; i++) {
      if (Math.random() > 0.25) {
        await prisma.habitCompletion.create({
          data: {
            habitId: habit.id,
            date: subDays(today, i),
          },
        });
      }
    }
  }

  await prisma.calendarEvent.createMany({
    data: [
      {
        title: "Calculus midterm",
        category: "Exams",
        date: addDays(today, 5),
        color: "#f43f5e",
      },
      {
        title: "Project deadline",
        category: "Deadlines",
        date: addDays(today, 12),
        color: "#f59e0b",
      },
      {
        title: "Team sync",
        category: "Personal",
        date: addDays(today, 2),
        color: "#3b82f6",
      },
      {
        title: "Habit check-in",
        category: "Habits",
        date: today,
        color: "#8b5cf6",
      },
    ],
  });

  await prisma.note.createMany({
    data: [
      {
        title: "Dashboard ideas",
        content:
          "## Widget ideas\n- Focus timer\n- Reading list\n- Energy levels tracker",
        tags: JSON.stringify(["ideas", "product"]),
        pinned: true,
        favorite: true,
      },
      {
        title: "Reading list",
        content: "- Atomic Habits\n- Deep Work\n- Designing Data-Intensive Applications",
        tags: JSON.stringify(["books"]),
      },
      {
        title: "Quick thought",
        content: "Ship small, iterate fast. Polish comes after momentum.",
        tags: JSON.stringify(["inbox"]),
      },
    ],
  });

  await prisma.quickNote.create({
    data: { content: "Review stats dashboard layout tomorrow." },
  });

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
