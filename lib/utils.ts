import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMonday(date: Date): Date {
  const result = new Date(date);
  const diff = result.getDay() === 0 ? -6 : 1 - result.getDay();
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

export function formatDateShort(dateObj: Date) {
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
