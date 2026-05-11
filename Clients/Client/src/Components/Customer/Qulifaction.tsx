
import { GraduationCap, Globe, ShieldCheck } from 'lucide-react'; // Lucide-react icons industry standard hain

const QualificationSection = () => {
  const credentials = [
    {
      icon: <GraduationCap className="w-6 h-6 text-emerald-700" />,
      title: "MBBS, Fellowship",
      subtitle: "Dermatology Specialist"
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-700" />,
      title: "PGD Dermatology",
      subtitle: "University of Chester, U.K"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-700" />,
      title: "Aesthetic Medicine",
      subtitle: "Certified Professional"
    }
  ];

  return (
    <div className="bg-white border-y border-emerald-100 shadow-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {credentials.map((item, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualificationSection;