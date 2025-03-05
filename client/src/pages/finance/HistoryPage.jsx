import { useEffect, useState } from "react";
import { getWallet } from "../../store/slices/assetsSlice";
import Loader from "../../components/layout/Loader";
import { useDispatch, useSelector } from "react-redux";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { wallet, status, error } = useSelector((state) => state.assets);
  const [activeTab, setActiveTab] = useState("deposits");

  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);

  if (status === "loading") {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!wallet) {
    return (
      <div className="text-gray-400 text-center p-4">
        No wallet data available.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen text-white">
      {/* Tab Navigation */}
      <div className="flex justify-around border-b-2 border-gray-700 mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "deposits"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("deposits")}
        >
          Deposits History
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "withdrawals"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("withdrawals")}
        >
          Withdrawals History
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "transfers"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("transfers")}
        >
          Transfer History
        </button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="space-y-4">
        {activeTab === "deposits" ? (
          <DepositHistoryList transactions={wallet?.depositHistory || []} />
        ) : activeTab === "withdrawals" ? (
          <WithdrawalHistoryList
            transactions={wallet?.withdrawalHistory || []}
          />
        ) : (
          <TransferHistoryList transfers={wallet?.transferHistory || []} />
        )}
      </div>
    </div>
  );
};

// Transaction History List Component
const DepositHistoryList = ({ transactions }) => {
  if (transactions?.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions?.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#1a1a1a] p-4 rounded-2xl shadow-md hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">
                {transaction.type}
              </p>
              <p className="text-xs text-gray-400">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString()
                  : "Invalid date"}
              </p>
            </div>
            <p className={"text-sm font-semibold text-green-400"}>
              {transaction.amount} {transaction.currency}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {transaction.description}
          </p>
        </div>
      ))}
    </div>
  );
};
const WithdrawalHistoryList = ({ transactions }) => {
  if (transactions?.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions?.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#1a1a1a] p-4 rounded-2xl shadow-md hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {transaction.type}
              </p>
              <p className="text-xs text-gray-400">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString()
                  : "Invalid date"}
              </p>
            </div>
            <p className={"text-sm font-semibold text-red-400"}>
              {transaction.amount} {transaction.currency}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {transaction.description}
          </p>
        </div>
      ))}
    </div>
  );
};

// Transfer History List Component
const TransferHistoryList = ({ transfers }) => {
  if (transfers?.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4">No transfers found.</div>
    );
  }

  return (
    <div className="space-y-3">
      {transfers?.map((transfer) => (
        <div
          key={transfer.id}
          className="bg-[#1a1a1a] p-4 rounded-2xl shadow-md hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">
                Transfer to {transfer.toWallet}
              </p>
              <p className="text-xs text-gray-400">
                {transfer.timestamp
                  ? new Date(transfer.timestamp).toLocaleString()
                  : "Invalid date"}
              </p>
            </div>
            <p className="text-sm font-semibold text-blue-400">
              {transfer.amount} {transfer.currency ? transfer.currency : "USDT"}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            From: {transfer.fromWallet}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;
