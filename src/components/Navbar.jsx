// import React from 'react';

import { Link, useLocation } from 'react-router-dom';
import {  FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/courses', label: 'Courses' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/productivityHacks', label: 'Productivity' }
  ];

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-8 rounded-full object-cover border-2 border-white" 
                src="https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80" 
                alt="CourseHub Logo" 
              />
              <span className="ml-2 text-xl font-bold text-white">CourseHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActiveLink(link.path)
                    ? 'text-white bg-indigo-700 shadow-md'
                    : 'text-indigo-100 hover:text-white hover:bg-indigo-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            

            {/* Profile Icon */}
            <Link 
              to="/profile" 
              className="p-2 rounded-full text-white hover:bg-indigo-500 transition-colors duration-200 relative group"
              aria-label="User Profile"
            >
              <FaUser className="h-5 w-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Profile
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:bg-indigo-500 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-600 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActiveLink(link.path)
                  ? 'text-white bg-indigo-700 shadow-md'
                  : 'text-indigo-100 hover:text-white hover:bg-indigo-500'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
