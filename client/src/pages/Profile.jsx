import React, { useState } from "react";
import { FaHistory, FaCoins } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Assets from "../components/wallet/Assets";
import { MdOutlineSupportAgent } from "react-icons/md";
import UserAvatar from "../assets/user-avatar.png";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAssets, setShowAssets] = useState(false);

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      {showAssets ? (
        <Assets type={"spot"} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>

          {/* User Information */}
          <div className="bg-[#1a1a1a]  p-6 rounded-lg mb-6">
            <div className="flex items-center mb-4">
              <div className="pr-2">
                <img src={UserAvatar} alt="" />{" "}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-300">ID: </span>
                  {user._id}
                </p>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>


          {/* Clickable Containers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/wallet")}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <IoWalletOutline className="mr-2" /> My Wallet
              </h3>
              <p className="text-gray-400">View and manage Your Wallet Here.</p>
            </div>
            <div
              onClick={() => navigate("/wallet/histories")}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaHistory className="mr-2" /> Transaction & Trades history
              </h3>
              <p className="text-gray-400">
                View Your transactions and trades history here.
              </p>
            </div>
            <div
              onClick={() => setShowAssets(true)}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaCoins className="mr-2" /> Assets
              </h3>
              <p className="text-gray-400">View and manage your assets.</p>
            </div>
            <Link
              to={"mailto:bitex.helpdesk@gmail.com"}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MdOutlineSupportAgent className="mr-2" /> Help Center
                </h3>
                <p className="text-gray-400">Tell us your problem.</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
