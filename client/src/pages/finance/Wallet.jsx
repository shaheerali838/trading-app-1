import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getWallet } from "../../store/slices/assetsSlice";
import { Card, CardBody, h2 } from "@material-tailwind/react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet, status, error } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(getWallet()); // Fetch user wallet
  }, [dispatch]);

  if (status === "loading") return <p className="text-white">Loading...</p>;
  if (error) {
    toast.error("Failed to fetch wallet data");
    return <p className="text-red-500">Error loading wallet</p>;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-6">My Wallet</h1>

        {/* Total Balance Section */}
        <Card className="bg-[#242424] p-6 rounded-lg mb-6">
          <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
            Total Balance
          </h2>
          <CardBody className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-white">
                ${wallet?.balanceUSDT?.toFixed(2) || "0.00"}{" "}
                <span className="text-gray-400 text-sm">USDT</span>
              </p>
              <p className="text-xl font-semibold text-gray-400">
                PKR {wallet?.balancePKR?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/wallet/deposit")}
                className="btn bg-[#1E90FF] px-4 py-2 text-white rounded-md hover:bg-[#1C86EE] transition duration-300"
              >
                Deposit
              </button>
              <button
                onClick={() => navigate("/wallet/withdraw")}
                className="btn bg-[#D32F2F] px-4 py-2 text-white rounded-md hover:bg-[#C62828] transition duration-300"
              >
                Withdraw
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Holdings Section */}
        <Card className="bg-[#242424] p-6 rounded-lg mb-6">
          <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
            Your Holdings
          </h2>
          <CardBody>
            {wallet?.holdings?.length > 0 ? (
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2">Asset</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Value (USDT)</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.holdings.map((holding, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                    >
                      <td className="py-2">{holding.asset}</td>
                      <td className="py-2">{holding.quantity}</td>
                      <td className="py-2">${holding.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No assets found in your wallet.</p>
            )}
          </CardBody>
        </Card>

        {/* Deposit & Withdrawal History */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Deposit History */}
          <Card className="bg-[#242424] p-6 rounded-lg">
            <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
              Deposit History
            </h2>
            <CardBody>
              {wallet?.depositHistory?.length > 0 ? (
                <ul className="text-white">
                  {wallet.depositHistory.map((tx, index) => (
                    <li
                      key={index}
                      className="flex justify-between py-2 border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                    >
                      <span>{new Date(tx.date).toLocaleString()}</span>
                      <span className="text-green-500">
                        <AiOutlineArrowDown className="inline-block" /> $
                        {tx.amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No deposits yet.</p>
              )}
            </CardBody>
          </Card>

          {/* Withdrawal History */}
          <Card className="bg-[#242424] p-6 rounded-lg">
            <h2 className="bg-transparent text-lg font-semibold text-[#00FF7F]">
              Withdrawal History
            </h2>
            <CardBody>
              {wallet?.withdrawalHistory?.length > 0 ? (
                <ul className="text-white">
                  {wallet.withdrawalHistory.map((tx, index) => (
                    <li
                      key={index}
                      className="flex justify-between py-2 border-b border-gray-700 hover:bg-gray-800 transition duration-300"
                    >
                      <span>{new Date(tx.date).toLocaleString()}</span>
                      <span className="text-red-500">
                        <AiOutlineArrowUp className="inline-block" /> $
                        {tx.amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No withdrawals yet.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Wallet;
