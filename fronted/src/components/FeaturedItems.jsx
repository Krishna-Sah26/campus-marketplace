/* eslint-disable react/prop-types */

const FeaturedItems = ({ items, searchTerm, onViewDetails }) => {
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      item.category.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
          <div className="section-divider" />
          <p className="text-xl text-gray-600 mt-4">Discover amazing deals from fellow students</p>
        </div>

        <div className="mb-6">
          <p className="text-center text-gray-500">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Search results for all items'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            const sellerName =
              item.sellerId && typeof item.sellerId === 'object' ? item.sellerId.name : item.sellerName;
            const sellerCampus = item.campus || item.sellerId?.campus || '';

            return (
              <div
                key={item._id || item.id}
                className="card fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  {item.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Verified
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-2 left-2 bg-cyan-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    {item.condition && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {item.condition}
                      </span>
                    )}
                    {sellerCampus && (
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">
                        {sellerCampus}
                      </span>
                    )}
                    {sellerName && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                        By {sellerName}
                      </span>
                    )}
                    {typeof item.views === 'number' && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        {item.views} views
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                    </div>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>

                  <button className="w-full mt-4 btn-primary" onClick={() => onViewDetails?.(item)}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
