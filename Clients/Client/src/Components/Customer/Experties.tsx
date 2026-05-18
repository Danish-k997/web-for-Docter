import React from 'react';
import { Stethoscope, Video, Sparkles } from 'lucide-react';
import { Element } from 'react-scroll';
import { HOME_SECTIONS } from '../../config/navigation';

const Expertise = () => {
  const expertiseData = [
    {
      icon: <Stethoscope className="w-8 h-8 text-emerald-700" />,
      title: "General Medicine",
      details: "Comprehensive primary care addressing everyday health concerns with a focus on preventative wellness.",
      tags: ["Prevention", "Diagnostics"],
      bgColor: "bg-emerald-50"
    },
    {
      icon: <Video className="w-8 h-8 text-emerald-900" />,
      title: "Online Consultation",
      details: "Get expert medical advice from the comfort of your home via secure high-definition video calls.",
      tags: ["Remote Care", "Fast Access"],
      bgColor: "bg-[#064e3b]" 
    },
    {
      icon: <Sparkles className="w-8 h-8 text-emerald-700" />,
      title: "Specialist In",
      details: "Expert care for Hair, Nail, Leprosy, Face & Acne, Vitiligo, Skin & Venereal diseases.",
      tags: ["Dermatology", "Cosmetology"],
      bgColor: "bg-emerald-50"
    }
  ];

  return (
    <Element
      name={HOME_SECTIONS.expertise}
      id={HOME_SECTIONS.expertise}
      className="scroll-mt-[88px] py-20 bg-[#f8faf9] relative"
    >
      <div className="container mx-auto px-6">
        
        {/* Header Part */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Medical Expertise</h2>
          <p className="text-slate-600 text-lg">
            Specialized healthcare solutions tailored to provide clarity and recovery through clinical innovation.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseData.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              {/* Icon Container */}
              <div className={`${item.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {/* Agar dark background hai toh icon white kar dena logic yahan add kar sakte hain */}
                {React.cloneElement(item.icon, { 
                  className: item.bgColor.includes('bg-[#064e3b]') ? 'text-white' : 'text-emerald-700' 
                })}
              </div>

              {/* Title & Details */}
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                {item.details}
              </p>

              {/* Tags/Badges - Industry Standard way to show small info */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, tIndex) => (
                  <span 
                    key={tIndex} 
                    className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Element>
  );
};

export default Expertise;
