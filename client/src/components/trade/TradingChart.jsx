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
  selectedPair
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

  const timeIntervals = ["1m", "5m", "15m", "1h", "24h", "1d"];

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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance only once
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
      }
    );

    // Ensure marketData is sorted and unique by time
    if (marketData.length > 0) {
      const sortedData = [...marketData]
        .sort((a, b) => a.time - b.time) // Sort by time
        .filter(
          (item, index, array) =>
            index === 0 || item.time !== array[index - 1].time
        ); // Remove duplicates

      candleSeriesRef.current.setData(sortedData);
    }

    // Handle chart resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    // Track mouse move on chart to update OHLC values
    chartInstance.current.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData || !candleSeriesRef.current) return;
      const data = param.seriesData.get(candleSeriesRef.current);
      if (data) {
        setOhlc(data);
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.remove();
      }
    };
  }, [marketData]);

  // Calculate MACD
  const calculateMACD = (
    data,
    shortPeriod = 12,
    longPeriod = 26,
    signalPeriod = 9
  ) => {
    let shortEMA = [];
    let longEMA = [];
    let macdLine = [];
    let signalLine = [];
    let histogram = [];

    for (let i = 0; i < data.length; i++) {
      if (i >= shortPeriod - 1) {
        let shortSum = data
          .slice(i - shortPeriod + 1, i + 1)
          .reduce((acc, val) => acc + val.close, 0);
        shortEMA.push(shortSum / shortPeriod);
      } else {
        shortEMA.push(data[i].close);
      }

      if (i >= longPeriod - 1) {
        let longSum = data
          .slice(i - longPeriod + 1, i + 1)
          .reduce((acc, val) => acc + val.close, 0);
        longEMA.push(longSum / longPeriod);
      } else {
        longEMA.push(data[i].close);
      }

      macdLine.push({ time: data[i].time, value: shortEMA[i] - longEMA[i] });

      if (i >= signalPeriod - 1) {
        let signalSum = macdLine
          .slice(i - signalPeriod + 1, i + 1)
          .reduce((acc, val) => acc + val.value, 0);
        signalLine.push({
          time: data[i].time,
          value: signalSum / signalPeriod,
        });
      } else {
        signalLine.push({ time: data[i].time, value: macdLine[i].value });
      }

      histogram.push({
        time: data[i].time,
        value: macdLine[i].value - signalLine[i].value,
      });
    }

    return { macd: macdLine, signal: signalLine, histogram };
  };

  // Calculate RSI
  const calculateRSI = (data, period = 14) => {
    let gains = [];
    let losses = [];
    let rsi = [];

    for (let i = 1; i < data.length; i++) {
      let change = data[i].close - data[i - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);

      if (i >= period) {
        let avgGain =
          gains.slice(i - period, i).reduce((acc, val) => acc + val, 0) /
          period;
        let avgLoss =
          losses.slice(i - period, i).reduce((acc, val) => acc + val, 0) /
          period;
        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push({ time: data[i].time, value: 100 - 100 / (1 + rs) });
      } else {
        rsi.push({ time: data[i].time, value: 50 });
      }
    }

    return rsi;
  };

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
                  {pair}
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
        <h3>
          Chart
        </h3>
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
              <span className="text-gray-600 text-[.7rem]">O: </span>{" "}
              {ohlc.open}
            </p>
            <p className="text-secondary font-semibold text-[.8rem] ">
              <span className="text-gray-600 text-[.7rem]">H: </span>{" "}
              {ohlc.high}
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
