import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        
        {/* Website Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">HealthCare+</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Book doctor appointments easily and manage your healthcare
            digitally with our secure hospital appointment system.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/doctors" className="hover:text-white">
                Find Doctor
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-white">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">Login</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Contact Us
          </h3>
          <p className="text-sm">Email: support@healthcare.com</p>
          <p className="text-sm mt-1">Phone: +91 98765 43210</p>
          <p className="text-sm mt-1">Location: Kochi, Kerala</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} HealthCare+. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;