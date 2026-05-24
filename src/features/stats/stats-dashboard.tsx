"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type WeekData = { day: string; completions: number };
type HeatCell = { date: string; count: number };
type HabitStat = { name: string; rate: number; color: string };

export function StatsDashboard({
  weeklyData,
  heatmap,
  habitRates,
  bestDays,
}: {
  weeklyData: WeekData[];
  heatmap: HeatCell[];
  habitRates: HabitStat[];
  bestDays: { day: string; count: number }[];
}) {
  const maxHeat = Math.max(...heatmap.map((h) => h.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 text-sm font-medium">Weekly completions</h3>
          <div className="h-56 min-h-56 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={224}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#888" />
                <YAxis tick={{ fontSize: 11 }} stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.2 0 0)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="completions"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-sm font-medium">Productivity trend</h3>
          <div className="h-56 min-h-56 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={224}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#888" />
                <YAxis tick={{ fontSize: 11 }} stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.2 0 0)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-4 text-sm font-medium">Activity heatmap</h3>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-wrap gap-1">
            {heatmap.map((cell, i) => (
              <motion.div
                key={cell.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 50) * 0.002 }}
                title={`${cell.date}: ${cell.count}`}
                className={cn(
                  "h-3 w-3 rounded-sm",
                  cell.count === 0 && "bg-muted"
                )}
                style={
                  cell.count > 0
                    ? {
                        backgroundColor: `oklch(${0.45 + (cell.count / maxHeat) * 0.35} 0.15 280)`,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Last 12 weeks of habit activity
        </p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 text-sm font-medium">Habit completion %</h3>
          <div className="space-y-3">
            {habitRates.map((h) => (
              <div key={h.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{h.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {h.rate}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: h.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${h.rate}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-sm font-medium">Most productive days</h3>
          <div className="space-y-2">
            {bestDays.map((d, i) => (
              <div
                key={d.day}
                className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
              >
                <span className="text-sm">
                  {i + 1}. {d.day}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
