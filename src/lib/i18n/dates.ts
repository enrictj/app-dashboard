import { format } from "date-fns";
import { ca as dateFnsCa } from "date-fns/locale";

export { dateFnsCa };

export function formatDateCa(date: Date, pattern: string): string {
  return format(date, pattern, { locale: dateFnsCa });
}
