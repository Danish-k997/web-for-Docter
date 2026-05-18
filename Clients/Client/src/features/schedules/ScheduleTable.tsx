import { memo } from "react";
import type { DoctorSchedule, ScheduleDoctor } from "./scheduleTypes";

type ScheduleTableProps = {
  schedules: DoctorSchedule[];
  isLoading?: boolean;
  errorMessage?: string | null;
};

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hour, minute));
};

const getDoctorName = (doctor: DoctorSchedule["doctorId"]) => {
  if (!doctor || typeof doctor === "string") return "Doctor";
  return (
    (doctor as ScheduleDoctor).name ||
    (doctor as ScheduleDoctor).username ||
    (doctor as ScheduleDoctor).email ||
    "Doctor"
  );
};

const getDoctorSpecialization = (doctor: DoctorSchedule["doctorId"]) => {
  if (!doctor || typeof doctor === "string") return "General consultation";
  return (doctor as ScheduleDoctor).specialization || "General consultation";
};

const getDoctorInitial = (doctor: DoctorSchedule["doctorId"]) =>
  getDoctorName(doctor).charAt(0).toUpperCase();

const ClockIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const PinIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const DoctorIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M8 3v5a4 4 0 0 0 8 0V3" />
    <path d="M6 3h4" />
    <path d="M14 3h4" />
    <path d="M12 12v2a5 5 0 0 0 10 0v-1" />
    <circle cx="21" cy="12" r="1" />
  </svg>
);

const ScheduleTable = memo(
  ({ schedules, isLoading = false, errorMessage = null }: ScheduleTableProps) => {
    if (isLoading) {
      return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse border-b border-slate-100 bg-slate-50 last:border-b-0"
            />
          ))}
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {errorMessage}
        </div>
      );
    }

    if (schedules.length === 0) {
      return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <CalendarIcon />
          <h3 className="mt-4 text-lg font-bold text-slate-950">
            No schedule available
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Doctor availability will appear here once the admin adds it.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="block space-y-4 sm:hidden">
          {schedules.map((schedule) => (
            <article
              key={schedule._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="inline-flex rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700">
                {schedule.dayOfWeek}
              </span>

              <div className="mt-5 flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">
                  {getDoctorInitial(schedule.doctorId)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold leading-tight text-slate-950">
                    {getDoctorName(schedule.doctorId)}
                  </h3>
                  <p className="mt-1 truncate text-base text-slate-500">
                    {getDoctorSpecialization(schedule.doctorId)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3 text-slate-500">
                    <ClockIcon className="h-4 w-4 text-slate-900" />
                    <p className="text-sm font-semibold uppercase tracking-wider">
                      Shift Timings
                    </p>
                  </div>
                  <p className="mt-2 pl-7 text-lg font-semibold text-slate-950">
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3 text-slate-500">
                    <PinIcon className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-semibold uppercase tracking-wider">
                      Location
                    </p>
                  </div>
                  <p className="mt-2 break-words pl-7 text-lg font-semibold leading-7 text-slate-950">
                    {schedule.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
          <table className="w-full divide-y divide-slate-200">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {schedules.map((schedule) => (
                <tr
                  key={schedule._id}
                  className="transition-all duration-200 hover:bg-teal-50/60"
                >
                  <td className="whitespace-nowrap px-6 py-6 align-middle">
                    <span className="inline-flex rounded-lg bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">
                      {schedule.dayOfWeek}
                    </span>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <DoctorIcon className="h-5 w-5 shrink-0 text-teal-700" />
                      <p className="max-w-44 whitespace-normal text-base font-bold leading-5 text-slate-950">
                        {getDoctorName(schedule.doctorId)}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-6 align-middle text-base font-medium text-slate-800">
                    <span className="inline-flex items-center gap-3">
                      <ClockIcon className="h-5 w-5 text-teal-700" />
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </span>
                  </td>
                  <td className="px-6 py-6 align-middle text-base text-slate-700">
                    <span className="inline-flex items-center gap-3">
                      <PinIcon className="h-5 w-5 shrink-0 text-teal-700" />
                      <span className="break-words leading-6">{schedule.location}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  },
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-11 w-11 text-slate-400"
    aria-hidden
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

ScheduleTable.displayName = "ScheduleTable";

export default ScheduleTable;
