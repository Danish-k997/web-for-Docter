export type Meridiem = "AM" | "PM";

export type Time12Parts = {
  hour: number;
  minute: number;
  period: Meridiem;
};

const TIME_24_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const HOUR_12_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

export const MINUTE_STEP = 5;

export const MINUTE_OPTIONS = Array.from(
  { length: 60 / MINUTE_STEP },
  (_, index) => index * MINUTE_STEP,
);

export const MERIDIEM_OPTIONS: Meridiem[] = ["AM", "PM"];

export function parseTime24(time: string): Time12Parts | null {
  const match = TIME_24_PATTERN.exec(time.trim());
  if (!match) return null;

  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  const period: Meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;

  return { hour, minute, period };
}

export function toTime24(parts: Time12Parts): string {
  let hour24 = parts.hour % 12;
  if (parts.period === "PM") {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

export function compareTime24(a: string, b: string): number {
  return a.localeCompare(b);
}

export function formatTime12Display(time24: string): string {
  const parts = parseTime24(time24);
  if (!parts) return time24;

  const minute = String(parts.minute).padStart(2, "0");
  return `${parts.hour}:${minute} ${parts.period}`;
}

export function getMinuteOptionsForValue(minute: number): number[] {
  if (MINUTE_OPTIONS.includes(minute)) {
    return MINUTE_OPTIONS;
  }

  return [...MINUTE_OPTIONS, minute].sort((a, b) => a - b);
}

export function time24FromPartsOrFallback(
  time24: string,
  fallback: Time12Parts,
): Time12Parts {
  return parseTime24(time24) ?? fallback;
}
