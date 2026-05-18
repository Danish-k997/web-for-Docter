import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  FileImage,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Search,
  UserRound,
  CalendarPlus,
} from "lucide-react";
import {
  getAllReports,
  getRequestErrorMessage,
  type ReportItem,
} from "../../Serveces/apiservices";
import DashboardSidebar, {
  type DashboardNavItem,
} from "./components/DashboardSidebar";
import ReportImageViewer from "./components/ReportImageViewer";

const PAGE_LIMIT = 12;
const SEARCH_DEBOUNCE_MS = 350;

type PatientCardProps = {
  report: ReportItem;
  onSelect: (report: ReportItem) => void;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const normalizeSearchValue = (value: string | null | undefined) =>
  (value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase();

const getReportImages = (report: ReportItem) => report.images ?? [];

const PatientCard = memo(({ report, onSelect }: PatientCardProps) => {
  const images = getReportImages(report);
  const coverImage = images.find((image) => image.url);
  const patientName = report.name || "Unknown patient";
  const reportTitle = report.title || "Medical report";

  const handleSelect = useCallback(() => {
    onSelect(report);
  }, [onSelect, report]);

  return (
    <button
      type="button"
      onClick={handleSelect}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:min-h-32 sm:flex-row sm:items-stretch"
    >
      <div className="aspect-[4/3] w-full shrink-0 bg-slate-100 sm:h-auto sm:w-32 sm:aspect-auto">
        {coverImage ? (
          <img
            src={coverImage.url}
            alt={patientName}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <FileImage className="h-8 w-8" aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 p-4 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
            <UserRound className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-950 sm:truncate sm:text-base">
              {patientName}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
              {reportTitle}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 sm:bg-transparent sm:px-0 sm:py-0">
            <CalendarDays className="h-4 w-4 text-teal-700" aria-hidden />
            {formatDate(report.date)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 sm:bg-transparent sm:px-0 sm:py-0">
            <FileImage className="h-4 w-4 text-teal-700" aria-hidden />
            {images.length} image{images.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </button>
  );
});

PatientCard.displayName = "PatientCard";

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

const Dashbord = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearch(normalizeSearchValue(searchValue));
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timerId);
  }, [searchValue]);

  const patientSearchIndex = useMemo(() => {
    const index = new Map<string, string>();

    for (const report of reports) {
      index.set(
        report._id,
        `${normalizeSearchValue(report.name)} ${normalizeSearchValue(report.title)}`,
      );
    }

    return index;
  }, [reports]);

  const visibleReports = useMemo(() => {
    if (!debouncedSearch) return reports;

    return reports.filter((report) => {
      const indexedReport = patientSearchIndex.get(report._id);
      return indexedReport?.includes(debouncedSearch);
    });
  }, [debouncedSearch, patientSearchIndex, reports]);

  const loadReports = useCallback(
    async (mode: "reset" | "append", cursor: string | null = null) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (mode === "append") {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }
      setErrorMessage(null);

      try {
        const response = await getAllReports({
          limit: PAGE_LIMIT,
          cursor: mode === "append" ? cursor : null,
          search: debouncedSearch,
        });

        if (requestId !== requestIdRef.current) return;

        setReports((current) =>
          mode === "append" ? [...current, ...response.data] : response.data,
        );
        setHasNextPage(response.hasNextPage);
        setNextCursor(response.nextCursor ?? null);
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setErrorMessage(getRequestErrorMessage(error));
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsInitialLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [debouncedSearch],
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadReports("reset");
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadReports, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isLoadingMore) return;
    loadReports("append", nextCursor);
  }, [hasNextPage, isLoadingMore, loadReports, nextCursor]);

  const handleSelectReport = useCallback((report: ReportItem) => {
    setSelectedReport(report);
  }, []);

  const closeViewer = useCallback(() => {
    setSelectedReport(null);
  }, []);

  if (selectedReport) {
    return <ReportImageViewer report={selectedReport} onClose={closeViewer} />;
  }

  return (
    <section className="min-h-screen bg-slate-50 text-slate-950">
      <div className="lg:flex">
        <DashboardSidebar items={dashboardNavItems} />

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                  All patient reports
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Reports Dashboard
                </h2>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isInitialLoading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isInitialLoading ? "animate-spin" : ""}`}
                  aria-hidden
                />
                Refresh
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <label
                htmlFor="patient-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search patient
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="patient-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search by patient name or report title"
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                {errorMessage}
              </div>
            )}

            {isInitialLoading ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-lg border border-slate-200 bg-white"
                  />
                ))}
              </div>
            ) : visibleReports.length === 0 ? (
              <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                <FileImage className="h-12 w-12 text-slate-400" aria-hidden />
                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  No reports found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Try a different patient name or refresh the dashboard.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleReports.map((report) => (
                  <PatientCard
                    key={report._id}
                    report={report}
                    onSelect={handleSelectReport}
                  />
                ))}
              </div>
            )}

            {visibleReports.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={!hasNextPage || isLoadingMore || isInitialLoading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#004d40] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingMore && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  )}
                  {hasNextPage ? "Load more reports" : "All reports loaded"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Dashbord;
