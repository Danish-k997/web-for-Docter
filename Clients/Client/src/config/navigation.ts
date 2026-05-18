export const HOME_SECTIONS = {
  expertise: "expertise",
  schedule: "schedule",
} as const;

export type HomeSectionName =
  (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS];

export const NAVBAR_SCROLL_OFFSET = -88;
export const SCROLL_DURATION = 850;
export const SCROLL_SMOOTH_EASING = "easeInOutQuart";
export const SCROLL_SPY_THROTTLE = 100;
