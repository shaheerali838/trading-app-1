import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpenPositions } from "../../store/slices/futuresTradeSlice";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

function FuturesOpenPosition() {
  const [pnlData, setPnlData] = useState({});
  const [marketPrice, setMarketPrice] = useState(null);
  const { openPositions } = useSelector((state) => state.futures);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOpenPositions());
  }, [dispatch]);

  useEffect(() => {
    socket.on("liquidationUpdate", () => dispatch(fetchOpenPositions()));
    return () => socket.off("liquidationUpdate");
  }, [dispatch]);

  useEffect(() => {
    // Fetch market price directly from Binance WebSocket
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketPrice(parseFloat(data.p));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!marketPrice || openPositions.length === 0) return;

    const newPnlData = {};

    openPositions.forEach((trade) => {
      const { entryPrice, quantity, type, leverage } = trade;

      // Calculate PNL based on market price
      let pnl;
      if (type === "long") {
        pnl = (marketPrice - entryPrice) * quantity * leverage;
      } else if (type === "short") {
        pnl = (entryPrice - marketPrice) * quantity * leverage;
      } else {
        pnl = 0;
      }

      newPnlData[trade._id] = pnl;
    });

    setPnlData(newPnlData);
  }, [marketPrice, openPositions]);

  return (
    <div className="mt-6">
      <div className="hidden md:block bg-transparent border border-[#2f2f2f] p-4 mb-4">
        <h4 className="text-lg font-semibold text-white">Open Positions</h4>
        {openPositions.length > 0 ? (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2">Pair</th>
                <th className="py-2">Type</th>
                <th className="py-2">Leverage</th>
                <th className="py-2">Entry Price</th>
                <th className="py-2 hidden md:table-cell">Liquidation Price</th>
                <th className="py-2">PNL (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {openPositions.map((trade) => (
                <tr key={trade._id} className="border-b border-gray-700 text-center">
                  <td className="py-2">{trade.pair}</td>
                  <td className="py-2 capitalize">{trade.type}</td>
                  <td className="py-2">{trade.leverage}x</td>
                  <td className="py-2">${trade?.entryPrice?.toFixed(2)}</td>
                  <td className="py-2 text-red-400 hidden md:table-cell">
                    ${trade?.liquidationPrice?.toFixed(2)}
                  </td>
                  <td
                    className={`py-2 font-semibold ${
                      pnlData[trade._id] > 0 ? "text-green-500" : "text-red-400"
                    }`}
                  >
                    {pnlData[trade._id] ? pnlData[trade._id]?.toFixed(2) : "--"}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No open positions</p>
        )}
      </div>

      {/* for mobile screens */}
      <div className="md:hidden m-4">
        <h4 className="text-lg font-semibold text-white mb-4">
          Open Positions
        </h4>

        {openPositions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openPositions.map((trade) => (
              <div
                key={trade._id}
                className="bg-[#1C1C1C] border border-[#2f2f2f] p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-semibold">
                    {trade.pair} Futures
                  </span>
                  <span className="text-[#e9b43b] bg-[#37321e] text-sm p-1 rounded-md">
                    {trade.leverage}x
                  </span>
                </div>

                <div className="mt-2 text-white text-sm">
                  <div className="flex justify-between">
                    <span>PNL (USDT)</span>
                    <span
                      className={`font-semibold ${
                        pnlData[trade._id] > 0
                          ? "text-green-400"
                          : "text-[#ff5e5a]"
                      }`}
                    >
                      {pnlData[trade._id]
                        ? pnlData[trade._id].toFixed(2)
                        : "--"}
                    </span>
                  </div>

                  <div className="flex justify-between mt-1">
                    <span>Size ({trade?.pair?.split("/")[0]})</span>
                    <span>{trade?.quantity?.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between mt-1">
                    <span>Entry Price</span>
                    <span>{trade.entryPrice?.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-red-400">Liquidation Price</span>
                    <span className="border border-red-400 px-2 py-1 rounded-md">
                      {trade.liquidationPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No open positions</p>
        )}
      </div>
    </div>
  );
}

export default FuturesOpenPosition;
