import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpenTrades, liquidateTrade } from "../../store/slices/adminSlice";

const LiquidateOpenTrades = () => {
  const dispatch = useDispatch();
  const {openTrades} = useSelector((state) => state.admin)

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    dispatch(fetchOpenTrades());
  };

  const handleLiquidateTrade = async (tradeId) => {
    dispatch(liquidateTrade(tradeId));
    fetchTrades();
  };

  return (
    <Card className="min-h-screen p-4 bg-transparent text-white w-full">
      <h2 className="text-xl font-bold mb-4">
        Open Perpetual & Futures Trades
      </h2>

      {openTrades.length === 0 ? (
        <p className="text-gray-400">No open trades</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Pair</th>
              <th className="p-2">Type</th>
              <th className="p-2">Leverage</th>
              <th className="p-2">Entry Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {openTrades.map((trade) => (
              <tr key={trade._id} className="border-b border-gray-800">
                <td className="p-2">{trade.pair}</td>
                <td className="p-2">{trade.type}</td>
                <td className="p-2">{trade.leverage}x</td>
                <td className="p-2">${trade.entryPrice}</td>
                <td className="p-2">
                  <Button
                    onClick={() => handleLiquidateTrade(trade._id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    Liquidate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};

export default LiquidateOpenTrades;
