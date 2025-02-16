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
    
    const socket = io("https://trading-app-t6qp.onrender.com");

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
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <AnimatedHeading>
          <h3>Spot</h3>
        </AnimatedHeading>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5bg-transparent border-y border-[#2f2f2f] lg:border-r  p-4">
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
          <div className="bg-transparent border border-[#2f2f2f] p-4">
            <OrderBook selectedPair={selectedPair} />
          </div>
          <div className=" bg-transparent  border-y border-[#2f2f2f] flex justify-center  p-4">
            <OrderForm
              marketPrice={currentMarketPrice}
              selectedPair={selectedPair}
            />
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
