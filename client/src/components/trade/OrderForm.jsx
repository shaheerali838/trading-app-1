import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "@material-tailwind/react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { placeOrder } from "../../store/slices/tradeSlice";
import AnimatedHeading from "../animation/AnimateHeading";
import { getWallet } from "../../store/slices/assetsSlice";

const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

const OrderForm = ({ marketPrice, selectedPair }) => {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState(marketPrice);
  const [usdtAmount, setUsdtAmount] = useState("");
  const { status, error } = useSelector((state) => state.trade);
  const { wallet } = useSelector((state) => state.assets);
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
  const extractBase = (pair) => {
    if (pair === "MATICUSDT") {
      return "MATIC";
    } else if (pair === "DOGEUSDT") {
      return "DOGE";
    }
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
  useEffect(() => {
    dispatch(getWallet());
  }, []);

  const handleSubmit = async () => {
    if (!usdtAmount || usdtAmount <= 0) return toast.error("Enter a valid amount");
    if (orderType === "limit" && (!price || price <= 0)) {
      return alert("Enter a valid price");
    }

    const orderData = {
      type: side,
      orderType,
      price: marketPrice,
      usdtAmount,
      coin: extractBase(selectedPair),
    };

    dispatch(placeOrder(orderData))
      .unwrap()
      .then((response) => {
        socket.emit("placeOrder", response.trade);
        toast.success("Order placed successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <Card className="md:p-4 bg-transparent text-white w-full text-lg  flex justify-center">
      <AnimatedHeading>
        <h2 className="hidden md:block">Spot</h2>
      </AnimatedHeading>
      <div className="mb-2">
        <div className=" p-1 rounded-md flex gap-2">
          <button
            onClick={() => setSide("buy")}
            className={`w-1/2 text-center py-2 rounded-md ${
              side === "buy"
                ? "bg-[#26bb8c] text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`w-1/2 text-center py-2 rounded-md ${
              side === "sell"
                ? "bg-[#ff5e5a] text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="p-1 rounded-md flex gap-2">
          <button
            onClick={() => setOrderType("market")}
            className={`w-1/2 text-center py-2 rounded-md ${
              orderType === "market"
                ? "bg-primary text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType("limit")}
            className={`w-1/2 text-center py-2 rounded-md ${
              orderType === "limit"
                ? "bg-primary text-white"
                : "text-gray-400 bg-[#232323]"
            }`}
          >
            Limit
          </button>
        </div>
      </div>

      {orderType === "limit" ? (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Select Limit Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="max-w-full bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-2 text-center text-white border border-gray-800"
          />
        </div>
      ) : (
        <div className="mb-4">
          <input
            type="number"
            className="bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-2 text-white border border-gray-800 w-full  text-center"
            value={marketPrice?.toFixed(0)}
            readOnly
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">{side === "buy"? "USDT Amount" : "Quantity"}</label>
        <input
          type="number"
          value={usdtAmount}
          onChange={(e) => setUsdtAmount(e.target.value)}
          className="max-w-full bg-gray-700 bg-transparent focus:outline-none rounded-md px-2 py-2 text-white border border-gray-800"
        />
      </div>

      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Market Price:</span>
        <span className="text-white">${marketPrice}</span>
      </div>
      <div className="flex justify-between text-gray-400 text-sm mb-2">
        <span>Available USDT:</span>
        <span className="text-white">
          {wallet?.spotWallet.toFixed(2) || "0.00"}
        </span>
      </div>

      <Button
        onClick={handleSubmit}
        className={`w-full py-2 rounded-md ${
          side === "buy" ? "bg-[#26bb8c]" : "bg-[#ff5e5a]"
        }`}
      >
        {side === "buy" ? "Buy" : "Sell"}
      </Button>
    </Card>
  );
};

export default OrderForm;
