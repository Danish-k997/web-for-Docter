import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Clock3, Loader2, MapPin, Save } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSidebar, {
  type DashboardNavItem,
} from "./components/DashboardSidebar";
import {
  addSchedule,
  getSchedules,
} from "../../features/schedules/scheduleApi";
import ScheduleTable from "../../features/schedules/ScheduleTable";
import {
  SCHEDULE_DAYS,
  type AddSchedulePayload,
  type DoctorSchedule,
  type ScheduleFieldErrors,
} from "../../features/schedules/scheduleTypes";
import { getRequestErrorMessage } from "../../Serveces/apiservices";
import { CalendarDays, ClipboardList, LayoutDashboard } from "lucide-react";

const INITIAL_FORM: AddSchedulePayload = {
  dayOfWeek: "Monday",
  startTime: "10:00",
  endTime: "15:00",
  location: "",
};

const dashboardNavItems: DashboardNavItem[] = [
  {
    label: "Reports",
    to: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Add Schedule",
    to: "/dashboard/add-schedule",
    icon: CalendarPlus,
  },
  {
    label: "My Reports",
    to: "/myreport",
    icon: ClipboardList,
  },
];

const AddSchedule = () => {
  const [form, setForm] = useState<AddSchedulePayload>(INITIAL_FORM);
  const [errors, setErrors] = useState<ScheduleFieldErrors>({});
  const [previewSchedules, setPreviewSchedules] = useState<DoctorSchedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const canSubmit = useMemo(
    () => form.dayOfWeek && form.startTime && form.endTime && form.location.trim(),
    [form],
  );

  const updateField = useCallback(
    <T extends keyof AddSchedulePayload>(key: T, value: AddSchedulePayload[T]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    },
    [],
  );

  const validate = useCallback(() => {
    const nextErrors: ScheduleFieldErrors = {};
    if (!form.dayOfWeek) nextErrors.dayOfWeek = "Day is required";
    if (!form.startTime) nextErrors.startTime = "Start time is required";
    if (!form.endTime) nextErrors.endTime = "End time is required";
    if (form.startTime >= form.endTime) {
      nextErrors.endTime = "End time must be after start time";
    }
    if (!form.location.trim()) nextErrors.location = "Location is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const refreshPreview = useCallback(async () => {
    setIsPreviewLoading(true);
    try {
      const response = await getSchedules();
      setPreviewSchedules(response.data);
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    } finally {
      setIsPreviewLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void refreshPreview();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [refreshPreview]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await addSchedule({
        ...form,
        location: form.location.trim(),
      });
      toast.success(response.message || "Schedule saved successfully");
      setForm(INITIAL_FORM);
      await refreshPreview();
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 text-slate-950">
      <div className="lg:flex">
        <DashboardSidebar items={dashboardNavItems} />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Admin only
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Add Doctor Schedule
              </h1>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,520px)_1fr]">
              <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                    <CalendarDays className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Schedule Details
                    </h2>
                    <p className="text-sm text-slate-600">
                      One schedule per day is updated automatically.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="schedule-day"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Day
                    </label>
                    <select
                      id="schedule-day"
                      value={form.dayOfWeek}
                      onChange={(event) =>
                        updateField(
                          "dayOfWeek",
                          event.target.value as AddSchedulePayload["dayOfWeek"],
                        )
                      }
                      className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                    >
                      {SCHEDULE_DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    {errors.dayOfWeek && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.dayOfWeek}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="schedule-start"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Start Time
                      </label>
                      <div className="relative">
                        <Clock3
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                          aria-hidden
                        />
                        <input
                          id="schedule-start"
                          type="time"
                          value={form.startTime}
                          onChange={(event) =>
                            updateField("startTime", event.target.value)
                          }
                          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                        />
                      </div>
                      {errors.startTime && (
                        <p className="mt-1.5 text-sm text-red-600">
                          {errors.startTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="schedule-end"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        End Time
                      </label>
                      <div className="relative">
                        <Clock3
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                          aria-hidden
                        />
                        <input
                          id="schedule-end"
                          type="time"
                          value={form.endTime}
                          onChange={(event) =>
                            updateField("endTime", event.target.value)
                          }
                          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                        />
                      </div>
                      {errors.endTime && (
                        <p className="mt-1.5 text-sm text-red-600">
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="schedule-location"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400"
                        aria-hidden
                      />
                      <textarea
                        id="schedule-location"
                        value={form.location}
                        onChange={(event) =>
                          updateField("location", event.target.value)
                        }
                        rows={4}
                        placeholder="Clinic address, room number, or online consultation link"
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#004d40] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Save className="h-4 w-4" aria-hidden />
                    )}
                    {isSubmitting ? "Saving..." : "Save Schedule"}
                  </button>
                </div>
              </form>

              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-950">
                    Current Schedule
                  </h2>
                  <button
                    type="button"
                    onClick={refreshPreview}
                    disabled={isPreviewLoading}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Refresh
                  </button>
                </div>
                <ScheduleTable
                  schedules={previewSchedules}
                  isLoading={isPreviewLoading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AddSchedule;
