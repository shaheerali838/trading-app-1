import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-transparent shadow">
    <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
            <div className="text-2xl font-bold">Logo</div>
        </div>
        <div className="flex space-x-4">
            <Link to={"/trade"} className="text-cyan-600 hover:text-[#faf6a5]">Trade</Link>
            <Link to={"/finance"} className="text-cyan-600 hover:text-[#faf6a5]">Finance</Link>
            <Link to={"/about"} className="text-cyan-600 hover:text-[#faf6a5]">About</Link>
            <Link to={"/another"} className="text-cyan-600 hover:text-[#faf6a5]">Another</Link>
        </div>
        <div className="flex items-center space-x-4">
            <div className="w-[7vw] px-3 py-2 flex justify-center rounded-full bg-transparent border-2 border-cyan-600">
                <button className="text-cyan-600">Login</button>
            </div>
            <div className="w-[7vw] px-3 py-2 flex justify-center rounded-full bg-cyan-600 text-white">
                <button>Register</button>
            </div>
        </div>
    </nav>
</header>
  );
};

export default Navbar;
