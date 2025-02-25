import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import TradingChart from "../components/trade/TradingChart";
import OrderBook from "../components/trade/OrderBook";
import FuturesOrderForm from "../components/trade/FuturesOrderForm";
import { fetchOpenPositions } from "../store/slices/futuresTradeSlice";
import io from "socket.io-client";
import AnimatedHeading from "../components/animation/AnimateHeading";
import { useNavigate } from "react-router-dom";
import { MdCandlestickChart } from "react-icons/md";

const socket = io(import.meta.env.VITE_API_URL);

function FuturesTrade() {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const { openPositions } = useSelector((state) => state.futures);
  const showChart = useSelector((state) => state.global.showChart);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const tradingPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "MATICUSDT",
    "DOTUSDT",
    "LTCUSDT",
  ];
  const formatTradingPair = (pair) => {
    if (pair.length <= 3) return pair; // Handle edge cases
    const base = pair.slice(0, 3); // Extract base currency (e.g., BTC)
    const quote = pair.slice(3); // Extract quote currency (e.g., USDT)
    return `${base}/${quote}`; // Format as BTC/USDT
  };

  useEffect(() => {
    dispatch(fetchOpenPositions());
  }, [dispatch]);

  useEffect(() => {
    socket.on("liquidationUpdate", () => dispatch(fetchOpenPositions()));
    return () => socket.off("liquidationUpdate");
  }, [dispatch]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${selectedPair}&interval=${selectedInterval}`
        );
        const data = await response.json();

        setMarketData(
          data.map((candle) => ({
            time: Math.floor(candle[0] / 1000),
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
          }))
        );
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [selectedPair, selectedInterval]);

  const currentMarketPrice =
    marketData.length > 0 ? marketData[marketData.length - 1].close : 0;
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between">
          <AnimatedHeading>
            <h3 className="text-2xl font-semibold text-white">
              Futures Trading
            </h3>
          </AnimatedHeading>
          <div className="md:hidden">
            <select
              id="tradingPair"
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-black text-tertiary3 p-2 focus:outline-none"
            >
              {tradingPairs.map((pair, index) => (
                <option key={index} value={pair}>
                  {formatTradingPair(pair)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row">
        <div
            className={`w-full lg:w-3/5 bg-transparent border-y border-[#2f2f2f] lg:border-r md:p-4 ${
              !showChart ? "hidden md:block" : ""
            }`}
          >
            <div>
              <TradingChart
                marketData={marketData}
                onPairChange={setSelectedPair}
                indicators={["volume", "macd", "rsi"]}
                selectedInterval={selectedInterval}
                setSelectedInterval={setSelectedInterval}
                setSelectedPair={setSelectedPair}
                selectedPair={selectedPair}
              />
            </div>
          </div>

          {/* Order Form & Order Book in a Row */}
          <div className="flex flex-row-reverse lg:flex-row w-full lg:w-2/5">
            <div className="w-1/2 bg-transparent border border-[#2f2f2f] p-4">
              <OrderBook selectedPair={selectedPair} hideTotalUSDT={true} />
            </div>
            <div className="w-1/2 bg-transparent border border-[#2f2f2f] p-4">
              <FuturesOrderForm
                selectedPair={selectedPair}
                marketPrice={currentMarketPrice}
              />
            </div>
          </div>
        </div>

        {/* Orders Section with Tab Navigation */}
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
                    <th className="py-2 hidden md:table-cell">
                      Liquidation Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((trade) => (
                    <tr key={trade._id} className="border-b border-gray-700">
                      <td className="py-2">{trade.pair}</td>
                      <td className="py-2 capitalize">{trade.type}</td>
                      <td className="py-2">{trade.leverage}x</td>
                      <td className="py-2">${trade?.entryPrice?.toFixed(2)}</td>
                      <td className="py-2 text-red-500 hidden md:table-cell">
                        ${trade?.liquidationPrice?.toFixed(2)}
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
