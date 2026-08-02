const HowItWorks = () => {
  const steps = [
    {
      step: '1',
      title: 'List Your Item',
      description: 'Take a photo and fill in details. It takes less than 2 minutes to list your item.',
      icon: '📝'
    },
    {
      step: '2',
      title: 'Connect with Buyers',
      description: 'Interested students will contact you directly on WhatsApp or email.',
      icon: '💬'
    },
    {
      step: '3',
      title: 'Complete the Sale',
      description: 'Meet on campus, hand over the item, and get paid instantly via UPI.',
      icon: '✔️'
    }
  ];

  return (
    <section className="pt-16 pb-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">How It Works</h2>
          <p className="text-blue-300 uppercase tracking-wider mb-3 text-sm">Selling your old items is as easy as 1-2-3</p>
          <p className="text-base md:text-lg text-slate-300">Follow the simple steps below and start trading on CampusMarket today.</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute inset-x-0 top-36 h-0.5 bg-gradient-to-r from-blue-500/70 via-indigo-500/60 to-emerald-500/70"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center px-3">
                <div className="relative mx-auto h-20 w-20 md:h-22 md:w-22 rounded-full bg-slate-800/30 border border-white/20 shadow-[0_0_20px_rgba(15,23,42,0.35)]">
                  <div className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl text-white/90">{step.icon}</div>
                  <div className={`absolute -top-1 -right-1 h-7 w-7 rounded-full text-[11px] font-bold flex items-center justify-center text-white ${index===0?'bg-blue-500':index===1?'bg-violet-500':'bg-emerald-500'} shadow-lg`}>{step.step}</div>
                </div>

                <h3 className="mt-6 text-xl md:text-2xl font-extrabold text-white">{step.title}</h3>
                <p className="mt-2 text-sm md:text-base text-slate-300 mx-auto max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
