"use client";

import { useMemo, useState, useTransition } from "react";
import {
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCalendarGrid } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, EVENT_CATEGORIES, type EventCategory } from "@/types";
import { createEvent, deleteEvent } from "@/features/calendar/actions";
import { formatDateCa } from "@/lib/i18n/dates";
import { eventCategoryLabel, t } from "@/lib/i18n/ca";

export type CalendarEventItem = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  category: string;
  color: string | null;
};

export function CalendarView({ events }: { events: CalendarEventItem[] }) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Personal");
  const days = useMemo(() => getCalendarGrid(month), [month]);

  const dayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events.filter((e) => isSameDay(new Date(e.date), selectedDay));
  }, [events, selectedDay]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDay || !title.trim()) return;
    startTransition(async () => {
      await createEvent({
        title,
        date: selectedDay,
        category,
        color: CATEGORY_COLORS[category],
      });
      setTitle("");
      setShowCreate(false);
    });
  }

  return (
    <>
      <GlassCard className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{formatDateCa(month, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setMonth(subMonths(month, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMonth(startOfMonth(new Date()))}
            >
              {t.calendar.today}
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
          {t.calendar.weekdaysShort.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEv = events.filter((ev) =>
              isSameDay(new Date(ev.date), day)
            );
            const selected = selectedDay && isSameDay(day, selectedDay);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[88px] rounded-lg border border-border/40 p-2 text-left transition-all hover:border-primary/30 hover:bg-muted/30",
                  !isSameMonth(day, month) && "opacity-40",
                  isToday(day) && "ring-1 ring-primary/40",
                  selected && "border-primary/50 bg-primary/5"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday(day) && "text-primary"
                  )}
                >
                  {formatDateCa(day, "d")}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEv.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="truncate rounded px-1 py-0.5 text-[10px] text-white"
                      style={{
                        backgroundColor:
                          ev.color ??
                          CATEGORY_COLORS[ev.category as EventCategory],
                      }}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEv.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">
                      {t.calendar.more(dayEv.length - 2)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {EVENT_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              {eventCategoryLabel(cat)}
            </div>
          ))}
        </div>
      </GlassCard>

      <Dialog
        open={!!selectedDay}
        onOpenChange={(open) => !open && setSelectedDay(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? formatDateCa(selectedDay, "EEEE, d MMM") : ""}
            </DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {dayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.calendar.noEvents}</p>
              ) : (
                dayEvents.map((ev) => (
                  <motion.div
                    key={ev.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{ev.title}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {eventCategoryLabel(ev.category)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => deleteEvent(ev.id)}
                    >
                      {t.calendar.remove}
                    </Button>
                  </motion.div>
                ))
              )}
              <Button
                size="sm"
                className="w-full gap-1.5"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="h-4 w-4" />
                {t.calendar.addEvent}
              </Button>
            </div>
          </AnimatePresence>
          {showCreate && (
            <form onSubmit={handleCreate} className="mt-4 space-y-3 border-t pt-4">
              <div className="space-y-2">
                <Label>{t.calendar.titleLabel}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t.habits.category}</Label>
                <Select
                  value={category}
                  onValueChange={(v) =>
                    v && setCategory(v as EventCategory)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {eventCategoryLabel(c)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {t.calendar.saveEvent}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
