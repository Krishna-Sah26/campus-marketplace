const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(2, 6, 23, 0.28), rgba(15, 23, 42, 0.42)), url('/background.jpg')",
          
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        {/* Bottom haze only (as requested) */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/80 via-white/35 to-transparent"></div>
      </div>
       

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 fade-in">
        <div className="mt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium shadow-sm bg-white/10 border-white/20 text-white">
            <span className="text-emerald-400 text-base">*</span>
            The #1 Marketplace for Students
          </div>
        </div>



        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Buy & Sell on
        </h1>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Campus <span className="text-cyan-400">Easily</span>
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-slate-100">
          Your exclusive college marketplace for textbooks, lab equipment, electronics, and everything else you need to survive the semester.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-10 py-4 rounded-full font-semibold shadow-xl transition-transform transform hover:-translate-y-1">
            Browse Listings
          </button>
          <button className="border border-white/60 text-white text-lg px-10 py-4 rounded-full font-semibold hover:bg-white/20 transition">
            Sell Something
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <p className="text-4xl font-black">500+</p>
            <p className="text-sm text-gray-200">Items Listed</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <p className="text-4xl font-black">1,200+</p>
            <p className="text-sm text-gray-200">Active Students</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <p className="text-4xl font-black">100%</p>
            <p className="text-sm text-gray-200">Safe & Secure</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
