/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const AdminDashboard = ({ onClose, authToken }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    setLoading(true);
    fetch('http://localhost:5000/api/admin/pending-listings', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then(data => {
        setListings(data.listings);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadListings();
  }, [authToken]);

  const handleVerify = async (id) => {
    if (!window.confirm('Are you sure you want to verify this payment and approve the listing?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}/verify-payment`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      loadListings();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="text-center py-8">Loading pending listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No pending verifications at the moment!</div>
          ) : (
            <div className="space-y-6">
              {listings.map(listing => (
                <div key={listing._id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex flex-col md:flex-row">
                    <img src={listing.image} alt={listing.name} className="w-full md:w-64 h-48 object-cover" />
                    <div className="p-6 flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{listing.name}</h3>
                      <p className="text-slate-600 mb-4">{listing.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500">Price</p>
                          <p className="text-xl font-semibold text-blue-600">Rs. {listing.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Listing Fee</p>
                          <p className="text-xl font-semibold text-yellow-600">Rs. {listing.listingFee}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">Seller: {listing.sellerName} ({listing.sellerEmail})</p>
                      {listing.paymentScreenshot && (
                        <div className="mb-4">
                          <p className="text-sm text-slate-500 mb-2">Payment Screenshot:</p>
                          <img
                            src={listing.paymentScreenshot}
                            alt="Payment Proof"
                            className="w-full max-w-xs h-auto rounded-lg border border-slate-200"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => handleVerify(listing._id)}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                      >
                        Verify Payment & Approve
                      </button>
                    </div>
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

export default AdminDashboard;
