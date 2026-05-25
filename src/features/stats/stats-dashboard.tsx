"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { habitEmoji } from "@/lib/habit-emoji";
import { habitCategoryLabel } from "@/lib/i18n/ca";

type WeekData = { day: string; completions: number; total: number };
type HeatCell = { date: string; count: number };
type HabitStat = {
  name: string;
  rate: number;
  color: string;
  streak?: number;
  category?: string;
  count30?: number;
};

const PIE_COLORS = ["#7c6af7", "#3dd68c", "#f5a623", "#4fa8ff", "#e879f9", "#e85d5d"];

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.4, marginBottom: 8 }}>🎯</div>
      <p style={{ fontSize: 13, color: "var(--text3)" }}>{message}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: "var(--text2)",
        marginBottom: 16,
      }}
    >
      {children}
    </h3>
  );
}

function getHeatmapColor(count: number) {
  if (count === 0) return "var(--bg3)";
  if (count === 1) return "rgba(124, 106, 247, 0.25)";
  if (count >= 2 && count <= 3) return "rgba(124, 106, 247, 0.5)";
  if (count >= 4 && count <= 5) return "rgba(124, 106, 247, 0.75)";
  return "var(--accent)";
}

function getRateColor(rate: number) {
  if (rate >= 70) return "var(--green)";
  if (rate >= 40) return "var(--amber)";
  return "var(--red)";
}

export function StatsDashboard({
  weeklyData,
  heatmap,
  habitRates,
  quickStats,
}: {
  weeklyData: WeekData[];
  heatmap: HeatCell[];
  habitRates: HabitStat[];
  bestDays: { day: string; count: number }[];
  quickStats?: {
    totalHabits: number;
    weeklyRate: number;
    bestStreak: number;
    totalNotes: number;
  };
}) {
  // Sliced year heatmap data (364 cells)
  const slicedHeatmap = useMemo(() => heatmap.slice(-364), [heatmap]);

  // Group habits for categories Donut Chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const h of habitRates) {
      if (h.category) {
        counts[h.category] = (counts[h.category] ?? 0) + 1;
      }
    }
    return Object.entries(counts).map(([name, value]) => ({
      name: habitCategoryLabel(name),
      value,
    }));
  }, [habitRates]);

  const hasHabits = habitRates.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── 4 Quick Stat Cards ── */}
      {quickStats && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ marginBottom: 16 }}
        >
          <div className="card">
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text1)",
                lineHeight: 1.2,
              }}
            >
              {quickStats.totalHabits}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
              Hàbits actius
            </div>
          </div>

          <div className="card">
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text1)",
                lineHeight: 1.2,
              }}
            >
              {quickStats.weeklyRate}%
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
              Taxa setmanal
            </div>
          </div>

          <div className="card">
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text1)",
                lineHeight: 1.2,
              }}
            >
              {quickStats.bestStreak} 🔥
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
              Millor streak
            </div>
          </div>

          <div className="card">
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text1)",
                lineHeight: 1.2,
              }}
            >
              {quickStats.totalNotes}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
              Notes creades
            </div>
          </div>
        </div>
      )}

      {/* ── Charts Row (2 columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
        {/* Card 1: Bar chart — "Hàbits per dia — última setmana" */}
        <div className="card">
          <SectionTitle>Hàbits per dia — última setmana</SectionTitle>
          {!hasHabits ? (
            <EmptyState message="Crea hàbits per veure les estadístiques diàries" />
          ) : (
            <div style={{ height: 180, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barGap={2} barCategoryGap="25%">
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "var(--text3)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--text3)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={20}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1f",
                      border: "1px solid #2a2a35",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--text1)",
                    }}
                    itemStyle={{ color: "var(--text2)" }}
                    labelStyle={{ color: "var(--text3)", fontWeight: 500 }}
                    cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--bg3)"
                    radius={[3, 3, 0, 0]}
                    name="Total"
                  />
                  <Bar
                    dataKey="completions"
                    fill="var(--accent)"
                    radius={[3, 3, 0, 0]}
                    name="Completats"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Card 2: Pie/Donut chart — "Distribució per categories" */}
        <div className="card">
          <SectionTitle>Distribució per categories</SectionTitle>
          {categoryData.length === 0 ? (
            <EmptyState message="Crea hàbits per veure la distribució per categories" />
          ) : (
            <div style={{ height: 180, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    cx="50%"
                    cy="50%"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1f",
                      border: "1px solid #2a2a35",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--text1)",
                    }}
                    itemStyle={{ color: "var(--text2)" }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: "var(--text2)", fontSize: 11 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── Heatmap Card ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <SectionTitle>Heatmap d'activitat — últim any</SectionTitle>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(52, 10px)",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(7, 10px)",
              gap: 2,
              width: "max-content",
              paddingBottom: 4,
            }}
          >
            {slicedHeatmap.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date}: ${cell.count} completat${
                  cell.count !== 1 ? "s" : ""
                }`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: getHeatmapColor(cell.count),
                  transition: "background-color 0.15s",
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--text3)",
            marginTop: 8,
          }}
        >
          <span>Menys</span>
          <div style={{ display: "flex", gap: 2 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "var(--bg3)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "rgba(124,106,247,0.25)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "rgba(124,106,247,0.5)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "rgba(124,106,247,0.75)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "var(--accent)",
              }}
            />
          </div>
          <span>Més</span>
        </div>
      </div>

      {/* ── Per-habit detail table ── */}
      <div className="card" style={{ marginBottom: 16, overflowX: "auto" }}>
        <SectionTitle>Hàbits — detall de completats</SectionTitle>
        {!hasHabits ? (
          <EmptyState message="Crea hàbits per veure les dades detallades de completats" />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: "var(--text3)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Hàbit
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: "var(--text3)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Streak
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: "var(--text3)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  30 dies
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: "var(--text3)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Taxa
                </th>
              </tr>
            </thead>
            <tbody>
              {habitRates.map((h) => (
                <tr
                  key={h.name}
                  style={{ borderTop: "1px solid var(--border1)" }}
                >
                  <td style={{ padding: "12px 12px", color: "var(--text1)" }}>
                    <span style={{ marginRight: 8, fontSize: 16 }}>
                      {habitEmoji(h.category ?? "")}
                    </span>
                    {h.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 12px",
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: "var(--amber)",
                      fontWeight: 600,
                    }}
                  >
                    {h.streak ?? 0} 🔥
                  </td>
                  <td
                    style={{
                      padding: "12px 12px",
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: "var(--text1)",
                    }}
                  >
                    {h.count30 ?? 0}/30
                  </td>
                  <td style={{ padding: "12px 12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 120,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          backgroundColor: "var(--bg3)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${h.rate}%`,
                            height: "100%",
                            borderRadius: 3,
                            backgroundColor: getRateColor(h.rate),
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 12,
                          color: "var(--text1)",
                          minWidth: 32,
                          textAlign: "right",
                        }}
                      >
                        {h.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
