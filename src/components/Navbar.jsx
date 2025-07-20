import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';

const navLinks = [
  { to: '/students', label: 'Students' },
  { to: '/startups', label: 'Startups' },
  { to: '/applications', label: 'Applications' },
  { to: '/messages', label: 'Messages' },
  { to: '/events', label: 'Events' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/dashboard', label: 'Dashboard' },
];

function SkillMatchLogo() {
  return (
    <span className="inline-block w-8 h-8 mr-1">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#logo-gradient)" />
        <path d="M13 25c2.5-4 7.5-4 10 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="17" r="2.2" fill="#fff" />
        <circle cx="24" cy="17" r="2.2" fill="#fff" />
      </svg>
      <span className="sr-only">SkillMatch Logo</span>
    </span>
  );
}

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hoverTimeout = useRef();

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  function closeMenus() {
    setDropdownOpen(false);
    setMobileOpen(false);
  }

  function handleProfileMouseEnter() {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setDropdownOpen(true), 200);
  }

  function handleProfileMouseLeave() {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
  }

  return (
    <nav className="bg-blue-700 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-white text-2xl font-extrabold tracking-wide hover:text-blue-200 transition">
            <SkillMatchLogo />
            <span className="hidden sm:inline">SkillMatch</span>
          </Link>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-2 lg:gap-4 items-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg font-medium transition text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white/50 ${location.pathname === link.to ? 'bg-blue-900 shadow' : ''}`}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Open navigation menu"
          onClick={() => setMobileOpen(o => !o)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Auth/Profile Section */}
        <div className="flex gap-2 items-center relative ml-4">
          {isLoggedIn && (
            <div
              className="relative"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              tabIndex={0}
              onFocus={handleProfileMouseEnter}
              onBlur={handleProfileMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(d => !d)}
                className="flex items-center gap-2 bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="User Profile"
                tabIndex={0}
              >
                <span className="inline-block w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-xl shadow border-2 border-white">
                  {userName ? userName[0].toUpperCase() : <span role="img" aria-label="User">👤</span>}
                </span>
                <span className="hidden sm:inline text-base font-bold">{userName}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 min-w-[280px] bg-white rounded-2xl shadow-2xl py-6 z-50 border border-blue-100 animate-fadeIn flex flex-col items-center transition-all duration-200">
                  <div className="flex flex-col items-center px-8 pb-4 w-full">
                    <span className="inline-block w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-3xl text-white shadow border-4 border-white mb-2">
                      {userName ? userName[0].toUpperCase() : <span role="img" aria-label="User">👤</span>}
                    </span>
                    <div className="text-blue-700 font-bold text-xl text-center w-full mb-1">{userName}</div>
                    <div className="text-xs text-gray-500 font-semibold mb-1 text-center w-full">{userRole && userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                    <div className="text-xs text-gray-400 break-all mb-2 text-center w-full">User ID: <span className="font-mono">{userId}</span></div>
                  </div>
                  <div className="border-t border-blue-50 my-2 w-full"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-8 py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-b-2xl transition font-semibold focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-40" onClick={closeMenus} aria-label="Close navigation menu">
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-2xl z-50 flex flex-col pt-8 px-6 animate-slideIn">
            <button className="self-end mb-8 text-blue-700 hover:text-blue-900 focus:outline-none" onClick={closeMenus} aria-label="Close menu">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg font-medium text-blue-700 hover:bg-blue-100 transition mb-2 ${location.pathname === link.to ? 'bg-blue-100 font-bold' : ''}`}
                aria-current={location.pathname === link.to ? 'page' : undefined}
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => { handleLogout(); closeMenus(); }}
                className="block w-full text-left px-4 py-3 rounded-lg font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition mt-4"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 