import { useState, useEffect } from "react";
import { Card, Button } from "@material-tailwind/react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://trading-app-t6qp.onrender.com"); // Adjust URL if needed

const OrderForm = ({ marketPrice, userBalance }) => {
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState(marketPrice);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderType === "market") {
      setPrice(marketPrice);
    }
  }, [orderType, marketPrice]);

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    if (orderType === "limit" && (!price || price <= 0)) {
      return alert("Enter a valid price");
    }

    const totalCost = amount * price;

    if (side === "buy" && totalCost > userBalance.usdt) {
      return alert("Insufficient USDT balance");
    }
    if (side === "sell" && amount > userBalance.crypto) {
      return alert("Insufficient crypto balance");
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://trading-app-t6qp.onrender.com/api/trade/place-order",
        {
          type: side,
          orderType,
          price: orderType === "market" ? marketPrice : price,
          amount,
        },
        { withCredentials: true }
      );

      console.log("Order Response:", response.data);

      // Emit WebSocket event to update UI in real-time
      socket.emit("newOrder", response.data);

      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Error placing order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 bg-transparent text-white w-full max-w-md">
      <div className="mb-4">
        <div className="bg-gray-800 p-1 rounded-md flex">
          <button
            onClick={() => setSide("buy")}
            className={`w-1/2 text-center transition-colors duration-300 rounded-sm focus:outline-none ${
              side === "buy" ? "bg-green-500 text-white" : "text-gray-400"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`w-1/2 text-center transition-colors duration-300 rounded-sm focus:outline-none ${
              side === "sell" ? "bg-red-500 text-white" : "text-gray-400"
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-800 p-1 rounded-md flex">
          <button
            onClick={() => setOrderType("market")}
            className={`w-1/2 text-center transition-colors duration-300 rounded-sm focus:outline-none ${
              orderType === "market"
                ? "bg-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType("limit")}
            className={`w-1/2 text-center transition-colors duration-300 rounded-sm focus:outline-none ${
              orderType === "limit" ? "bg-blue-500 text-white" : "text-gray-400"
            }`}
          >
            Limit
          </button>
        </div>
      </div>

      {orderType === "limit" && (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border-[.2px] border-gray-800"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border-[.2px] border-gray-800"
        />
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Market Price:</span>
        <span className="text-white">${marketPrice}</span>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-2 rounded-md ${
          side === "buy" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isSubmitting ? "Processing..." : side === "buy" ? "Buy" : "Sell"}
      </Button>
    </Card>
  );
};

export default OrderForm;
