import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center">
              <span className="text-white">Deepak</span>
              <span className="text-amber-400">Shop</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mb-0.5 ml-0.5" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for quality products at affordable prices. Shop the latest trends in electronics, fashion, home appliances, and books.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                <i className="fa-brands fa-square-facebook"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                <i className="fa-brands fa-square-x-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=electronics" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  <i className="fa-solid fa-mobile-screen-button"></i> Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=fashion" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  <i className="fa-solid fa-shirt"></i> Fashion
                </Link>
              </li>
              <li>
                <Link to="/products?category=home-appliances" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  <i className="fa-solid fa-house-chimney"></i> Home Appliances
                </Link>
              </li>
              <li>
                <Link to="/products?category=books" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  <i className="fa-solid fa-book"></i> Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <i className="fa-solid fa-location-dot text-amber-400"></i>
                <span>123 Bhubaneswar, Odisha, India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <i className="fa-solid fa-phone text-amber-400"></i>
                <span>+91 8984056080</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <i className="fa-regular fa-envelope text-amber-400"></i>
                <span>support@deepakshop.com</span>
              </li>
            </ul>
          </div>
        </div>


        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} DeepakShop. All rights reserved. | Built with ❤️ for online shopping
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;