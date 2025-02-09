import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoSrc from "../../assets/logo.png";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from "@material-tailwind/react";
import { VscChevronDown } from "react-icons/vsc";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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
    <header
      className={`sticky top-0 z-10 smooth-transition ${
        isScrolled ? "bg-opacity-50 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="logo-container flex items-center">
          <Link to={"/"} className="">
            <i>
              <img className="w-[50px]" src={logoSrc} alt="LOGO" />
            </i>
          </Link>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <Link to={"/"} className="text-white hover:text-[#00FF7F]">
            Home
          </Link>
          <Link to={"/market"} className="text-white hover:text-[#00FF7F]">
            Market
          </Link>
          <Link to={"/trade"} className="text-white hover:text-[#00FF7F]">
            Trade
          </Link>
          <Link to={"/about"} className="text-white hover:text-[#00FF7F]">
            About
          </Link>
          <Menu
            open={openMenu}
            handler={setOpenMenu}
            allowHover
            className="relative"
          >
            <MenuHandler>
              <Button
                variant="text"
                className="flex items-center gap-3 text-white hover:text-secondary font-normal capitalize m-0 p-0 pr-1"
              >
                <span className="text-[16px]">Finance</span>
                <VscChevronDown
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 p-0 m-0 transition-transform ${
                    openMenu ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </MenuHandler>
            <MenuList className="absolute w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-0">
              <MenuItem>
                <Link
                  to={"/finance/overview"}
                  className="block m-0 px-4 py-2 text-sm w-full text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]"
                >
                  Overview
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to={"/finance/assets"}
                  className="block m-0 px-4 py-2 text-sm w-full text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]"
                >
                  Assets
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to={"/finance/profit"}
                  className="block m-0 px-4 py-2 text-sm w-full text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]"
                >
                  Profit
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={"/login"}>
            <div className="min-w-[10vw] sm:w-[7vw] px-3 py-1 flex justify-center cursor-pointer rounded-full bg-transparent border-2 border-[#1E90FF]">
              <button className="text-[#1E90FF]">Login</button>
            </div>
          </Link>
          <Link to={"/register"}>
            <div className="min-w-[10vw] sm:w-[7vw] px-2 py-1 flex justify-center cursor-pointer rounded-full bg-[#1E90FF] text-white">
              <button>Register</button>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
