import { useState } from "react";

const OrderForm = ({ onSubmit }) => {
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");

  // Auto-calculate total
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setTotal((parseFloat(price || 0) * parseFloat(e.target.value || 0)).toFixed(6));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price || !amount) return alert("Please enter price and amount.");

    onSubmit({ type: orderType, price, amount, total });
  };

  return (
    <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md w-full max-w-md">
      {/* Tabs */}
      <div className="flex justify-between mb-4">
        <button
          className={`w-1/2 py-2 text-center rounded-md ${
            orderType === "buy" ? "bg-[#00C853] text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setOrderType("buy")}
        >
          Buy
        </button>
        <button
          className={`w-1/2 py-2 text-center rounded-md ${
            orderType === "sell" ? "bg-[#D32F2F] text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setOrderType("sell")}
        >
          Sell
        </button>
      </div>

      {/* Order Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-gray-300 block">Price (USDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="text-gray-300 block">Amount (BTC)</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="text-gray-300 block">Total (USDT)</label>
          <input
            type="text"
            value={total}
            disabled
            className="w-full p-2 rounded bg-gray-700 text-gray-400 border border-gray-600"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${
            orderType === "buy" ? "bg-[#00C853]" : "bg-[#D32F2F]"
          }`}
        >
          {orderType === "buy" ? "Buy BTC" : "Sell BTC"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
