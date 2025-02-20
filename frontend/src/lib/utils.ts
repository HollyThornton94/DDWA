import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addDays, parseISO, isBefore, isAfter } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getEarliestDateForDay = (
  startDate: string,
  daysString: string,
  availableFrom: string,
  availableTo: string
) => {
  const dayNames = daysString.split(", ").map((day) => day.trim());
  const start = new Date(startDate);
  const availableStart = parseISO(availableFrom);
  const availableEnd = parseISO(availableTo);

  for (let i = 0; i < 30; i++) {
    // Check up to 30 days ahead
    const currentDate = addDays(start, i);
    const currentDayName = format(currentDate, "EEEE");

    // Ensure the date matches a valid day and is within the availability period
    if (
      dayNames.includes(currentDayName) &&
      !isBefore(currentDate, availableStart) &&
      !isAfter(currentDate, availableEnd)
    ) {
      return `${currentDayName} (${format(currentDate, "dd/MM/yyyy")})`; // Return only the first available date
    }
  }

  return null; // If no valid date is found
};
