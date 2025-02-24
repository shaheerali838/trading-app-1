import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import TradingChart from "../components/trade/TradingChart";
import OrderForm from "../components/trade/OrderForm";
import RecentTrades from "../components/trade/RecentTrades";
import OrderBook from "../components/trade/OrderBook";
import io from "socket.io-client";
import AnimatedHeading from "../components/animation/AnimateHeading";

function Trade() {
  const [marketData, setMarketData] = useState([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const [recentTrades, setRecentTrades] = useState([]);
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

      setMarketData((prevData) => [...prevData, newCandle]);
    };

    return () => ws.close();
  }, [selectedPair, selectedInterval]);

  // WebSocket for real-time trade updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

    socket.on("tradeUpdate", (trade) => {
      setRecentTrades((prevTrades) => [trade, ...prevTrades.slice(0, 9)]);
    });

    return () => {
      socket.off("tradeUpdate");
      socket.disconnect();
    };
  }, []);

  const currentMarketPrice =
    marketData.length > 0 ? marketData[marketData.length - 1].close : 0;

  return (
    <div className=" min-h-screen max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between">
          <AnimatedHeading>
            <h3 className="text-2xl font-semibold text-white">Spot</h3>
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
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 bg-transparent border-y border-[#2f2f2f] lg:border-r p-4 hidden md:block">
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
          <div className="flex flex-row-reverse lg:flex-row w-full lg:w-2/5">
            <div className="w-1/2 bg-transparent border border-[#2f2f2f] p-4">
              <OrderBook selectedPair={selectedPair} />
            </div>
            <div className="w-1/2 bg-transparent  border-y border-[#2f2f2f] flex justify-center  p-4">
              <OrderForm
                marketPrice={currentMarketPrice}
                selectedPair={selectedPair}
                setSelectedPair={setSelectedPair}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-transparent border border-[#2f2f2f] p-4 mb-4">
            <RecentTrades trades={recentTrades} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Trade;
