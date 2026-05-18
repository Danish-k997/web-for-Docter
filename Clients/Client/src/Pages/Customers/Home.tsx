
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../../Components/Customer/Hero";
import QualificationSection from "../../Components/Customer/Qulifaction";
import Experties from "../../Components/Customer/Experties";
import ScheduleSection from "../../features/schedules/ScheduleSection";
import TransformationsSection from "../../Components/Customer/TransformationsSection";
import { scrollToHomeSection } from "../../Utlis/scrollToHomeSection";
import {
  HOME_SECTIONS,
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
      scrollToHomeSection(state.scrollTo!);
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

