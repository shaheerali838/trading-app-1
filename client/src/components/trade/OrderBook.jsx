import { useEffect, useState, useRef } from "react";

const OrderBook = ({ selectedPair }) => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedPair.toLowerCase()}@depth`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setBids(data.b.slice(0, 7)); // Top 7 bid orders
      setAsks(data.a.slice(0, 7)); // Top 7 ask orders
    };

    ws.onclose = () => console.log("Order book WebSocket closed");
    return () => ws.close();
  }, [selectedPair]);

  return (
    <div className="w-full p-4">
      <h3 className="text-sm text-secondary font-semibold text-center">
        Order Book
      </h3>
      <table className="w-full text-[.7rem]">
        <thead>
          <tr className="border-b border-gray-600 text-gray-500 w-full">
            <th className="text-left p-2 w-[1/3]">Price (USDT)</th>
            <th className="text-left p-2 w-[1/3]">Amount (BTC)</th>
            <th className="text-left p-2 w-[1/3]">Total (USDT)</th>
          </tr>
        </thead>
        <tbody className="text-gray-500">
          {asks.map(([price, amount], index) => (
            <tr key={index} className="text-crimsonRed text-left">
              <td className="pb-2 pr-3 w-[1/3] text-secondary">
                {parseFloat(price).toFixed(2)}
              </td>
              <td className="pb-2 pr-3 w-[1/3]">
                {parseFloat(amount).toFixed(2)}
              </td>
              <td className="pb-2 pr-3 w-[1/3]">
                {(parseFloat(price) * parseFloat(amount)).toFixed(2)}
              </td>
            </tr>
          ))}

          {/* Current Price */}
          <tr className="text-sm text-red-500 font-bold pb-1">
            <td colSpan="3" className="text-center ">
              {asks.length > 0 ? parseFloat(asks[0][0]).toFixed(2) : "N/A"} ↓
            </td>
          </tr>

          {/* Buy Orders (Bids) */}
          {bids.map(([price, amount], index) => (
            <tr key={index} className="text-neonGreen text-left">
              <td className="pb-2 pr-3 w-[1/3] text-tertiary1">
                {parseFloat(price).toFixed(2)}
              </td>
              <td className="pb-2 pr-3 w-[1/3]">
                {parseFloat(amount).toFixed(2)}
              </td>
              <td className="pb-2 pr-3 w-[1/3]">
                {(parseFloat(price) * parseFloat(amount)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;
