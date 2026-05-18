
import Hero from "../../Components/Customer/Hero";
import QualificationSection from "../../Components/Customer/Qulifaction";
import Experties from "../../Components/Customer/Experties";
import ScheduleSection from "../../features/schedules/ScheduleSection";
import TransformationsSection from "../../Components/Customer/TransformationsSection";

const Home = () => {
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

