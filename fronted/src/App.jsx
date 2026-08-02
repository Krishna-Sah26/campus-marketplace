import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedItems from './components/FeaturedItems';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Footer from './components/Footer';
import SellForm from './components/SellForm';
import AuthModal from './components/AuthModal';
import ListingDetailsModal from './components/ListingDetailsModal';
import MyProfileModal from './components/MyProfileModal';
import MyListingsModal from './components/MyListingsModal';
import SavedItemsModal from './components/SavedItemsModal';
import SettingsModal from './components/SettingsModal';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';

const API_BASE = 'http://localhost:5000/api';

const fallbackItems = [
  {
    id: 1,
    name: 'Calculus Textbook',
    price: 25,
    description: 'Used calculus textbook in good condition',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    category: 'Books',
    verified: true,
  },
  {
    id: 2,
    name: 'Lab Equipment Set',
    price: 50,
    description: 'Complete lab equipment set for chemistry',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    category: 'Lab Equipment',
    verified: true,
  },
  {
    id: 3,
    name: 'Drawing Kit',
    price: 30,
    description: 'Professional drawing kit with pencils and paper',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    category: 'Drawing Kits',
    verified: false,
  },
  {
    id: 4,
    name: 'Laptop Charger',
    price: 15,
    description: 'Compatible charger for various laptop models',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    category: 'Electronics',
    verified: true,
  },
  {
    id: 5,
    name: 'Hostel Bedding Set',
    price: 40,
    description: 'Complete bedding set for hostel room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    category: 'Hostel Items',
    verified: false,
  },
  {
    id: 6,
    name: 'Chef Apron',
    price: 10,
    description: 'Professional chef apron for cooking classes',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    category: 'Aprons',
    verified: true,
  },
];

function loadSavedAuth() {
  const savedAuth = localStorage.getItem('campusMarketAuth');
  if (savedAuth) {
    try {
      return JSON.parse(savedAuth);
    } catch {
      return { user: null, token: '' };
    }
  }

  const savedUser = localStorage.getItem('campusMarketUser');
  const savedToken = localStorage.getItem('campusMarketToken');
  let parsedUser = null;

  try {
    parsedUser = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    parsedUser = null;
  }

  return {
    user: parsedUser,
    token: savedToken || '',
  };
}

function App() {
  const savedAuth = loadSavedAuth();
  const [items, setItems] = useState([]);
  const [showSellForm, setShowSellForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Added auth modal state for Login / Create Account UI
  const [authMode, setAuthMode] = useState(null);
  // Added user state for MongoDB auth
  const [user, setUser] = useState(savedAuth.user);
  const [authToken, setAuthToken] = useState(savedAuth.token);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listingDetailsLoading, setListingDetailsLoading] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Load marketplace listings from MongoDB first, then fall back to local data if needed.
    const loadListings = async () => {
      try {
        const res = await fetch(`${API_BASE}/listings`);
        if (!res.ok) throw new Error('Failed to load listings');
        const data = await res.json();

        if (!cancelled) {
          const remoteItems = data.listings || [];
          setItems(remoteItems);
          localStorage.setItem('campusMarketItems', JSON.stringify(remoteItems));
        }
      } catch {
        const savedItems = localStorage.getItem('campusMarketItems');
        const parsedItems = savedItems ? JSON.parse(savedItems) : fallbackItems;
        if (!cancelled) {
          setItems(parsedItems);
          localStorage.setItem('campusMarketItems', JSON.stringify(parsedItems));
        }
      }
    };

    loadListings();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authToken) return;
    let cancelled = false;

    // Revalidate the stored session token so refreshes stay in sync with MongoDB.
    const syncSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) throw new Error('Session expired');
        const data = await res.json();

        if (!cancelled) {
          setUser(data.user);
          localStorage.setItem('campusMarketAuth', JSON.stringify({ user: data.user, token: authToken }));
          localStorage.setItem('campusMarketUser', JSON.stringify(data.user));
          localStorage.setItem('campusMarketToken', authToken);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAuthToken('');
          localStorage.removeItem('campusMarketAuth');
          localStorage.removeItem('campusMarketUser');
          localStorage.removeItem('campusMarketToken');
        }
      }
    };

    syncSession();

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  const addItem = async (newItem) => {
    const response = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        ...newItem,
        price: Number(newItem.price),
        sellerName: user?.name,
        sellerEmail: user?.email,
        campus: user?.campus,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Unable to create listing');
    }

    const createdListing = data.listing;
    const updatedItems = [createdListing, ...items.filter((item) => String(item._id || item.id) !== String(createdListing._id))];
    setItems(updatedItems);
    localStorage.setItem('campusMarketItems', JSON.stringify(updatedItems));
    setShowSellForm(false);
  };

  // Load one listing from MongoDB so the details modal always shows the latest data.
  const openListingDetails = async (listing) => {
    const listingId = listing._id || listing.id;
    if (!listingId) {
      setSelectedListing(listing);
      return;
    }

    setListingDetailsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/listings/${listingId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to load listing');
      setSelectedListing(data.listing);
    } catch {
      setSelectedListing(listing);
    } finally {
      setListingDetailsLoading(false);
    }
  };

  // Toggle save/unsave directly from the listing details modal.
  const toggleSavedListing = async (listingId) => {
    if (!authToken) {
      setAuthMode('login');
      return;
    }

    const res = await fetch(`${API_BASE}/listings/${listingId}/save`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to save listing');

    const updatedListing = data.listing;
    const updatedUser = data.user || user;
    const nextItems = items.map((item) => (String(item._id || item.id) === String(updatedListing._id) ? updatedListing : item));
    setItems(nextItems);
    setUser(updatedUser);
    localStorage.setItem('campusMarketItems', JSON.stringify(nextItems));
    localStorage.setItem('campusMarketUser', JSON.stringify(updatedUser));
    localStorage.setItem('campusMarketAuth', JSON.stringify({ user: updatedUser, token: authToken }));
    if (selectedListing && String(selectedListing._id || selectedListing.id) === String(updatedListing._id)) {
      setSelectedListing(updatedListing);
    }
  };

  const closeListingDetails = () => {
    setSelectedListing(null);
  };

  const handleAuthSuccess = (payload) => {
    setUser(payload.user);
    setAuthToken(payload.token);
    localStorage.setItem('campusMarketAuth', JSON.stringify(payload));
    localStorage.setItem('campusMarketUser', JSON.stringify(payload.user));
    localStorage.setItem('campusMarketToken', payload.token);
    setAuthMode(null);
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
    } finally {
      setUser(null);
      setAuthToken('');
      localStorage.removeItem('campusMarketAuth');
      localStorage.removeItem('campusMarketUser');
      localStorage.removeItem('campusMarketToken');
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campusMarketUser', JSON.stringify(updatedUser));
    localStorage.setItem('campusMarketAuth', JSON.stringify({ user: updatedUser, token: authToken }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSellClick={() => setShowSellForm(true)}
        // Added handlers for Login / Create Account
        onLoginClick={() => setAuthMode('login')}
        onSignupClick={() => setAuthMode('signup')}
        // Added user for Navbar profile section
        user={user}
        onLogoutClick={handleLogout}
        onMyProfile={() => setShowMyProfile(true)}
        onMyListings={() => setShowMyListings(true)}
        onSavedItems={() => setShowSavedItems(true)}
        onSettings={() => setShowSettings(true)}
        onSellerDashboard={() => setShowSellerDashboard(true)}
        onAdminDashboard={() => setShowAdminDashboard(true)}
      />
      <Hero />
      <Categories />
      <FeaturedItems
        items={items}
        searchTerm={searchTerm}
        onViewDetails={openListingDetails}
      />
      <HowItWorks />
      <Benefits />
      <Footer />
      {showSellForm && (
        <SellForm
          onClose={() => setShowSellForm(false)}
          onAddItem={addItem}
        />
      )}
      {/* Added Auth UI (Login / Create Account) */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
          // Added auth success handler to store user
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      {/* Added listing details modal so each card can show full marketplace info */}
      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          loading={listingDetailsLoading}
          user={user}
          onClose={closeListingDetails}
          onSaveToggle={() => toggleSavedListing(selectedListing._id || selectedListing.id)}
        />
      )}
      {/* My Profile Modal */}
      {showMyProfile && (
        <MyProfileModal
          user={user}
          authToken={authToken}
          onClose={() => setShowMyProfile(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {/* My Listings Modal */}
      {showMyListings && (
        <MyListingsModal
          authToken={authToken}
          onClose={() => setShowMyListings(false)}
        />
      )}
      {/* Saved Items Modal */}
      {showSavedItems && (
        <SavedItemsModal
          authToken={authToken}
          onClose={() => setShowSavedItems(false)}
          onViewDetails={openListingDetails}
        />
      )}
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          user={user}
          authToken={authToken}
          onClose={() => setShowSettings(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {/* Seller Dashboard Modal */}
      {showSellerDashboard && (
        <SellerDashboard
          user={user}
          authToken={authToken}
          onClose={() => setShowSellerDashboard(false)}
          onViewDetails={openListingDetails}
        />
      )}
      {/* Admin Dashboard Modal */}
      {showAdminDashboard && user?.role === 'admin' && (
        <AdminDashboard
          authToken={authToken}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}
    </div>
  );
}

export default App;
