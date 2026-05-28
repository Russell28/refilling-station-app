export function formatDateForInput(value: string | Date | null): string {
  if (!value) return "";

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // assume string
  return value.slice(0, 10);
}

export function getToday() {
  return new Date();
}

export function getCurrentMonthInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function formatTimeForInput(value?: string | null) {
  if (!value) return "";

  if (value.length >= 5 && value.includes(":") && !value.includes("T")) {
    return value.slice(0, 5);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export const getTodayDateOnly = (): string => {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
};

export function getFirstDayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay(); // Sunday = 0, Monday = 1, ...
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  // if Sunday (0), go back 6 days, else subtract (day - 1)

  const firstDay = new Date(today.setDate(diff));
  return firstDay.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export function getFirstDayOfCurrentMonth(): string {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDay.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
}
