import { useCallback, useMemo, useRef, useState } from "react";
import beforePrp from "../../assets/disease/before prp.png";
import afterPrp from "../../assets/disease/AfterPRP.png";
import beforeHair from "../../assets/disease/beforehair.png";
import afterHair from "../../assets/disease/Afterhair.png";
import beforeFace from "../../assets/disease/beforeface.png";
import afterFace from "../../assets/Afterface.png";

type TransformationCase = {
  id: string;
  title: string;
  treatment: string;
  duration: string;
  sessions: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
};

const transformationCases: TransformationCase[] = [
  {
    id: "prp-pigmentation",
    title: "Skin Repigmentation",
    treatment: "PRP Therapy for Pigmentation",
    duration: "3 Months",
    sessions: "4 Sessions over 12 weeks",
    beforeLabel: "Before PRP",
    afterLabel: "After PRP",
    beforeImage: beforePrp,
    afterImage: afterPrp,
    beforeAlt: "Before PRP pigmentation treatment",
    afterAlt: "After PRP pigmentation treatment",
  },
  {
    id: "hair-restoration",
    title: "Hair Restoration",
    treatment: "PRP Hair Regrowth Therapy",
    duration: "4 Months",
    sessions: "5 Clinical Sessions",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeImage: beforeHair,
    afterImage: afterHair,
    beforeAlt: "Before hair restoration treatment",
    afterAlt: "After hair restoration treatment",
  },
  {
    id: "facial-renewal",
    title: "Facial Skin Renewal",
    treatment: "Clinical Skin Rejuvenation",
    duration: "8 Weeks",
    sessions: "3 Treatment Visits",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeImage: beforeFace,
    afterImage: afterFace,
    beforeAlt: "Before facial skin treatment",
    afterAlt: "After facial skin treatment",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const TransformationsSection = () => {
  const [activeCaseId, setActiveCaseId] = useState(transformationCases[0].id);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const activeCase = useMemo(
    () =>
      transformationCases.find((caseItem) => caseItem.id === activeCaseId) ??
      transformationCases[0],
    [activeCaseId],
  );
  const galleryCases = useMemo(
    () => transformationCases.filter((caseItem) => caseItem.id !== activeCase.id),
    [activeCase.id],
  );

  const updateSliderPosition = useCallback((clientX: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const position = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    setSliderPosition(position);
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      updateSliderPosition(event.clientX);
    },
    [updateSliderPosition],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      updateSliderPosition(event.clientX);
    },
    [isDragging, updateSliderPosition],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleCaseSelect = useCallback((caseId: string) => {
    setActiveCaseId(caseId);
    setSliderPosition(50);
  }, []);

  return (
    <section className="bg-white py-14 text-slate-950 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Real Transformations, Real Results
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Clinical Transformations
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Slide to compare visible treatment progress from carefully managed
            clinical care plans.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-5 lg:p-6">
          <div
            ref={sliderRef}
            role="slider"
            tabIndex={0}
            aria-label={`Before and after comparison for ${activeCase.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-xl bg-slate-200 sm:aspect-[4/3]"
          >
            <img
              src={activeCase.beforeImage}
              alt={activeCase.beforeAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={activeCase.afterImage}
                alt={activeCase.afterAlt}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            <span className="absolute bottom-4 right-4 z-10 rounded-md bg-slate-950/75 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-md sm:text-sm">
              {activeCase.beforeLabel}
            </span>
            <span className="absolute bottom-4 left-4 z-10 rounded-md bg-teal-700/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-md sm:text-sm">
              {activeCase.afterLabel}
            </span>

            <div
              className="absolute inset-y-0 z-20 flex -translate-x-1/2 items-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="h-full w-0.5 bg-white/80 shadow" />
              <div className="absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg ring-1 ring-slate-950/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="m15 18-6-6 6-6" />
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Case Study: {activeCase.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800">
                  Treatment: {activeCase.treatment}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  Duration: {activeCase.duration}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  {activeCase.sessions}
                </span>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-500 lg:max-w-sm lg:text-right">
              Results vary by diagnosis, clinical history, and treatment
              adherence.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryCases.map((caseItem) => {
            const isActive = activeCaseId === caseItem.id;

            return (
              <button
                key={caseItem.id}
                type="button"
                onClick={() => handleCaseSelect(caseItem.id)}
                className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  isActive ? "border-teal-400 ring-2 ring-teal-100" : "border-slate-200"
                }`}
              >
                <div className="grid aspect-[5/3] grid-cols-2 bg-slate-100">
                  <img
                    src={caseItem.beforeImage}
                    alt={caseItem.beforeAlt}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <img
                    src={caseItem.afterImage}
                    alt={caseItem.afterAlt}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-950">
                        {caseItem.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                        {caseItem.treatment}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                      Tap
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                      {caseItem.duration}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      View result
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;
