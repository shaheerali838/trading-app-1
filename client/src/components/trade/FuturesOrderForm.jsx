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

  const extractBase = (pair) => {
    if (pair.length <= 3) return pair; // Handle edge cases
    const base = pair.slice(0, 3);
    return `${base}`;
  };

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

  return (
    <Card className="p-4 bg-transparent text-lg text-white w-full max-w-md">
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

      <div className="mb-4">
        <input
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full  text-center"
          value={marketPrice?.toFixed(0)}
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Quantity</label>
        <input
          type="number"
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800 w-full text-center"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className=" max-w-full text-sm mb-4">
        <p className="block text-sm text-gray-300 mb-1">Select Leverage</p>
        <div className="flex justify-evenly">
          <p
            className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 25
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500"
            } `}
            onClick={() => setLeverage(Number(25))}
          >
            25X
          </p>

          <p
            className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 50
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500"
            } `}
            onClick={() => setLeverage(Number(50))}
          >
            50X
          </p>

          <p
            className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 75
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500"
            } `}
            onClick={() => setLeverage(Number(75))}
          >
            75X
          </p>

          <p
            className={`rounded-sm border-[.2px] border-gray-700 w-fit px-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 100
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500 "
            } `}
            onClick={() => setLeverage(Number(100))}
          >
            100X
          </p>
        </div>
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Available USDT:</span>
        <span className="text-white">
          {wallet?.balanceUSDT.toFixed(2) || "0.00"}
        </span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Latest Price:</span>
        <span className="text-white">{marketPrice?.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Maximum Positions:</span>
        <span className="text-white">0</span>
      </div>

      <Button
        onClick={handleSubmit}
        className={` w-full py-2 rounded-md ${
          orderType === "long"
            ? "bg-blue-500 hover:bg-blue-700"
            : "bg-red-500 hover:bg-red-700"
        }`}
      >
        Open Position
      </Button>
    </Card>
  );
};

export default FuturesOrderForm;
