/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const SellerDashboard = ({ onClose, authToken, onViewDetails, user }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(null); // Store which listing's QR to show
  const [showUploadModal, setShowUploadModal] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [adminQrUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'); // Placeholder admin QR

  const loadListings = async () => {
    setLoading(true);
    fetch('http://localhost:5000/api/listings?mine=true', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(res => res.json())
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

  const handleUploadScreenshot = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}/upload-screenshot`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ paymentScreenshot: screenshotUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowUploadModal(null);
      setScreenshotUrl('');
      loadListings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkSold = async (id) => {
    if (!window.confirm('Are you sure you want to mark this item as sold?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}/mark-sold`, {
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending-payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending-verification':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Seller Dashboard</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="text-center py-8">Loading your listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">You haven't listed any items yet. Go add your first item!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
              <div key={listing._id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <img src={listing.image} alt={listing.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.name}</h3>
                  <p className="text-slate-600 mb-2">Price: Rs. {listing.price}</p>
                  <p className="text-slate-500 text-sm mb-2">Listing Fee: Rs. {listing.listingFee}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStatusBadgeClass(listing.status)}`}>
                    {listing.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {listing.status === 'pending-payment' && (
                      <button
                        onClick={() => setShowQrModal(listing)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                      >
                        Pay Now
                      </button>
                    )}
                    {listing.status === 'pending-payment' && (
                      <button
                        onClick={() => setShowUploadModal(listing)}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold"
                      >
                        Upload Screenshot
                      </button>
                    )}
                    {listing.status === 'approved' && (
                      <button
                        onClick={() => handleMarkSold(listing._id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                      >
                        Mark as Sold
                      </button>
                    )}
                    <button
                      onClick={() => onViewDetails(listing)}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Admin QR Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Pay Listing Fee</h3>
                <button onClick={() => setShowQrModal(null)} className="text-slate-500 hover:text-slate-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 text-center">
                <p className="text-slate-600 mb-4">Scan this QR code to pay Rs. {showQrModal.listingFee}</p>
                <img src={adminQrUrl} alt="Admin QR Code" className="w-64 h-64 mx-auto mb-4" />
                <button
                  onClick={() => setShowUploadModal(showQrModal)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  I've Paid - Upload Screenshot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Screenshot Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Upload Payment Screenshot</h3>
                <button onClick={() => setShowUploadModal(null)} className="text-slate-500 hover:text-slate-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Paste Screenshot URL</label>
                <input
                  type="text"
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  placeholder="https://example.com/screenshot.jpg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
                />
                <button
                  onClick={() => handleUploadScreenshot(showUploadModal._id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
