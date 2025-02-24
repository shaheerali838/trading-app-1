import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openPerpetualTrade,
  closePerpetualTrade,
  fetchOpenPerpetualTrades,
} from "../../store/slices/perpetualSlice";
import { Card, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import AnimatedHeading from "../animation/AnimateHeading";

const PerpetualOrderForm = ({ selectedPair, marketPrice }) => {
  const dispatch = useDispatch();
  const { loading, openTrades } = useSelector((state) => state.perpetual);

  const [type, setType] = useState("long");
  const [leverage, setLeverage] = useState(10);
  const [quantity, setQuantity] = useState("");
  const [closeTradeId, setCloseTradeId] = useState("");
  const { wallet } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(fetchOpenPerpetualTrades());
  }, [dispatch]);
  const handleOpenTrade = () => {
    if (!quantity) {
      toast.error("Please enter all fields!");
      return;
    }
    dispatch(
      openPerpetualTrade({
        pair: selectedPair,
        type,
        leverage,
        quantity,
        entryPrice: marketPrice,
      })
    );
  };

  const handleCloseTrade = () => {
    
    if (!closeTradeId ) {
      toast.error("Please select a trade and enter close price!");
      return;
    }
    dispatch(
      closePerpetualTrade({ tradeId: closeTradeId, closePrice: marketPrice })
    );
    dispatch(fetchOpenPerpetualTrades());    
  };

  return (
    <Card className="p-4 bg-transparent text-white w-full max-w-md">
      <AnimatedHeading>
        <h2>Perpetual</h2>
      </AnimatedHeading>

      <div className="mb-4 bg-gray-800 p-1 rounded-md flex">
        <button
          onClick={() => setType("long")}
          className={`w-1/2 text-center ${
            type === "long" ? "bg-green-500 text-white" : "text-gray-400"
          }`}
        >
          Long
        </button>
        <button
          onClick={() => setType("short")}
          className={`w-1/2 text-center ${
            type === "short" ? "bg-red-500 text-white" : "text-gray-400"
          }`}
        >
          Short
        </button>
      </div>
      <div className="flex justify-between items-center ">
        <p>
          Available Amount:{" "}
          <span className="pl-2 pr-1 text-white">
            {wallet?.balanceUSDT?.toFixed(2) || "0.0"}
          </span>
          USDT
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Leverage</label>
        <input
          type="number"
          min="1"
          max="100"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full"
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Quantity</label>
        <input
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <Button
        onClick={handleOpenTrade}
        className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Opening Trade..." : "Open Trade"}
      </Button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Close Trade</h3>
        <label className="block text-sm text-gray-300 mb-1">
          Select Open Trade
        </label>
        <select
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full"
          value={closeTradeId}
          onChange={(e) => setCloseTradeId(e.target.value)}
        >
          <option value="" disabled>Select an Open Position</option>
          {openTrades?.map((trade) => (
            <option key={trade._id} value={trade._id} className="bg-black">
              {trade.pair} ({trade.type}) - {trade.entryPrice}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Market Price:</span>
        <span className="text-white">${marketPrice}</span>
      </div>
      <Button
        onClick={handleCloseTrade}
        className="w-full py-2 rounded-md bg-red-500 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Closing Trade..." : "Close Trade"}
      </Button>
    </Card>
  );
};

export default PerpetualOrderForm;
