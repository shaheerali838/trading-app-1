import React from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import LogIn from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import About from "./pages/About";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import Assets from "./pages/finance/Assets.jsx";
import Deposit from "./pages/finance/Deposit.jsx";
import RequestRelease from "./pages/finance/RequestRelease.jsx";
import Withdraw from "./pages/finance/Withdraw.jsx";
import ProtectedRoute from "./components/middleware/ProtectedRoute.jsx";
import "react-toastify/dist/ReactToastify.css";

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
              <Route path="/register" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/market" element={<Market />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/assets" element={<Assets />} />
                <Route path="/assets/deposit" element={<Deposit />} />
                <Route
                  path="/assets/request-release-funds"
                  element={<RequestRelease />}
                />
                <Route path="/assets/withdraw" element={<Withdraw />} />
                <Route path="/trade" element={<Trade />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Router>
      </div>
    </Provider>
  );
};

export default App;
