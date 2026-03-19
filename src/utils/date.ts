export function formatDateForInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
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