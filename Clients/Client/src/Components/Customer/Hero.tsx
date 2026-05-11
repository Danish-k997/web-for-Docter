import img from "../../assets/dot.png"

const Hero = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#f8faf9]">
      
      {/* Step 1: Background Grid Pattern (Industry Method) */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(20, 83, 45, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(20, 83, 45, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Step 2: Content Container */}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Text Content */}
        <div className="flex flex-col gap-6">
          <span className="inline-block px-4 py-1 text-sm font-semibold tracking-wide text-emerald-800 uppercase bg-emerald-100/50 rounded-full w-fit border border-emerald-200">
            Clinical Excellence
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1]">
            Expert Care, <br /> 
            <span className="text-emerald-700 text-opacity-90">Personalized</span> for You
          </h1>
          
          <p className="text-lg text-slate-600 max-w-lg">
            Experience world-class healthcare with Dr. Ayushi Sinha. We prioritize your well-being with advanced medical expertise.
          </p>

          <div className="flex gap-4">
            <button className="px-8 py-4 bg-emerald-900 text-white rounded-lg font-medium hover:bg-emerald-800 transition-all shadow-lg">
              Book Appointment
            </button>
          </div>
        </div>

        {/* Right Side: Professional Image Placeholder */}
        <div className="relative">
          <div className="relative z-10 rounded-2xl overflow-hidden border-8 border-white shadow-2xl">
            <img 
              src={img} 
              alt="Dr. Ayushi Sinha" 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Accent element like the red dot in your image */}
          <div className="absolute -right-4 top-20 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-xl z-20">
            *
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;