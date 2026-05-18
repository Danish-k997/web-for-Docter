import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import {
  formatTime12Display,
  getMinuteOptionsForValue,
  HOUR_12_OPTIONS,
  MERIDIEM_OPTIONS,
  time24FromPartsOrFallback,
  toTime24,
  type Time12Parts,
} from "./scheduleTimeUtils";

type ScheduleTimePickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (time24: string) => void;
  error?: string;
  fallbackParts?: Time12Parts;
};

const selectClassName =
  "min-h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 text-center text-sm font-semibold text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

const ScheduleTimePicker = ({
  id,
  label,
  value,
  onChange,
  error,
  fallbackParts = { hour: 9, minute: 0, period: "AM" },
}: ScheduleTimePickerProps) => {
  const parts = useMemo(
    () => time24FromPartsOrFallback(value, fallbackParts),
    [value, fallbackParts],
  );

  const minuteOptions = useMemo(
    () => getMinuteOptionsForValue(parts.minute),
    [parts.minute],
  );

  const preview = formatTime12Display(value || toTime24(parts));
  const errorId = error ? `${id}-error` : undefined;

  const updateParts = (next: Partial<Time12Parts>) => {
    onChange(toTime24({ ...parts, ...next }));
  };

  return (
    <div>
      <label
        htmlFor={`${id}-hour`}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
      >
        <Clock3 className="h-4 w-4 text-slate-400" aria-hidden />
        {label}
      </label>

      <div
        className={`rounded-xl border bg-slate-50/80 p-3 transition ${
          error ? "border-red-300 ring-1 ring-red-200" : "border-slate-200"
        }`}
      >
        <div className="flex items-stretch gap-2">
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Hour
            </span>
            <select
              id={`${id}-hour`}
              value={parts.hour}
              onChange={(event) =>
                updateParts({ hour: Number(event.target.value) })
              }
              aria-label={`${label} hour`}
              aria-describedby={errorId}
              className={selectClassName}
            >
              {HOUR_12_OPTIONS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>

          <span
            className="flex items-end pb-2.5 text-lg font-bold text-slate-400"
            aria-hidden
          >
            :
          </span>

          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Min
            </span>
            <select
              id={`${id}-minute`}
              value={parts.minute}
              onChange={(event) =>
                updateParts({ minute: Number(event.target.value) })
              }
              aria-label={`${label} minute`}
              aria-describedby={errorId}
              className={selectClassName}
            >
              {minuteOptions.map((minute) => (
                <option key={minute} value={minute}>
                  {String(minute).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[5.5rem] shrink-0">
            <span className="mb-1 block text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">
              AM / PM
            </span>
            <div
              role="group"
              aria-label={`${label} AM or PM`}
              className="grid min-h-11 grid-cols-2 overflow-hidden rounded-lg border border-slate-300 bg-slate-50 p-0.5"
            >
              {MERIDIEM_OPTIONS.map((period) => {
                const isActive = parts.period === period;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => updateParts({ period })}
                    aria-pressed={isActive}
                    className={`rounded-md text-xs font-bold uppercase tracking-wide transition ${
                      isActive
                        ? "bg-[#004d40] text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p
          className="mt-3 text-center text-sm font-medium text-teal-800"
          aria-live="polite"
        >
          Selected: <span className="font-bold">{preview}</span>
        </p>
      </div>

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default ScheduleTimePicker;
