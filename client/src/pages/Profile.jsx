import { useState, useEffect } from "react";
import { FaHistory, FaCoins, FaIdCard } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Assets from "../components/wallet/Assets";
import { MdOutlineSupportAgent } from "react-icons/md";
import UserAvatar from "../assets/user-avatar.png";
import API from "../utils/api";
import AppearanceSettings from "../components/settings/AppearanceSettings";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAssets, setShowAssets] = useState(false);
  const [showAppearanceSettings, setShowAppearanceSettings] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const response = await API.get("/kyc/status");
      if (response.data.success) {
        setKycStatus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    }
  };

  const renderVerificationStatus = () => {
    if (
      !kycStatus ||
      !kycStatus.kycDocuments ||
      !kycStatus.kycDocuments.verificationStatus
    ) {
      return (
        <span className="bg-gray-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("not_verified")}
        </span>
      );
    }

    const { verificationStatus } = kycStatus.kycDocuments;

    if (verificationStatus === "pending") {
      return (
        <span className="bg-yellow-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("pending")}
        </span>
      );
    } else if (verificationStatus === "verified") {
      return (
        <span className="bg-green-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("verified")}
        </span>
      );
    } else if (verificationStatus === "rejected") {
      return (
        <span className="bg-red-600 text-xs font-medium px-2 py-1 rounded ml-2">
          {t("rejected")}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      {showAssets ? (
        <Assets type={"spot"} />
      ) : showAppearanceSettings ? (
        <AppearanceSettings onClose={() => setShowAppearanceSettings(false)} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{t("profile")}</h1>
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
                  <span className="font-semibold text-gray-300">
                    {t("id")}:{" "}
                  </span>
                  {user._id}
                </p>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-400 mt-1">
                  <span className="font-semibold text-gray-300">
                    {t("verification_status")}:{" "}
                  </span>
                  {renderVerificationStatus()}
                </p>
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
                <IoWalletOutline className="mr-2" /> {t("my_wallet")}
              </h3>
              <p className="text-gray-400">{t("view_manage_wallet")}</p>
            </div>
            <div
              onClick={() => navigate("/wallet/histories")}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaHistory className="mr-2" /> {t("history")}
              </h3>
              <p className="text-gray-400">{t("history_desc")}</p>
            </div>
            <div
              onClick={() => navigate("/about")}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaCircleExclamation className="mr-2" /> {t("about")}
              </h3>
              <p className="text-gray-400">{t("about_desc")}</p>
            </div>
            <div
              onClick={() => setShowAssets(true)}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaCoins className="mr-2" /> {t("assets")}
              </h3>
              <p className="text-gray-400">{t("assets_desc")}</p>
            </div>
            <div
              onClick={() => navigate("/kyc-verification")}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaIdCard className="mr-2" /> {t("id_verification")}
              </h3>
              <p className="text-gray-400">{t("kyc_desc")}</p>
            </div>
            <div
              onClick={() => setShowAppearanceSettings(true)}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MdLanguage className="mr-2" /> {t("appearance")}
              </h3>
              <p className="text-gray-400">{t("appearance_settings")}</p>
            </div>
            <Link
              to={"mailto:bitex.helpdesk@gmail.com"}
              className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MdOutlineSupportAgent className="mr-2" /> {t("help")}
                </h3>
                <p className="text-gray-400">{t("help_desc")}</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
