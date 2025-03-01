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
    if (!closeTradeId) {
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

<div className=" p-1 rounded-md flex gap-2">
        <button
          onClick={() => setType("long")}
          className={`w-1/2 text-center py-2 rounded-md ${
            type === "long" ? "bg-[#26bb8c] text-white" : "text-gray-400  bg-[#232323]"
          }`}
        >
          Long
        </button>
        <button
          onClick={() => setType("short")}
          className={`w-1/2 text-center py-2 rounded-md ${
            type === "short" ? "bg-[#ff5e5a] text-white" : "text-gray-400  bg-[#232323]"
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
            className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 mx-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 25
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500"
            } `}
            onClick={() => setLeverage(Number(25))}
          >
            25X
          </p>

          <p
            className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 mx-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 50
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500"
            } `}
            onClick={() => setLeverage(Number(50))}
          >
            50X
          </p>

          <p
            className={` rounded-sm border-[.2px] border-gray-700 w-fit px-1 mx-1 cursor-pointer hover:scale-[1.2] ${
              leverage === 75
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500"
            } `}
            onClick={() => setLeverage(Number(75))}
          >
            75X
          </p>

          <p
            className={`rounded-sm border-[.2px] border-gray-700 w-fit px-1 mx-1 cursor-pointer hover:scale-[1.2] ${
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
        onClick={handleOpenTrade}
        className={` w-full py-2 rounded-md ${
          type === "long"
            ? "bg-[#26bb8c] hover:bg-green-500"
            : "bg-[#ff5e5a] hover:bg-red-500"
        }`}
      >
        Open Position
      </Button>
    </Card>
  );
};

export default PerpetualOrderForm;
