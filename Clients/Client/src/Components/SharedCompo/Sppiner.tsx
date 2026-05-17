import type { CSSProperties } from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

type SppinerProps = {
  size?: SpinnerSize | number;
  color?: string;
  thickness?: number;
  label?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
  spinnerClassName?: string;
};

const sizeMap: Record<SpinnerSize, number> = {
  sm: 24,
  md: 40,
  lg: 56,
  xl: 72,
};

const Sppiner = ({
  size = "md",
  color = "#0f766e",
  thickness = 4,
  label = "Loading...",
  fullScreen = false,
  overlay = false,
  className = "",
  spinnerClassName = "",
}: SppinerProps) => {
  const spinnerSize = typeof size === "number" ? size : sizeMap[size];

  const wrapperClassName = [
    "flex items-center justify-center",
    fullScreen ? "min-h-screen w-full" : "",
    overlay ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinnerStyle: CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    borderWidth: thickness,
    color,
  };

  return (
    <div className={wrapperClassName} role="status" aria-live="polite">
      <span
        className={[
          "inline-block animate-spin rounded-full border-solid border-current border-t-transparent",
          spinnerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={spinnerStyle}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export type { SppinerProps };
export default Sppiner;
