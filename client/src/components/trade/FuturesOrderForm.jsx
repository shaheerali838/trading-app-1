import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openFuturesTrade } from "../../store/slices/futuresTradeSlice";
import { toast } from "react-toastify";
import { getWallet } from "../../store/slices/assetsSlice";
import { Card, Button } from "@material-tailwind/react";
import AnimatedHeading from "../animation/AnimateHeading";

const FuturesOrderForm = ({ marketPrice, selectedPair }) => {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("long");
  const [leverage, setLeverage] = useState(10);
  const [quantity, setQuantity] = useState("");
  const { wallet } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (quantity <= 0 || leverage < 1) {
      return toast.error("Invalid trade details");
    }

    dispatch(
      openFuturesTrade({
        pair: selectedPair,
        type: orderType,
        leverage,
        quantity,
        entryPrice: marketPrice,
      })
    );
  };

  const formatTradingPair = (pair) => {
    if (pair.length <= 3) return pair; // Handle edge cases
    const base = pair.slice(0, 3); // Extract base currency (e.g., BTC)
    const quote = pair.slice(3); // Extract quote currency (e.g., USDT)
    return `${base}/${quote}`; // Format as BTC/USDT
  };

  return (
    <Card className="p-4 bg-transparent text-white w-full max-w-md">
      <AnimatedHeading>
        <h2>Open Position</h2>
      </AnimatedHeading>

      <div className="mb-4 bg-gray-800 p-1 rounded-md flex">
        <button
          onClick={() => setOrderType("long")}
          className={`w-1/2 text-center ${
            orderType === "long" ? "bg-green-500 text-white" : "text-gray-400"
          }`}
        >
          Long
        </button>
        <button
          onClick={() => setOrderType("short")}
          className={`w-1/2 text-center ${
            orderType === "short" ? "bg-red-500 text-white" : "text-gray-400"
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

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Entry Price</label>
        <input
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full"
          value={marketPrice}
          readOnly
        />
      </div>

      <Button onClick={handleSubmit} className={` w-full py-2 rounded-md ${orderType === "long"? "bg-blue-500 hover:bg-blue-700": "bg-red-500 hover:bg-red-700" }`}>
        Open Position
      </Button>
    </Card>
  );
};

export default FuturesOrderForm;
