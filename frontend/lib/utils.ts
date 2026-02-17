import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date only (e.g., "January 15, 2025")
 */
export function formatEventDate(date: string | Date): string {
  return format(new Date(date), 'PPP');
}

/**
 * Format time only (e.g., "10:00 AM")
 */
export function formatEventTime(date: string | Date): string {
  return format(new Date(date), 'p');
}

/**
 * Format full date and time (e.g., "January 15, 2025 10:00 AM")
 */
export function formatEventDateTime(date: string | Date): string {
  return format(new Date(date), 'PPP p');
}
