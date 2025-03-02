import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closePerpetualTrade,
  fetchOpenPerpetualTrades,
} from "../../store/slices/perpetualSlice";
import { Button, Card } from "@material-tailwind/react";
import { toast } from "react-toastify";

const OpenPerpetualPositions = ({ marketPrice, showBtn }) => {
  const dispatch = useDispatch();
  const { openTrades, loading } = useSelector((state) => state.perpetual);
  const { coins } = useSelector((state) => state.market);

  const getCoinData = (symbol) => {
    return coins.find(
      (coin) => coin.symbol.toUpperCase() === symbol.toUpperCase()
    );
  };

  const handleCloseTrade = (tradeId) => {
    if (!tradeId) {
      toast.error("Please select a trade to close!");
      return;
    }
    dispatch(closePerpetualTrade({ tradeId, closePrice: marketPrice }));
    dispatch(fetchOpenPerpetualTrades());
  };

  return (
    <Card className=" bg-transparent text-white min-w-[100%] max-w-md overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 hidden md:block">
        Close Trade
      </h2>

      <table className="text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-400 uppercase bg-[#1a1a1a]">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Entry Price
            </th>
            {showBtn && (
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {openTrades?.length > 0 ? (
            openTrades?.map((trade) => {
              const coinData = getCoinData(trade.pair.split("USDT")[0]);
              return (
                <tr
                  key={trade._id}
                  className=" border-b bg-transparent border-gray-700"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={coinData?.image}
                      alt={coinData?.name}
                      className="w-6 h-6"
                    />
                    <span>{coinData?.name}</span>
                  </td>
                  <td className="px-6 py-4">{trade.type}</td>
                  <td className="px-6 py-4">{trade.entryPrice}</td>
                  {showBtn && (
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleCloseTrade(trade._id)}
                        className={`px-4 py-2 rounded-md bg-[#ff5e5a]`}
                        disabled={loading}
                      >
                        {loading ? "Closing..." : "Close Trade"}
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr className="border-b bg-[#1a1a1a] border-gray-700">
              <td colSpan={4} className="px-6 py-4 text-center">
                No open trades
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default OpenPerpetualPositions;
