import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 p-4 mt-8">
    <div className="container mx-auto text-center text-white font-comfortaa">
      <p className="text-sm md:text-base">&copy; 2025 ToyNest. All rights reserved.</p>
      <div className="mt-2 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Link to="/" className="hover:text-[#1572A1] transition-colors">Home</Link>
        <Link to="/about" className="hover:text-[#1572A1] transition-colors">About Us</Link>
        <Link to="/#contact-email" className="hover:text-[#1572A1] transition-colors">Contact</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
