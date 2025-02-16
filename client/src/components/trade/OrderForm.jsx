import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "@material-tailwind/react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { placeOrder } from "../../store/slices/tradeSlice";
import AnimatedHeading from "../animation/AnimateHeading";

const socket = io("https://trading-app-t6qp.onrender.com");

const OrderForm = ({ marketPrice, selectedPair }) => {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState(marketPrice);
  const [amount, setAmount] = useState("");
  const { status, error } = useSelector((state) => state.trade);

  const extractBase = (pair) => {
    if (pair.length <= 3) return pair; // Handle edge cases
    const base = pair.slice(0, 3); 
    return `${base}`;
  };

  useEffect(() => {
    if (orderType === "market") {
      setPrice(marketPrice);
    }
  }, [orderType, marketPrice]);

  useEffect(() => {
    // Listen for real-time trade updates
    socket.on("tradeUpdate", (trade) => {
      // Handle trade updates
    });

    return () => {
      socket.off("tradeUpdate");
    };
  }, []);

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    if (orderType === "limit" && (!price || price <= 0)) {
      return alert("Enter a valid price");
    }
    console.log(selectedPair);
    
    const orderData = {
      type: side,
      orderType,
      price: orderType === "market" ? marketPrice : price,
      amount,
      coin: extractBase(selectedPair),
    };

    dispatch(placeOrder(orderData))
      .unwrap()
      .then((response) => {
        socket.emit("placeOrder", response.trade);
        toast.success("Order placed successfully!");
      })
      .catch((error) => {
        console.error("Order placement failed:", error);
        toast.error(error.message);
      });
  };
return (
    <Card className="p-4 bg-transparent text-white w-full max-w-md ">
      <AnimatedHeading>
        <h2>Spot</h2>
      </AnimatedHeading>
      <div className="mb-4">
        <div className="bg-gray-800 p-1 rounded-md flex">
          <button
            onClick={() => setSide("buy")}
            className={`w-1/2 text-center ${side === "buy" ? "bg-green-500 text-white" : "text-gray-400"}`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`w-1/2 text-center ${side === "sell" ? "bg-red-500 text-white" : "text-gray-400"}`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-800 p-1 rounded-md flex">
          <button
            onClick={() => setOrderType("market")}
            className={`w-1/2 text-center ${orderType === "market" ? "bg-blue-500 text-white" : "text-gray-400"}`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType("limit")}
            className={`w-1/2 text-center ${orderType === "limit" ? "bg-blue-500 text-white" : "text-gray-400"}`}
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
            className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-1 text-white border border-gray-800"
        />
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Market Price:</span>
        <span className="text-white">${marketPrice}</span>
      </div>

      <Button onClick={handleSubmit} className={`w-full py-2 rounded-md ${side === "buy" ? "bg-green-500" : "bg-red-500"}`}>
        {side === "buy" ? "Buy" : "Sell"}
      </Button>
    </Card>
  );
};

export default OrderForm;