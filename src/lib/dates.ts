import {
  format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";

export function toDateKey(date: Date): string {
  return format(startOfDay(date), "yyyy-MM-dd");
}

export function fromDateKey(key: string): Date {
  return startOfDay(parseISO(key));
}

export function getMonthDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
}

export function getCalendarGrid(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export {
  format,
  startOfDay,
  isSameDay,
  isToday,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
};
