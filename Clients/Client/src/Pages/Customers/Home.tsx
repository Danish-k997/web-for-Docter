
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import Hero from "../../Components/Customer/Hero";
import QualificationSection from "../../Components/Customer/Qulifaction";
import Experties from "../../Components/Customer/Experties";
import ScheduleSection from "../../features/schedules/ScheduleSection";
import TransformationsSection from "../../Components/Customer/TransformationsSection";
import {
  HOME_SECTIONS,
  NAVBAR_SCROLL_OFFSET,
  SCROLL_DURATION,
  SCROLL_SMOOTH_EASING,
  type HomeSectionName,
} from "../../config/navigation";

type HomeLocationState = {
  scrollTo?: HomeSectionName;
};

const isHomeSectionName = (value: unknown): value is HomeSectionName =>
  Object.values(HOME_SECTIONS).includes(value as HomeSectionName);

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as HomeLocationState | null;
    if (!isHomeSectionName(state?.scrollTo)) return;

    const timerId = window.setTimeout(() => {
      scroller.scrollTo(state.scrollTo!, {
        smooth: SCROLL_SMOOTH_EASING,
        duration: SCROLL_DURATION,
        offset: NAVBAR_SCROLL_OFFSET,
      });
      navigate(location.pathname, { replace: true, state: null });
    }, 80);

    return () => window.clearTimeout(timerId);
  }, [location.pathname, location.state, navigate]);

  return (
    <div>
     <Hero/>
     <QualificationSection/>
      <Experties />
     <TransformationsSection />
     <ScheduleSection />
    </div>
  )
};

export default Home;

