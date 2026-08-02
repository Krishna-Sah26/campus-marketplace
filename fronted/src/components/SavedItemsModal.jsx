/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const SavedItemsModal = ({ onClose, authToken, onViewDetails }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSavedItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/me/saved', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setListings(data.listings);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedItems();
  }, [authToken]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Saved Items</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No saved items yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
                  onClick={() => {
                    onViewDetails(listing);
                    onClose();
                  }}
                >
                  <img src={listing.image} alt={listing.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{listing.name}</h3>
                    <p className="text-slate-600">${listing.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedItemsModal;
