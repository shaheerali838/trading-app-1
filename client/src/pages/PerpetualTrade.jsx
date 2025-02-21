import React, { useState, useEffect } from "react";
import TradingChart from "../components/trade/TradingChart";
import OrderBook from "../components/trade/OrderBook";
import PerpetualOrderForm from "../components/trade/PerpetualOrderForm";
import API from "../utils/api";
import { fetchMarketData } from "../store/slices/marketSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";


const PerpetualTrade = () => {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const { openPositions } = useSelector((state) => state.futures);
  const dispatch = useDispatch();

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

  // WebSocket for real-time updates
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
      <div className="bg-transparent border border-[#2f2f2f] p-4">
            <OrderBook selectedPair={selectedPair} />
          </div>
          <div className="bg-transparent border border-[#2f2f2f] p-4">
            <PerpetualOrderForm selectedPair={selectedPair} />
          </div>
        </div>
    </motion.div>
    </div>
  );
};

export default PerpetualTrade;
