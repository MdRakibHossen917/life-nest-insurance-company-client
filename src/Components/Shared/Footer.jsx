import React from "react";
import { Link } from "react-router";
import logo from '../../assets/Image/logo.png'

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10">
        {/* Services / Quick Links */}

        {/* Logo & Company Name */}
        <nav>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="LifeNest Logo" className="w-12 h-12" />
            <span className="font-bold text-lg">LifeNest Insurance</span>
          </Link>
          <p>LifeNest Insurance Company</p>
        </nav>

        {/* Company Info */}
        <nav>
          <h6 className="footer-title">Company</h6>
          <p className="link-hover">Md Rakib Hossen</p>
          <p className="link-hover">8/1 Shomajkallan Road, Dhaka</p>
          <p className="link-hover">Bangladesh</p>
        </nav>

        <nav>
          <h6 className="footer-title">Quick Links</h6>
          <Link to="/about" className="link link-hover">
            About Us
          </Link>
          <Link to="/contact" className="link link-hover">
            Contact
          </Link>
        </nav>

        {/* Social Media */}
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://www.facebook.com/md.rakib.hossen.41751"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/rakibhossen917/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.752s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.752-1.75 1.752zm13.5 11.268h-3v-5.604c0-1.337-.025-3.064-1.866-3.064-1.867 0-2.154 1.459-2.154 2.966v5.702h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.562 2.838-1.562 3.036 0 3.6 1.998 3.6 4.596v5.599z" />
              </svg>
            </a>
            <a
              href="https://github.com/MdRakibHossen917"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.303-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.242 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://my-portfolio-dd98e.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M12 0l3.09 6.26 6.91.53-5 4.87 1.18 6.87-6.19-3.26-6.19 3.26 1.18-6.87-5-4.87 6.91-.53z" />
              </svg>
            </a>
          </div>
        </nav>
      </footer>

      {/* Copyright */}
      <div className="text-center text-gray-500 py-4">
        © {new Date().getFullYear()} Md Rakib Hossen. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
