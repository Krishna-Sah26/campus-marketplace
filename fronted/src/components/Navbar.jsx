// /* eslint-disable react/prop-types */
// import { useState, useEffect } from 'react';

// const Navbar = ({ onSellClick, searchTerm, onSearchChange }) => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 40);
//     handleScroll();
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <nav className={`fixed top-0 w-full z-50 px-4 py-3 transition-all duration-300 ${isScrolled ? 'bg-white/95 text-slate-900 border-b border-slate-200 shadow-lg' : 'bg-black/40 text-white border-b border-white/10 shadow-none backdrop-blur-xl'}`}>
//       <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
//         <div className="flex items-center gap-3">
//           <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isScrolled ? 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl' : 'bg-cyan-500/20'}`}>
//             <svg className={`${isScrolled ? 'w-5 h-5 text-white' : 'w-6 h-6 text-cyan-300'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M16 8h-2V7a2 2 0 00-4 0v1H8a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2v-9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M8 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//               <path d="M10 8V7a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
//             Campus<span className={`${isScrolled ? 'text-cyan-600' : 'text-cyan-300'}`}>Market</span>
//           </h1>
//         </div>

//         <div className="flex-1 max-w-xl">
//           <div className="relative mx-auto">
//             <input
//               type="text"
//               placeholder="Search for books, laptops, lab coats..."
//               value={searchTerm}
//               onChange={(e) => onSearchChange?.(e.target.value)}
//               className={`w-full h-12 pl-12 pr-4 rounded-full border ${isScrolled ? 'border-slate-300 bg-white/90 text-slate-900 placeholder:text-slate-500' : 'border-white/20 bg-white/15 text-white placeholder:text-slate-300'} focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur transition-colors duration-300`}
//             />
//             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
//               <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="hidden md:flex items-center gap-6">
//           <button className={`text-lg font-medium transition ${isScrolled ? 'text-slate-700 hover:text-cyan-500' : 'text-white hover:text-cyan-300'}`}>Browse</button>
//           <button onClick={onSellClick} className={`font-semibold rounded-full px-6 py-2 shadow-lg transition ${isScrolled ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
//             + Sell Item
//           </button>
//         </div>
//       </div>

      
//     </nav>
//   );
// };

// export default Navbar;





/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const Navbar = ({ onSellClick, searchTerm, onSearchChange, onLoginClick, onSignupClick, user, onLogoutClick, onMyProfile, onMyListings, onSavedItems, onSettings, onSellerDashboard, onAdminDashboard }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 px-4 py-3 transition-all duration-300 ${isScrolled ? 'bg-white/95 text-slate-900 border-b border-slate-200 shadow-lg' : 'bg-black/40 text-white border-b border-white/10 shadow-none backdrop-blur-xl'}`}>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isScrolled ? 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl' : 'bg-cyan-500/20'}`}>
            <svg className={`${isScrolled ? 'w-5 h-5 text-white' : 'w-6 h-6 text-cyan-300'}`} viewBox="0 0 24 24" fill="none">
              <path d="M16 8h-2V7a2 2 0 00-4 0v1H8a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2v-9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 11h8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 8V7a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>

          <h1 className={`text-2xl md:text-3xl font-extrabold ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
            Campus<span className={`${isScrolled ? 'text-cyan-600' : 'text-cyan-300'}`}>Market</span>
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative mx-auto">
            <input
              type="text"
              placeholder="Search for books, laptops, lab coats..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className={`w-full h-12 pl-12 pr-4 rounded-full border ${isScrolled ? 'border-slate-300 bg-white/90 text-slate-900' : 'border-white/20 bg-white/15 text-white'} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            />

            <div className="absolute inset-y-0 left-4 flex items-center">
              <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              {/* Register (was Login) */}
              <button
                onClick={onLoginClick}
                className="font-semibold px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-md transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* Profile Section */}
              <div className="relative group flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold border-2 border-cyan-300">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className={`font-medium ${isScrolled ? 'text-slate-700' : 'text-white'}`}>
                  {user.name || 'User'}
                </span>

                {/* Dropdown */}
                <div className="absolute right-0 top-12 w-48 bg-white text-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <ul className="p-2 space-y-1">
                    <li onClick={onSellerDashboard} className="hover:bg-slate-100 p-2 rounded cursor-pointer font-semibold">Seller Dashboard</li>
                    {user?.role === 'admin' && (
                      <li onClick={onAdminDashboard} className="hover:bg-purple-50 text-purple-700 p-2 rounded cursor-pointer font-semibold">Admin Dashboard</li>
                    )}
                    <li onClick={onMyProfile} className="hover:bg-slate-100 p-2 rounded cursor-pointer">My Profile</li>
                    <li onClick={onMyListings} className="hover:bg-slate-100 p-2 rounded cursor-pointer">My Listings</li>
                    <li onClick={onSavedItems} className="hover:bg-slate-100 p-2 rounded cursor-pointer">Saved Items</li>
                    <li onClick={onSettings} className="hover:bg-slate-100 p-2 rounded cursor-pointer">Settings</li>
                    <li
                      onClick={onLogoutClick}
                      className="hover:bg-red-50 text-red-600 p-2 rounded cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Sell Button */}
          <button
            onClick={onSellClick}
            className="font-semibold rounded-full px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition"
          >
            + Sell Item
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
