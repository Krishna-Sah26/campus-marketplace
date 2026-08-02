/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

const ListingDetailsModal = ({ listing, loading, user, onClose, onSaveToggle }) => {
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [buying, setBuying] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || user?.mobile || '');

  const seller = listing.sellerId && typeof listing.sellerId === 'object' ? listing.sellerId : null;
  const sellerName = seller?.name || listing.sellerName || 'Anonymous Seller';
  const savedByCurrentUser =
    Array.isArray(user?.savedListings) &&
    (user.savedListings.some((savedId) => String(savedId) === String(listing._id || listing.id)) ||
      (listing.savedBy || []).some((savedId) => String(savedId) === String(user?.id)));

  const listingDate = listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recently added';
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(listing.price || 0));

  useEffect(() => {
    setBuyerName(user?.name || '');
    setBuyerEmail(user?.email || '');
    setBuyerPhone(user?.phone || user?.mobile || '');
  }, [user?.name, user?.email, user?.phone, user?.mobile]);

  const handleSaveClick = async () => {
    setSaveError('');
    setSaving(true);
    try {
      await onSaveToggle?.();
    } catch (error) {
      setSaveError(error.message || 'Unable to update saved items.');
    } finally {
      setSaving(false);
    }
  };

  const handleBuyClick = () => {
    setPurchaseStatus('');
    setCheckoutOpen(true);
    setQrOpen(false);
  };

  const handleConfirmPurchase = () => {
    setBuying(true);
    setPurchaseStatus('');

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setPurchaseStatus('Please add your name, email, and phone number to continue.');
      setBuying(false);
      return;
    }

    const amount = Number(listing.price || 0);
    const upiId = import.meta.env.VITE_UPI_ID || '';
    const paymentUrl = upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}` +
        `&pn=${encodeURIComponent(sellerName)}` +
        `&am=${encodeURIComponent(amount.toFixed(0))}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent(listing.name)}`
      : '';

    const order = {
      id: `${listing._id || listing.id}-${Date.now()}`,
      listingId: listing._id || listing.id,
      listingName: listing.name,
      listingPrice: amount,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim(),
      paymentMethod: 'upi',
      paymentUrl,
      createdAt: new Date().toISOString(),
      status: 'pending-payment',
    };

    const existingOrders = JSON.parse(localStorage.getItem('campusMarketOrders') || '[]');
    existingOrders.unshift(order);
    localStorage.setItem('campusMarketOrders', JSON.stringify(existingOrders));

    setQrOpen(true);
    setPurchaseStatus(paymentUrl ? 'Scan the UPI QR to complete payment.' : 'Add your UPI ID in the app settings to enable QR payments.');
    setBuying(false);
  };

  const upiId = import.meta.env.VITE_UPI_ID || '';
  const amountValue = Number(listing.price || 0).toFixed(0);
  const paymentUrl = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(sellerName)}` +
      `&am=${encodeURIComponent(amountValue)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(listing.name)}`
    : '';
  const customQrImage = import.meta.env.VITE_UPI_QR_IMAGE || '';
  const qrCodeUrl = paymentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(paymentUrl)}`
    : '';
  const qrImageSrc = customQrImage || qrCodeUrl;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] h-full max-h-[90vh]">
          <div className="relative lg:max-h-[90vh] bg-slate-100">
            <img
              src={listing.image}
              alt={listing.name}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg"
            >
              Close
            </button>
            {listing.verified && (
              <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-lg">
                Verified Seller
              </div>
            )}
            {listing.featured && (
              <div className="absolute left-4 top-16 rounded-full bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-lg">
                Featured Item
              </div>
            )}
          </div>

          <div className="flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 p-6 lg:p-8">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">{listing.category}</span>
                {listing.condition && <span className="rounded-full bg-slate-100 px-3 py-1">{listing.condition}</span>}
                {listing.campus && <span className="rounded-full bg-slate-100 px-3 py-1">{listing.campus}</span>}
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-bold text-slate-900">{listing.name}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{listing.description}</p>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="text-4xl font-extrabold text-blue-600">{formattedPrice}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{listing.views || 0} views</p>
                  <p>{listingDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6 lg:p-8">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Seller</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{sellerName}</p>
                {listing.sellerEmail && <p className="text-sm text-slate-600">{listing.sellerEmail}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-slate-500">Status</p>
                      <p className="mt-1 font-semibold text-slate-900 capitalize">{listing.status || 'active'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-slate-500">Listing Fee</p>
                      <p className="mt-1 font-semibold text-slate-900">Rs. {listing.listingFee || 0}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-slate-500">Campus</p>
                      <p className="mt-1 font-semibold text-slate-900">{listing.campus || 'All Campuses'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-slate-500">Condition</p>
                      <p className="mt-1 font-semibold text-slate-900">{listing.condition || 'Used'}</p>
                    </div>
                  </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={saving}
                  className="flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  {saving ? 'Saving...' : savedByCurrentUser ? 'Saved Item' : 'Save Item'}
                </button>
                <button
                  type="button"
                  onClick={handleBuyClick}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-cyan-600"
                >
                  Buy Now
                </button>
              </div>

              {checkoutOpen && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Quick Checkout</p>
                      <p className="text-sm text-slate-600">UPI-only checkout. No cash on delivery and no card payments.</p>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900">{formattedPrice}</p>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(event) => setBuyerName(event.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400"
                    />
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(event) => setBuyerEmail(event.target.value)}
                      placeholder="Your email"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400"
                    />
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(event) => setBuyerPhone(event.target.value)}
                      placeholder="Your phone number"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400"
                    />

                    <div className="rounded-xl border border-dashed border-blue-200 bg-white px-4 py-3 text-sm text-slate-600">
                      Payment method: <span className="font-semibold text-blue-700">UPI only</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmPurchase}
                      disabled={buying}
                      className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
                    >
                      {buying ? 'Preparing QR...' : 'Open UPI QR'}
                    </button>
                  </div>

                  {purchaseStatus && (
                    <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                      {purchaseStatus}
                    </div>
                  )}
                </div>
              )}

              {qrOpen && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Scan and Pay</p>
                      <p className="text-sm text-slate-600">Use any UPI app to pay this amount.</p>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900">{formattedPrice}</p>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
                    <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm">
                      {qrImageSrc ? (
                        <img
                          src={qrImageSrc}
                          alt="UPI QR code"
                          className="h-[220px] w-[220px] rounded-xl border border-slate-100 object-contain"
                        />
                      ) : (
                        <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
                          Add `VITE_UPI_ID` or `VITE_UPI_QR_IMAGE` to show a payment QR.
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pay To</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{sellerName}</p>
                        {upiId && <p className="text-sm text-slate-600">{upiId}</p>}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Buyer Name</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{buyerName || 'Not provided'}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Buyer Phone</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{buyerPhone || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                          href={paymentUrl || '#'}
                          onClick={(event) => {
                            if (!paymentUrl) {
                              event.preventDefault();
                              return;
                            }
                          }}
                          className={`flex-1 rounded-xl px-4 py-3 text-center font-semibold text-white transition ${
                            paymentUrl ? 'bg-emerald-600 hover:bg-emerald-700' : 'cursor-not-allowed bg-emerald-300'
                          }`}
                        >
                          Open UPI App
                        </a>
                        <button
                          type="button"
                          onClick={() => setQrOpen(false)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Close QR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="rounded-xl bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
                  Loading latest listing details...
                </div>
              )}

              {saveError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {saveError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;
