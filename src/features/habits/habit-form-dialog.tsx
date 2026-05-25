"use client";

import { useState, useTransition } from "react";
import { createHabit } from "@/features/habits/actions";
import { HABIT_CATEGORIES } from "@/types";
import { habitCategoryLabel, t } from "@/lib/i18n/ca";
import { cn } from "@/lib/utils";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#ec4899"];

export function HabitFormDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [category, setCategory] = useState<string>(HABIT_CATEGORIES[0]);
  const [color, setColor] = useState(COLORS[0]);

  function reset() {
    setName("");
    setDescription("");
    setFrequency("daily");
    setCategory(HABIT_CATEGORIES[0]);
    setColor(COLORS[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createHabit({ name, description, frequency, category, color });
      setOpen(false);
      reset();
    });
  }

  return (
    <>
      <button type="button" className="btn btn-accent" onClick={() => setOpen(true)}>
        + {t.habits.newHabit}
      </button>

      {open && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text1)",
                marginBottom: 20,
              }}
            >
              {t.habits.createHabit}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--text3)",
                    marginBottom: 6,
                  }}
                >
                  {t.habits.name}
                </label>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--text3)",
                    marginBottom: 6,
                  }}
                >
                  {t.habits.descriptionLabel}
                </label>
                <input
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--text3)",
                    marginBottom: 6,
                  }}
                >
                  {t.habits.frequency}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className={cn("freq-pill", frequency === "daily" && "active")}
                    onClick={() => setFrequency("daily")}
                  >
                    {t.habits.daily}
                  </button>
                  <button
                    type="button"
                    className={cn("freq-pill", frequency === "weekly" && "active")}
                    onClick={() => setFrequency("weekly")}
                  >
                    {t.habits.weekly}
                  </button>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--text3)",
                    marginBottom: 6,
                  }}
                >
                  {t.habits.category}
                </label>
                <select
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {HABIT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {habitCategoryLabel(c)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--text3)",
                    marginBottom: 8,
                  }}
                >
                  {t.habits.color}
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={cn("color-swatch", color === c && "selected")}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                >
                  {t.habits.cancel}
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ flex: 1 }}
                  disabled={pending}
                >
                  {t.habits.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
