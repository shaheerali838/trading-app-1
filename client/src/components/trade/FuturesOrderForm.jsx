import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { openFuturesTrade } from "../../store/slices/futuresTradeSlice";
import { toast } from "react-toastify";

const FuturesOrderForm = ({ selectedPair }) => {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("long");
  const [leverage, setLeverage] = useState(10);
  const [quantity, setQuantity] = useState(0);
  const [entryPrice, setEntryPrice] = useState("");

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
        entryPrice,
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
    <div>
      <h3 className="text-sm text-secondary font-semibold text-start mb-2">
        Open Position
      </h3>
      <div className="p-4 border border-gray-700 bg-[#242424] rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-white">
              Pair: {formatTradingPair(selectedPair)}
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="bg-black rounded-lg text-white p-2"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-white">Leverage:</label>
            <input
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              min="1"
              max="100"
              className="bg-black rounded-lg text-white p-2"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <label className="text-white">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-black rounded-lg text-white p-2"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-white">Entry Price:</label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="bg-black rounded-lg text-white p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-md"
          >
            Open {orderType === "long" ? "Long" : "Short"} Position
          </button>
        </form>
      </div>
    </div>
  );
};

export default FuturesOrderForm;
