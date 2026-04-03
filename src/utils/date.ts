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

export function getFirstDayOfCurrentMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
}

export function getToday() {
    return new Date();
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