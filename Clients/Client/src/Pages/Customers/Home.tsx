
import Hero from "../../Components/Customer/Hero";
import QualificationSection from "../../Components/Customer/Qulifaction";
import Experties from "../../Components/Customer/Experties";
import ScheduleSection from "../../features/schedules/ScheduleSection";

const Home = () => {
  return (
    <div>
     <Hero/>
     <QualificationSection/>
      <Experties />
     <ScheduleSection />
    </div>
  )
};

export default Home;

