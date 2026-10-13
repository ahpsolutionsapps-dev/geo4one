import dayjs from "dayjs";

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}

export function formatDateInput(date: Date | string | number): string {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}
