"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { TrendingUp, Zap, Target } from "lucide-react";

export function ProductivityStatsWidget({
  completionRate,
  activeStreaks,
  eventsThisWeek,
}: {
  completionRate: number;
  activeStreaks: number;
  eventsThisWeek: number;
}) {
  const stats = [
    {
      label: "Habit rate",
      value: `${completionRate}%`,
      icon: Target,
      color: "text-violet-400",
    },
    {
      label: "Active streaks",
      value: String(activeStreaks),
      icon: Zap,
      color: "text-amber-400",
    },
    {
      label: "Events this week",
      value: String(eventsThisWeek),
      icon: TrendingUp,
      color: "text-blue-400",
    },
  ];

  return (
    <GlassCard className="col-span-4 lg:col-span-2">
      <WidgetHeader title="Productivity" subtitle="This week" />
      <div className="grid gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <span className="text-lg font-semibold tabular-nums">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
