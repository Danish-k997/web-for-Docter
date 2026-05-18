import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileImage, X } from "lucide-react";
import type { ReportItem } from "../../../Serveces/apiservices";

type ReportImageViewerProps = {
  report: ReportItem;
  onClose: () => void;
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

const ReportImageViewer = memo(({ report, onClose }: ReportImageViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = useMemo(
    () => report.images.filter((image) => Boolean(image.url)),
    [report.images],
  );

  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [report._id]);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? Math.max(images.length - 1, 0) : current - 1,
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1,
    );
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasMultipleImages) showPrevious();
      if (event.key === "ArrowRight" && hasMultipleImages) showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, onClose, showNext, showPrevious]);

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
              Patient report
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold">{report.name}</h2>
            <p className="mt-1 text-sm text-slate-300">
              {report.title} - {formatDate(report.date)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:bg-white/10 hover:text-white"
            aria-label="Close report viewer"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="relative min-h-[70vh] overflow-hidden rounded-lg border border-white/10 bg-slate-900">
          {images.length > 0 ? (
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div
                  key={image._id ?? image.url}
                  className="flex min-w-full items-center justify-center p-3 sm:p-5"
                >
                  <img
                    src={image.url}
                    alt={`${report.name} report ${index + 1}`}
                    className="max-h-[78vh] w-full object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-slate-300">
              <FileImage className="h-12 w-12" aria-hidden />
              <p className="text-sm font-medium">No image available</p>
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg bg-white/90 text-slate-950 shadow-lg transition hover:bg-white"
                aria-label="Previous report image"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg bg-white/90 text-slate-950 shadow-lg transition hover:bg-white"
                aria-label="Next report image"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {images.map((image, index) => (
              <button
                key={image._id ?? image.url}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "h-24 w-32 shrink-0 overflow-hidden rounded-lg border bg-slate-900 transition lg:h-28 lg:w-full",
                  activeIndex === index
                    ? "border-teal-300 ring-2 ring-teal-300/40"
                    : "border-white/10 opacity-70 hover:opacity-100",
                ].join(" ")}
                aria-label={`Open image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

ReportImageViewer.displayName = "ReportImageViewer";

export default ReportImageViewer;
