import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 p-4 mt-8">
    <div className="container mx-auto text-center text-white">
      <p>&copy; 2025 ToyNest. All rights reserved.</p>
      <div className="mt-2">
        <Link to="/" className="mx-2">Home</Link>
        <Link to="/about" className="mx-2">About Us</Link>
        <Link to="/contact" className="mx-2">Contact</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
