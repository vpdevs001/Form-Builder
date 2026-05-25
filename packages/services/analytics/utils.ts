import type { AnalyticsDateInterval, FieldValueCount } from "./types";

export function safeParseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function formatPeriod(date: Date, interval: AnalyticsDateInterval): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  if (interval === "MONTH") {
    return `${year}-${month}`;
  }

  if (interval === "WEEK") {
    const tempDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
    const dayOfWeek = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() - dayOfWeek + 1);
    const weekStart = tempDate;
    const weekYear = weekStart.getUTCFullYear();
    const weekMonth = String(weekStart.getUTCMonth() + 1).padStart(2, "0");
    const weekDay = String(weekStart.getUTCDate()).padStart(2, "0");
    return `${weekYear}-${weekMonth}-${weekDay}`;
  }

  return `${year}-${month}-${day}`;
}

export function countValues(values: string[], fieldType: string): FieldValueCount[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (fieldType === "MULTI_SELECT") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === "string") {
              counts.set(item, (counts.get(item) ?? 0) + 1);
            }
          }
          continue;
        }
      } catch {
        // ignore parse failure and fall through to treat as raw string
      }
    }

    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export default {};
