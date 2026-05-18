import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileImage,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getReports,
  getRequestErrorMessage,
  type ReportItem,
} from "../../Serveces/apiservices";

const PAGE_SIZE = 6;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const Myreport = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canGoBack = page > 1 && !isLoading;
  const canGoNext = page < totalPages && !isLoading;

  const selectedImages = useMemo(
    () => selectedReport?.images.filter((image) => Boolean(image.url)) ?? [],
    [selectedReport],
  );

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getReports(page, PAGE_SIZE);

        setReports(response.data);
        setTotalPages(Math.max(response.pagination.totalPages, 1));
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [page, refreshKey]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    setPage(nextPage);
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Medical records
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Reports
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              View your uploaded reports and add new medical documents anytime.
            </p>
          </div>

          <Link
            to="/myreport/add"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#004d40] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004d40]"
          >
            <Plus className="h-5 w-5" aria-hidden />
            Add Report
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Report List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {totalItems} report{totalItems === 1 ? "" : "s"} found
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              disabled={isLoading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                aria-hidden
              />
              Refresh
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="mt-5 flex flex-col items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
              <FileImage className="h-10 w-10 text-slate-400" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                No reports yet
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                Add your first report with name, date, and images. It will show
                here after upload.
              </p>
              <Link
                to="/myreport/add"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#004d40] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add Report
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {reports.map((report) => {
                const coverImage = report.images.find((image) => image.url);

                return (
                  <article
                    key={report._id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-teal-200"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {coverImage ? (
                          <img
                            src={coverImage.url}
                            alt={report.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FileImage
                              className="h-8 w-8 text-slate-400"
                              aria-hidden
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-slate-950">
                          {report.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            className="h-4 w-4 text-teal-700"
                            aria-hidden
                          />
                          <span>{formatDate(report.date)}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {report.images.length} image
                          {report.images.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-3">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
                      >
                        <Eye className="h-4 w-4" aria-hidden />
                        View Report
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {reports.length > 0 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:flex">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={!canGoBack}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={!canGoNext}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-white shadow-xl sm:mx-auto sm:max-w-3xl sm:rounded-lg">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-950">
                  {selectedReport.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {formatDate(selectedReport.date)} - {selectedImages.length}{" "}
                  image{selectedImages.length === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close report"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
              {selectedImages.map((image, index) => (
                <a
                  key={image._id ?? image.url}
                  href={image.url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                >
                  <img
                    src={image.url}
                    alt={`${selectedReport.name} image ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="px-3 py-2 text-sm font-medium text-slate-700">
                    Image {index + 1}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Myreport;
