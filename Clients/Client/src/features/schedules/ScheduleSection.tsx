import { useCallback, useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";
import { getRequestErrorMessage } from "../../Serveces/apiservices";
import { HOME_SECTIONS } from "../../config/navigation";
import { getSchedules } from "./scheduleApi";
import ScheduleTable from "./ScheduleTable";
import type { DoctorSchedule } from "./scheduleTypes";

const ScheduleSection = () => {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadSchedules = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getSchedules();
      if (requestId !== requestIdRef.current) return;
      setSchedules(response.data);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setErrorMessage(getRequestErrorMessage(error));
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadSchedules();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadSchedules]);

  return (
    <Element
      name={HOME_SECTIONS.schedule}
      id={HOME_SECTIONS.schedule}
      className="bg-slate-50 py-14 text-slate-950 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Weekly availability
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Doctor Schedule
            </h2>
          </div>
          <button
            type="button"
            onClick={loadSchedules}
            disabled={isLoading}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              aria-hidden
            >
              <path d="M21 12a9 9 0 0 1-9 9 8.7 8.7 0 0 1-6.3-2.7" />
              <path d="M3 12a9 9 0 0 1 9-9 8.7 8.7 0 0 1 6.3 2.7" />
              <path d="M3 17v-5h5" />
              <path d="M21 7v5h-5" />
            </svg>
            Refresh
          </button>
        </div>

        <ScheduleTable
          schedules={schedules}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </Element>
  );
};

export default ScheduleSection;
