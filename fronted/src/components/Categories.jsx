const Categories = () => {
  const categories = [
    { name: 'Books', icon: '📚', count: '120+' },
    { name: 'Lab Equipment', icon: '🧪', count: '85+' },
    { name: 'Drawing Kits', icon: '🎨', count: '60+' },
    { name: 'Electronics', icon: '💻', count: '95+' },
    { name: 'Hostel Items', icon: '🏠', count: '75+' },
    { name: 'Aprons', icon: '👔', count: '40+' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="section-divider" />
          <p className="text-xl text-gray-600 mt-4">Find exactly what you need from our diverse range of categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="card p-6 text-center cursor-pointer group fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-blue-600 font-medium">{category.count} items</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;