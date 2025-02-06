import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoSrc from '../assets/logo.png'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-10  smooth-transition ${isScrolled ? 'bg-opacity-50 backdrop-blur-lg' : 'bg-transparent'}`}>
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="logo-container flex items-center">
          <Link to={"/"} className=""><i><img className="w-[4vw]" src={logoSrc} alt="LOGO" /></i></Link>
        </div>
        <div className="flex space-x-4">
          <Link to={"/trade"} className="text-white hover:text-[#00FF7F]">Trade</Link>
          <Link to={"/finance"} className="text-white hover:text-[#00FF7F]">Finance</Link>
          <Link to={"/about"} className="text-white hover:text-[#00FF7F]">About</Link>
          <Link to={"/another"} className="text-white hover:text-[#00FF7F]">Feature</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-[7vw] px-3 py-1 flex justify-center rounded-full bg-transparent border-2 border-[#1E90FF]">
            <button className="text-[#1E90FF]">Login</button>
          </div>
          <div className="w-[7vw] px-2 py-1 flex justify-center rounded-full bg-[#1E90FF] text-white">
            <button>Register</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
