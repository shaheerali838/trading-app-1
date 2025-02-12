import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import TradingChart from "../components/trade/TradingChart";
import OrderForm from "../components/trade/OrderForm";
import RecentTrades from "../components/trade/RecentTrades";
import OrderBook from "../components/trade/OrderBook";
import io from "socket.io-client";

function Trade() {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const [recentTrades, setRecentTrades] = useState([]);

  const { symbol } = useParams();
  const dispatch = useDispatch();
  const { coins } = useSelector((state) => state.market);

  const selectedCoin = coins.find(
    (coin) => coin.symbol.toLowerCase() === symbol
  );

  // Fetch historical market data
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

      setMarketData((prevData) => [...prevData.slice(-99), newCandle]);
    };

    return () => ws.close();
  }, [selectedPair, selectedInterval]);

  // WebSocket for real-time trade updates
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("tradeUpdate", (trade) => {
      setRecentTrades((prevTrades) => [trade, ...prevTrades.slice(0, 9)]);
    });

    return () => {
      socket.off("tradeUpdate");
      socket.disconnect();
    };
  }, []);

  // Extract the current market price from the market data
  const currentMarketPrice =
    marketData.length > 0 ? marketData[marketData.length - 1].close : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8"
      >
        <div className="flex items-center gap-4 mb-6">
          {selectedCoin && (
            <>
              <img
                src={selectedCoin.image}
                alt={selectedCoin.name}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-4xl font-bold">{selectedCoin.name}</h1>
                <span className="text-light/60">
                  {selectedCoin.symbol.toUpperCase()}/USDT
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-evenly">
          <div className="w-full">
            <div className="rounded-lg">
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
          <div className="col-span-3 bg-darkGray p-4 rounded-lg">
            <OrderBook selectedPair={selectedPair} />
          </div>

          <div className="border-l border-b border-[#00c853] w-[25vw]">
            <OrderForm
              marketPrice={currentMarketPrice}
              selectedPair={selectedPair}
            />
          </div>
        </div>

        <div className="mt-6">
          <RecentTrades trades={recentTrades} />
        </div>
      </motion.div>
    </div>
  );
}

export default Trade;
