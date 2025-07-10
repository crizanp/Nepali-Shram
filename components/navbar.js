import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  LogOut,
  Bell,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [notifications, setNotifications] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  return (
    <nav className="bg-white  border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img
                src="/nepalishram-fav.png"
                alt="Nepali Shram"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-blue-600 rounded-lg hidden items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">NS</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-900 pb-1">
                  Nepali Shram
                </h1>
                <span className="text-xs text-gray-500 -mt-1">Applicant Portal</span>
              </div>
            </Link>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">

            {/* Language Selector */}
            <div className="flex items-center bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => handleLanguageChange('EN')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentLanguage === 'EN'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('NP')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentLanguage === 'NP'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                नेप
              </button>
            </div>

            {/* Notification Button */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium max-w-24 truncate uppercase">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 uppercase">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">

            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 uppercase">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Mobile Language Selector */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Language</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLanguageChange('EN')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${currentLanguage === 'EN'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('NP')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${currentLanguage === 'NP'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  नेपाली
                </button>
              </div>
            </div>

            {/* Mobile Notification */}
            <button
              onClick={() => {
                handleNotificationClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Notifications</span>
              </div>
              {notifications > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Mobile Logout */}
            <button
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* Accent Bar */}
      <div className="bg-red-600 h-0.5"></div>
    </nav>
  );
}