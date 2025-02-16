import React from "react";
import { Link } from "react-router-dom";
import LogoSrc from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-8 shadow-top">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div className="mb-4 md:mb-0">
            <div className="logo-container flex items-center">
              <Link to={"/"} className="">
                <i>
                  <img className="w-[8vw]" src={LogoSrc} alt="LOGO" />
                </i>
              </Link>
            </div>
            <p className="mt-2 text-[#F5F5F5]">
              The most trusted website for trading.
            </p>
          </div>
          <div className="flex flex-col min-[w-80vw] md:flex-row space-y-4 md:space-y-0 md:space-x-16">
            <div>
              <h3 className="text-xl font-semibold text-[#1E90FF]">Company</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/about" className="hover:text-[#00FF7F]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[#00FF7F]">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#00FF7F]">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E90FF]">Support</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/faq" className="hover:text-[#00FF7F]">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-[#00FF7F]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#00FF7F]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E90FF]">
                Follow Us
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="https://facebook.com"
                    className="hover:text-[#00FF7F]"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    className="hover:text-[#00FF7F]"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    className="hover:text-[#00FF7F]"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-[#F5F5F5]">
            &copy; 2025 BitEx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
