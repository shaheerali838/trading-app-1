import React, { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import { useDispatch } from "react-redux";
import Assets from "./pages/finance/Assets.jsx";
import Deposit from "./pages/finance/Deposit.jsx";
import RequestRelease from "./pages/finance/RequestRelease.jsx";
import Withdraw from "./pages/finance/Withdraw.jsx";
import ProtectedRoute from "./components/middleware/ProtectedRoute.jsx";
import { setUser } from "./store/slices/userSlice";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);
  return (
    <div className="bg-gradient text-white overflow-hidden">
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<SignUp />} />
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
  );
};

export default App;
