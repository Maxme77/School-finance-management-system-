import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white shadow-luxury border-b border-luxury-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-luxury-100 transition-colors duration-200"
          >
            <Menu className="h-6 w-6 text-luxury-600" />
          </button>
          
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-gradient">{title}</h1>
            <p className="text-sm text-luxury-600 mt-1">
              Manage your educational institution efficiently
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-luxury-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm w-64"
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-luxury-100 transition-colors duration-200">
            <Bell className="h-6 w-6 text-luxury-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-luxury-900">Admin User</p>
              <p className="text-xs text-luxury-600">Administrator</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-luxury-100 transition-colors duration-200">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-gold-500 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;