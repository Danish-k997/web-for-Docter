import { animateScroll } from "react-scroll";
import {
  NAVBAR_SCROLL_OFFSET,
  SCROLL_DURATION,
  SCROLL_SMOOTH_EASING,
  type HomeSectionName,
} from "../config/navigation";

export const scrollToHomeSection = (target: HomeSectionName) => {
  const section = document.getElementById(target);
  if (!section) return;

  const initialScrollY = window.scrollY;
  const sectionTop =
    section.getBoundingClientRect().top + window.scrollY + NAVBAR_SCROLL_OFFSET;

  animateScroll.scrollTo(sectionTop, {
    duration: SCROLL_DURATION,
    smooth: SCROLL_SMOOTH_EASING,
  });

  window.setTimeout(() => {
    if (Math.abs(window.scrollY - initialScrollY) > 2) return;

    if (typeof section.scrollIntoView === "function") {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.hash = target;
  }, 120);
};
