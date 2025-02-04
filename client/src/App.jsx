import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="bg-[#121212] text-white">
    <Router>
      <Navbar/>
      <main>
        <Home/>
      </main>
      <Footer/>
    </Router>
    </div>
  );
};

export default App;
