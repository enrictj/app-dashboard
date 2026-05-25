# Personal Productivity Dashboard

A local-first, desktop-first personal productivity dashboard and second brain. Built with Next.js, SQLite, and a polished dark UI.

## Features

- **Dashboard** — Habits, mini calendar, stats, daily curiosity, quick notes, deadlines
- **Habit Tracker** — Daily/weekly habits, streaks, categories, completions
- **Calendar** — Month view with Exams, Habits, Personal, Deadlines
- **Stats** — Weekly charts, GitHub-style heatmap, completion rates
- **Notes** — Markdown notes, tags, pin/favorite, search

## Tech Stack

- Next.js 16 (App Router), React, TypeScript
- Tailwind CSS v4, shadcn/ui, Framer Motion
- SQLite + Prisma
- Recharts, Zustand, Zod, date-fns

## Getting Started

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### High RAM / many Node processes?

If Next.js picks the wrong workspace root (e.g. you have `C:\Users\Enric\package-lock.json`), the dev server may watch your entire user folder and use almost all RAM. If RAM is still high, try `npm run dev:webpack` instead. Run only **one** dev server at a time.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |

## Project Structure

```
src/
  app/(app)/       # Routes with app shell
  components/      # Shared UI & layout
  features/        # Feature modules + server actions
  services/        # Data access layer
  lib/             # Utilities, Prisma client
  store/           # Zustand UI state
  types/           # Shared types
prisma/            # Schema, migrations, seed
```

Data persists in `prisma/dev.db` (SQLite).
