import React, { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  createChart,
} from "lightweight-charts";

const TradingChart = ({
  marketData,
  tradingPair,
  onPairChange,
  selectedInterval,
  setSelectedInterval,
  setSelectedPair,
  selectedPair,
}) => {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const macdLineSeriesRef = useRef(null);
  const macdSignalSeriesRef = useRef(null);
  const macdHistogramRef = useRef(null);
  const rsiSeriesRef = useRef(null);
  const [ohlc, setOhlc] = useState(null);
  const [savedRange, setSavedRange] = useState(null); // To save the visible range

  const timeIntervals = ["1m", "5m", "15m", "1h", "1d", "1w"];

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
    if (!chartContainerRef.current) return;

    // Create chart instance only once
    if (!chartInstance.current) {
      chartInstance.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: "transparent" },
          textColor: "#EAEAEA",
        },
        grid: {
          vertLines: { color: "#333333" },
          horzLines: { color: "#333333" },
        },
      });

      // Add candlestick series
      candleSeriesRef.current = chartInstance.current.addSeries(
        CandlestickSeries,
        {
          upColor: "#00C853",
          downColor: "#D32F2F",
          borderUpColor: "#00C853",
          borderDownColor: "#D32F2F",
          wickUpColor: "#00C853",
          wickDownColor: "#D32F2F",
          priceScaleId: 'right',
        }
      );
      volumeSeriesRef.current = chartInstance.current.addSeries(
              HistogramSeries,
              {
                color: "#26a69a",
                priceFormat: { type: "volume" },
                priceScaleId: "",
              }
            );
      
            // Add MACD line series
            macdLineSeriesRef.current = chartInstance.current.addSeries(LineSeries, {
              height: 20,
              color: "#FFEB3B",
              priceScaleId: 'macd', // Separate price scale for MACD
            });
      
            // Add MACD signal series
            macdSignalSeriesRef.current = chartInstance.current.addSeries(
              LineSeries,
              {
                color: "#FF5722",
                priceScaleId: 'macd', // Separate price scale for MACD
              }
            );
      
            // Add MACD histogram series
            macdHistogramRef.current = chartInstance.current.addSeries(
              HistogramSeries,
              {
                color: "#9C27B0",
                priceScaleId: 'macd', // Separate price scale for MACD
              }
            );
      
            // Add RSI series
            rsiSeriesRef.current = chartInstance.current.addSeries(LineSeries, {
              color: "#03A9F4",
              priceScaleId: 'rsi', // Separate price scale for RSI
            });
          }
          
      // Subscribe to visible range changes to save the current zoom level
      chartInstance.current.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        setSavedRange(range);
      });

      // Track mouse move on chart to update OHLC values
      chartInstance.current.subscribeCrosshairMove((param) => {
        if (!param || !param.seriesData || !candleSeriesRef.current) return;
        const data = param.seriesData.get(candleSeriesRef.current);
        if (data) {
          setOhlc(data);
        }
      });

    // Handle chart resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !candleSeriesRef.current || !marketData.length) return;

    // Save the current visible range before updating data
    const currentRange = chartInstance.current.timeScale().getVisibleLogicalRange();

    // Ensure marketData is sorted and unique by time
    const sortedData = [...marketData]
      .sort((a, b) => a.time - b.time) // Sort by time
      .filter(
        (item, index, array) =>
          index === 0 || item.time !== array[index - 1].time
      ); // Remove duplicates

    // Update candlestick data
    candleSeriesRef.current.setData(sortedData);

    // Restore the visible range after updating data
    if (currentRange) {
      chartInstance.current.timeScale().setVisibleLogicalRange(currentRange);
    }
  }, [marketData]);
  

  return (
    <div>
      <div className="flex justify-between items-center border-b-[.3px] border-[#00c853] ">
        <div className=" flex gap-4 w-fit">
          <div>
            <select
              id="tradingPair"
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-black text-tertiary3 p-2 border-r-[.3px] border-[#00c853] focus:outline-none"
            >
              {tradingPairs.map((pair, index) => (
                <option key={index} value={pair}>
                  {formatTradingPair(pair)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {ohlc && (
          <div className="w-full py-1 flex justify-evenly">
            <p className="flex flex-col text-[.8rem] ">
              {" "}
              <span className="text-gray-600 text-[.7rem]">24H Open</span>{" "}
              {ohlc.open}
            </p>
            <p className="flex flex-col text-[.8rem] ">
              {" "}
              <span className="text-gray-600 text-[.7rem]">24H High</span>{" "}
              {ohlc.high}
            </p>
            <p className="flex flex-col text-[.8rem] ">
              <span className="text-gray-600 text-[.7rem]">24H Low</span>
              {ohlc.low}
            </p>
            <p className="flex flex-col text-[.8rem] ">
              <span className="text-gray-600 text-[.7rem]">24H Close</span>
              {ohlc.close}
            </p>
          </div>
        )}
      </div>
      <div className="w-full text-gray-400 border-b-[.3px] border-gray-600 ">
        <h3>Chart</h3>
      </div>
      <div className="flex justify-evenly border-b-[.3px] border-gray-600 ">
        {timeIntervals.map((timeInterval, index) => (
          <p
            key={index}
            onClick={() => setSelectedInterval(timeInterval)}
            className={`btn cursor-pointer ${
              selectedInterval === timeInterval
                ? "text-primary"
                : "text-gray-600"
            }`}
          >
            {timeInterval}
          </p>
        ))}
      </div>
      {ohlc && (
        <div className="w-full py-1 flex justify-evenly">
          <p className="text-secondary font-semibold text-[.8rem] ">
            <span className="text-gray-600 text-[.7rem]">O: </span> {ohlc.open}
          </p>
          <p className="text-secondary font-semibold text-[.8rem] ">
            <span className="text-gray-600 text-[.7rem]">H: </span> {ohlc.high}
          </p>
          <p className="text-secondary font-semibold text-[.8rem] ">
            <span className="text-gray-600 text-[.7rem]">L: </span>
            {ohlc.low}
          </p>
          <p className="text-secondary font-semibold text-[.8rem] ">
            <span className="text-gray-600 text-[.7rem]">C: </span>
            {ohlc.close}
          </p>
        </div>
      )}

      <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default TradingChart;