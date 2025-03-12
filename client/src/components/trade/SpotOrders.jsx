import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpotTradesHistory,
  fetchPendingOrders,
} from "../../store/slices/tradeSlice";
import SpotTradesHistory from "../history/SpotTradesHistory";

const SpotOrders = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("pending");

  const { pendingOrders, spotHistoryTrades, loading } = useSelector(
    (state) => state.trade
  );

  useEffect(() => {
    dispatch(fetchSpotTradesHistory());
    dispatch(fetchPendingOrders());
  }, [dispatch]);


  return (
    <div className="p-4 text-white shadow-lg w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "pending"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Open Orders
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "history"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Trade History
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : activeTab === "pending" ? (
              <SpotTradesHistory trades={pendingOrders} />
            ) : (
              <SpotTradesHistory trades={spotHistoryTrades} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpotOrders;
