"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleHabitCompletion, deleteHabit } from "@/features/habits/actions";
import { habitEmoji } from "@/lib/habit-emoji";
import type { DaySlot } from "@/lib/habit-dates";
import { habitCategoryLabel, t } from "@/lib/i18n/ca";
import { cn } from "@/lib/utils";

export type HabitRow = {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  category: string;
  color: string;
  streak: number;
  completedToday: boolean;
  totalCompletions: number;
  last7: DaySlot[];
  week: DaySlot[];
};

type TabId = "today" | "all" | "weekly";

function ProgressCard({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="card">
      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 36,
          fontWeight: 700,
          color: "var(--text1)",
          lineHeight: 1,
        }}
      >
        {pct}%
      </div>
      <div
        style={{
          marginTop: 12,
          height: 8,
          borderRadius: 4,
          background: "var(--bg3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 4,
            background:
              "linear-gradient(90deg, var(--accent-habit), var(--green))",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "var(--text3)",
        }}
      >
        {t.habits.progressCompleted(completed, total)}
      </p>
    </div>
  );
}

function TopStreaksCard({ habits }: { habits: HabitRow[] }) {
  const top = [...habits]
    .filter((h) => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4);

  if (top.length === 0) return null;

  return (
    <div className="card-sm">
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text3)",
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {t.habits.topStreaks}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {top.map((h) => (
          <div
            key={h.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, color: "var(--text1)" }}>
              <span style={{ marginRight: 8 }}>{habitEmoji(h.category)}</span>
              {h.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 14,
                fontWeight: 600,
                color: "#f59e0b",
              }}
            >
              {h.streak} 🔥
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitRowLine({
  habit,
  showDelete,
  mode,
  onToggle,
  pending,
}: {
  habit: HabitRow;
  showDelete: boolean;
  mode: "daily" | "weekly-habit";
  onToggle: (habitId: string, date?: Date) => void;
  pending: boolean;
}) {
  const emoji = habitEmoji(habit.category);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderTop: "1px solid var(--border1)",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: habit.completedToday ? "var(--text3)" : "var(--text1)",
            textDecoration: habit.completedToday ? "line-through" : "none",
            transition: "all 0.15s",
          }}
        >
          {habit.name}
        </p>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
          {habitCategoryLabel(habit.category)}
          {habit.streak > 0 && (
            <>
              {" · "}
              {habit.streak} 🔥
            </>
          )}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {habit.last7.map((day) => (
          <span
            key={day.date.toISOString()}
            className={cn("streak-dot", day.completed ? "dot-done" : "dot-miss")}
            title={day.label}
          />
        ))}
      </div>

      {mode === "daily" ? (
        <button
          type="button"
          className={cn("check-btn", habit.completedToday && "done")}
          onClick={() => onToggle(habit.id)}
          disabled={pending}
          aria-label={t.habits.complete}
        >
          ✓
        </button>
      ) : (
        <div style={{ display: "flex", gap: 4 }}>
          {habit.last7.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              className={cn(
                "week-dot",
                day.completed && "done",
                day.isToday && "today"
              )}
              onClick={() => onToggle(habit.id, day.date)}
              disabled={pending}
              title={day.label}
            >
              {day.label.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {showDelete && (
        <button
          type="button"
          className="habit-delete-btn"
          onClick={() => deleteHabit(habit.id)}
          title={t.habits.deleteHabit}
        >
          🗑
        </button>
      )}
    </div>
  );
}

function WeeklyTable({
  habits,
  weekColumns,
  onToggle,
  pending,
}: {
  habits: HabitRow[];
  weekColumns: DaySlot[];
  onToggle: (habitId: string, date: Date) => void;
  pending: boolean;
}) {
  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px 12px",
                color: "var(--text3)",
                fontWeight: 500,
                fontSize: 11,
              }}
            />
            {weekColumns.map((col) => (
              <th
                key={col.date.toISOString()}
                style={{
                  textAlign: "center",
                  padding: "8px 6px",
                  color: "var(--text3)",
                  fontWeight: 500,
                  fontSize: 11,
                  minWidth: 44,
                }}
              >
                <div>{col.label}</div>
                <div style={{ color: "var(--text2)", marginTop: 2 }}>
                  {col.dayNum}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td
                style={{
                  padding: "10px 12px",
                  borderTop: "1px solid var(--border1)",
                  color: "var(--text1)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ marginRight: 6 }}>{habitEmoji(habit.category)}</span>
                {habit.name}
              </td>
              {habit.week.map((day) => (
                <td
                  key={day.date.toISOString()}
                  style={{
                    textAlign: "center",
                    padding: "10px 6px",
                    borderTop: "1px solid var(--border1)",
                    cursor: pending ? "wait" : "pointer",
                    transition: "all 0.15s",
                  }}
                  onClick={() => !pending && onToggle(habit.id, day.date)}
                >
                  {day.completed ? "✅" : "⬜"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.4, marginBottom: 12 }}>
        {t.habits.emptyEmoji}
      </div>
      <p style={{ fontSize: 14, color: "var(--text3)" }}>{message}</p>
    </div>
  );
}

export function HabitsView({ habits }: { habits: HabitRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("today");
  const [pending, startTransition] = useTransition();

  const dailyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "daily"),
    [habits]
  );
  const weeklyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "weekly"),
    [habits]
  );

  const completedToday = habits.filter((h) => h.completedToday).length;
  const weekColumns = habits[0]?.week ?? [];

  function handleToggle(habitId: string, date?: Date) {
    startTransition(async () => {
      await toggleHabitCompletion(habitId, date);
      router.refresh();
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <ProgressCard completed={completedToday} total={habits.length} />
        <TopStreaksCard habits={habits} />
      </div>

      <div className="habit-tab-pill">
        {(
          [
            ["today", t.habits.tabToday],
            ["all", t.habits.tabAll],
            ["weekly", t.habits.tabWeekly],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn("habit-tab", tab === id && "active")}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <>
          {habits.length === 0 ? (
            <EmptyState message={t.habits.emptyToday} />
          ) : (
            <div className="card">
              {dailyHabits.length > 0 && (
                <>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 4,
                    }}
                  >
                    {t.habits.daily}
                  </p>
                  {dailyHabits.map((h) => (
                    <HabitRowLine
                      key={h.id}
                      habit={h}
                      showDelete={false}
                      mode="daily"
                      onToggle={handleToggle}
                      pending={pending}
                    />
                  ))}
                </>
              )}
              {weeklyHabits.length > 0 && (
                <>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginTop: dailyHabits.length ? 16 : 0,
                      marginBottom: 4,
                    }}
                  >
                    {t.habits.weekly}
                  </p>
                  {weeklyHabits.map((h) => (
                    <HabitRowLine
                      key={h.id}
                      habit={h}
                      showDelete={false}
                      mode="weekly-habit"
                      onToggle={handleToggle}
                      pending={pending}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}

      {tab === "all" && (
        <>
          {habits.length === 0 ? (
            <EmptyState message={t.habits.emptyAll} />
          ) : (
            <div className="card">
              {habits.map((h) => (
                <HabitRowLine
                  key={h.id}
                  habit={h}
                  showDelete
                  mode="daily"
                  onToggle={handleToggle}
                  pending={pending}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "weekly" && (
        <>
          {habits.length === 0 ? (
            <EmptyState message={t.habits.emptyAll} />
          ) : (
            <WeeklyTable
              habits={habits}
              weekColumns={weekColumns}
              onToggle={handleToggle}
              pending={pending}
            />
          )}
        </>
      )}
    </div>
  );
}
