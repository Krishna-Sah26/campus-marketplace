const Benefits = () => {
  const benefits = [
    {
      title: 'Campus Focused',
      description: 'Connect with students from your university and nearby campuses for trusted transactions.',
      icon: '🎓'
    },
    {
      title: 'Verified Sellers',
      description: 'Our verification system ensures you\'re dealing with real students and genuine listings.',
      icon: '✅'
    },
    {
      title: 'Save Money',
      description: 'Get great deals on textbooks, electronics, and more at prices much lower than retail.',
      icon: '💰'
    },
    {
      title: 'Eco-Friendly',
      description: 'Reduce waste by giving used items a second life instead of buying new.',
      icon: '🌱'
    },
    {
      title: 'Easy to Use',
      description: 'Simple interface designed specifically for students with busy schedules.',
      icon: '🚀'
    },
    {
      title: 'Secure Payments',
      description: 'Safe payment options and buyer protection for peace of mind.',
      icon: '🔒'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Campus Market?</h2>
          <div className="section-divider" />
          <p className="text-xl text-gray-600 mt-4">Experience the benefits of buying and selling within your academic community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;