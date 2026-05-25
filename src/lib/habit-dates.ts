import {
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
const WEEK_LABELS = ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"];

function dayLabel(date: Date): string {
  return WEEK_LABELS[date.getDay()];
}

export type DaySlot = {
  date: Date;
  label: string;
  dayNum: number;
  isToday: boolean;
  completed: boolean;
};

export function getLast7DaySlots(
  completions: { date: Date }[],
  reference = new Date()
): DaySlot[] {
  const today = startOfDay(reference);
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date,
      label: dayLabel(date),
      dayNum: date.getDate(),
      isToday: isSameDay(date, today),
      completed: completions.some((c) => isSameDay(c.date, date)),
    };
  });
}

export function getCurrentWeekSlots(
  completions: { date: Date }[],
  reference = new Date()
): DaySlot[] {
  const start = startOfWeek(reference, { weekStartsOn: 1 });
  const end = endOfWeek(reference, { weekStartsOn: 1 });
  const today = startOfDay(reference);

  return eachDayOfInterval({ start, end }).map((date) => ({
    date: startOfDay(date),
    label: dayLabel(date),
    dayNum: date.getDate(),
    isToday: isSameDay(date, today),
    completed: completions.some((c) => isSameDay(c.date, date)),
  }));
}
