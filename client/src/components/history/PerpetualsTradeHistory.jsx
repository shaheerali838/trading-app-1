import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketData } from "../../store/slices/marketSlice"; // Adjust the import path

const PerpetualsTradeHistory = ({ trades }) => {
  const dispatch = useDispatch();
  const { coins, status } = useSelector((state) => state.market);

  useEffect(() => {
    dispatch(fetchMarketData());
    dispatch(fetchMarketData());
  }, [dispatch]);
  const getCoinImage = (symbol) => {
    let foundCoin = coins.find(
      (coin) => coin.symbol.toUpperCase() === symbol.toUpperCase()
    );
    return foundCoin?.image;
  };
  const extractBase = (pair) => {
    if (pair.length <= 3) return pair;
    const base = pair.slice(0, 3);
    return `${base}`;
  };

  return (
    <div className="rounded-lg shadow-lg">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Pair
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Leverage
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Quantity
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                Entry Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {trades.map((trade, index) => (
              <tr key={index} className="hover:bg-gray-800 transition-colors">
                <td className="px-4 py-2 text-sm text-gray-200 flex items-center gap-3">
                  <img
                    src={getCoinImage(extractBase(trade.pair))}
                    alt={extractBase(trade.pair)}
                    className="w-8 h-8"
                  />
                  <div>
                    <h2 className="text-lg font-bold ">
                      {extractBase(trade.pair).toUpperCase()}
                    </h2>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-200">
                  {trade.leverage}
                </td>
                <td className="px-4 py-2 text-sm text-gray-200">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trade.status === "Open"
                        ? "bg-green-500 text-green-100"
                        : "bg-red-500 text-red-100"
                    }`}
                  >
                    {trade.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-200">
                  {trade.quantity}
                </td>
                <td className="px-4 py-2 text-sm text-gray-200">
                  {trade.entryPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {trades.map((trade, index) => (
          <div
            key={trade._id}
            className=" border-b border-[#2f2f2f] p-4 shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-3">
                <img
                  src={getCoinImage(extractBase(trade.pair))}
                  alt={extractBase(trade.pair)}
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-lg font-bold ">
                    {extractBase(trade.pair).toUpperCase()}
                  </h2>
                </div>
              </span>
              <span className="text-[#e9b43b] bg-[#37321e] text-sm p-1 rounded-md">
                {trade.leverage}x
              </span>
            </div>

            <div className="mt-2 text-white text-sm">
              <div className="flex justify-between mt-1">
                <span>Quantity</span>
                <span>{trade?.quantity?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mt-1">
                <span>Entry Price</span>
                <span>{trade.entryPrice?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-red-400">Status</span>
                <span className="border border-red-400 px-2 py-1 rounded-md">
                  {trade.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerpetualsTradeHistory;
