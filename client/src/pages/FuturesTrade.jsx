import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import TradingChart from "../components/trade/TradingChart";
import OrderBook from "../components/trade/OrderBook";
import FuturesOrderForm from "../components/trade/FuturesOrderForm";
import { fetchOpenPositions } from "../store/slices/futuresTradeSlice";
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL);

function FuturesTrade() {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const { openPositions } = useSelector((state) => state.futures);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOpenPositions());
  }, [dispatch]);

  // WebSocket for Live Liquidation Tracking
  useEffect(() => {
    socket.on("liquidationUpdate", (liquidatedTrade) => {
      console.log("Liquidation Detected:", liquidatedTrade);

      // Remove liquidated trade from UI
      dispatch(fetchOpenPositions());
    });

    return () => {
      socket.off("liquidationUpdate"); // Cleanup on unmount
    };
  }, [dispatch]);

  // Fetch Market Data from Binance API
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${selectedPair}&interval=${selectedInterval}`
        );
        const data = await response.json();

        const formattedData = data.map((candle) => ({
          time: Math.floor(candle[0] / 1000),
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5]),
        }));

        setMarketData(formattedData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);

    return () => clearInterval(interval);
  }, [selectedPair, selectedInterval]);

  // ✅ WebSocket for Real-Time Market Data
  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@kline_${selectedInterval}`
    );

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const kline = response.k;
      const newCandle = {
        time: Math.floor(kline.t / 1000),
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
      };

      setMarketData((prevData) => [...prevData, newCandle]);
    };

    return () => ws.close();
  }, [selectedPair, selectedInterval]);

  const currentMarketPrice =
    marketData.length > 0 ? marketData[marketData.length - 1].close : 0;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-semibold text-white">Futures Trading</h3>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 bg-transparent border-y border-[#2f2f2f] lg:border-r p-4">
            <TradingChart
              selectedPair={selectedPair}
              setSelectedPair={setSelectedPair}
              selectedInterval={selectedInterval}
              setSelectedInterval={setSelectedInterval}
              marketData={marketData}
            />
          </div>
          <div className="flex flex-row flex-row-reverse md:flex-row lg:w-2/5">
            <div className="w-1/2 bg-transparent border border-[#2f2f2f] p-4">
              <OrderBook selectedPair={selectedPair} />
            </div>
            <div className="w-full lg:w-1/2 bg-transparent border border-[#2f2f2f] p-4">
              <FuturesOrderForm
                selectedPair={selectedPair}
                marketPrice={currentMarketPrice}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-transparent border border-[#2f2f2f] p-4 mb-4">
            <h4 className="text-lg font-semibold text-white">Open Positions</h4>
            {openPositions.length > 0 ? (
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2">Pair</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Leverage</th>
                    <th className="py-2">Entry Price</th>
                    <th className="py-2">Liquidation Price</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((trade) => (
                    <tr key={trade._id} className="border-b border-gray-700">
                      <td className="py-2">{trade.pair}</td>
                      <td className="py-2 capitalize">{trade.type}</td>
                      <td className="py-2">{trade.leverage}x</td>
                      <td className="py-2">${trade?.entryPrice?.toFixed(2)}</td>
                      <td className="py-2 text-red-500">
                        ${trade.liquidationPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No open positions</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FuturesTrade;
