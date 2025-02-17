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
  DialogFooter,
  DialogBody,
  DialogHeader,
  Dialog,
} from "@material-tailwind/react";
import { VscChevronDown } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin, logoutUser } from "../../store/slices/userSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [openMenu, setOpenMenu] = useState(false);
  const [openTradeMenu, setOpenTradeMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch((state) => state.user);

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

  const handleLogout = () => {
    const userRole = user.role;
    localStorage.removeItem("user");
    window.location.href = "/";
    userRole === "admin" ? dispatch(logoutAdmin()) : dispatch(logoutUser());
  };
  const handleLogoutDialog = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <header
      className={`sticky top-0 z-10  smooth-transition ${
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
          {user?.role === "admin" && <Link to={"/admin/dashboard"} className="text-white hover:text-[#00FF7F]">
            Admin Panel
          </Link> }

          <Link to={"/"} className="text-white hover:text-[#00FF7F]">
            Home
          </Link>
          <Link to={"/market"} className="text-white hover:text-[#00FF7F]">
            Market
          </Link>
          <Menu
              open={openTradeMenu}
              handler={setOpenTradeMenu}
              allowHover
              className="relative px-2"
            >
              <MenuHandler>
                <Button
                  variant="text"
                  className="flex items-center gap-3 text-white hover:text-secondary font-normal capitalize m-0 p-0 pr-1"
                >
                  <span className="text-[16px]">Trade</span>
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
                    to={"/trade"}
                    className="block m-0 px-4 py-2 text-sm w-full text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]"
                  >
                    Spot
                  </Link>
                </MenuItem>
              </MenuList>
            </Menu>
          <Link to={"/wallet"} className="text-white hover:text-[#00FF7F]">
            Wallet
          </Link>
          <Link to={"/about"} className="text-white hover:text-[#00FF7F]">
            About
          </Link>
        </div>

        {!user ? (
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
        ) : (
          <>
            {/* <div className="w-[5vw] h-[5vw] rounded-full overflow-hidden contain">
              <img src="../../assets/images/user-avatar.png" alt="" />
            </div> */}
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
                  <span className="text-[16px]">Profile</span>
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
                  <p className="block m-0  px-4 py-2 text-sm max-w-[100%] overflow-hidden line-wrap  text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]">
                    {user.email}
                  </p>
                </MenuItem>
                <MenuItem>
                  <Link
                    to={"/wallet"}
                    className="block m-0 px-4 py-2 text-sm w-full text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]"
                  >
                    Assets Wallet
                  </Link>
                </MenuItem>
                <MenuItem>
                  <p
                    onClick={handleLogoutDialog}
                    className="block m-0 px-4 py-2 text-sm w-full text-tertiary2 hover:bg-gray-300 hover:text-[#00FF7F]"
                  >
                    Logout
                  </p>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        )}
        <Dialog
          open={openDialog}
          size="xs"
          handler={handleLogoutDialog}
          className="text-white bg-[#242424]"
        >
          <DialogHeader className="text-tertiary1">Confirmation!</DialogHeader>
          <DialogBody>
            Are you sure you want to logout from this account?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleLogoutDialog}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleLogout}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </nav>
    </header>
  );
};

export default Navbar;
