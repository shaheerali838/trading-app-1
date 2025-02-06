import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <div className="bg-gradient text-white">
    <Router>
      <Navbar/>
      <main>
        {/* <Home/> */}
        {/* <LogIn/> */}
        <SignUp/>
      </main>
      <Footer/>
    </Router>
    </div>
  );
};

export default App;
