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
import { useDispatch, useSelector } from "react-redux";
import Wallet from "./pages/finance/Wallet.jsx";
import Deposit from "./pages/finance/Deposit.jsx";
import RequestRelease from "./pages/finance/RequestRelease.jsx";
import Withdraw from "./pages/finance/Withdraw.jsx";
import ProtectedRoute from "./components/middleware/ProtectedRoute.jsx";
import { setUser } from "./store/slices/userSlice";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUser from "./pages/admin/ManageUser.jsx";
import ManageTransactions from "./pages/admin/ManageTransactions.jsx";
import AdminProtectedRoute from "./components/middleware/AdminProtectedRoute.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";
import Loader from "./components/layout/Loader.jsx";
import AddTokens from "./pages/admin/AddTokens.jsx";
import FuturesTrade from "./pages/FuturesTrade.jsx";
import PerpetualTrade from "./pages/PerpetualTrade.jsx";
import BottomNavbar from "./components/layout/BottomNavbar.jsx";
import LiquidateOpenTrades from "./pages/admin/LiquidateOpenTrades.jsx";
import HistoryPage from "./pages/finance/HistoryPage.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.global);

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
          {loading && <Loader />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/market" element={<Market />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users/manage" element={<ManageUser />} />
              <Route
                path="/admin/transaction/manage"
                element={<ManageTransactions />}
              />
              <Route path="/admin/orders/manage" element={<ManageOrders />} />
              <Route
                path="/admin/users/add-tokens/:userId"
                element={<AddTokens />}
              />
              <Route path="/admin/liquidate/open-trades" element={<LiquidateOpenTrades />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/deposit" element={<Deposit />} />
              <Route path="/wallet/withdraw" element={<Withdraw />} />
              <Route
                path="/wallet/request-release-funds"
                element={<RequestRelease />}
              />
              <Route path="/wallet/withdraw" element={<Withdraw />} />
              <Route path="/wallet/histories" element={<HistoryPage />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/futures" element={<FuturesTrade />} />
              <Route path="/perpetual" element={<PerpetualTrade />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <BottomNavbar />
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
