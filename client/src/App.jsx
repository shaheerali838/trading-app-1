import React from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Finance from "./pages/Finance";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const App = () => {
  return (
    <Provider store={store}>
      <div className="bg-gradient text-white overflow-hidden">
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/market" element={<Market />} />
              <Route path="/trade" element={<Trade />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </Provider>
  );
};

export default App;
