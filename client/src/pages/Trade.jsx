import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderForm = ({ orderBookData, currentPrice }) => {
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    if (orderType === "market") {
      setPrice(currentPrice);
    }
  }, [orderType, currentPrice]);

  useEffect(() => {
    if (price && amount) {
      setTotal((parseFloat(price) * parseFloat(amount)).toFixed(2));
    }
  }, [price, amount]);

  const handleOrderSubmit = (side) => {
    const orderData = {
      type: orderType,
      price: orderType === "market" ? currentPrice : price,
      amount,
      total,
      side,
    };
    console.log("Order Submitted:", orderData);
  };

  return (
    <Card className="w-full p-4 bg-darkGray text-lightGray">
      <Tabs defaultValue="limit" className="w-full">
        <TabsList className="flex gap-2">
          <TabsTrigger value="limit" onClick={() => setOrderType("limit")}>
            Limit Order
          </TabsTrigger>
          <TabsTrigger value="market" onClick={() => setOrderType("market")}>
            Market Order
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limit">
          <div className="flex flex-col gap-3 mt-4">
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="market">
          <p className="text-sm text-green-400">Market price: {currentPrice}</p>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-3 mt-4">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input type="number" placeholder="Total" value={total} readOnly />
      </div>

      <div className="flex justify-between gap-4 mt-4">
        <Button
          className="w-1/2 bg-neonGreen hover:bg-green-700"
          onClick={() => handleOrderSubmit("buy")}
        >
          Buy
        </Button>
        <Button
          className="w-1/2 bg-crimsonRed hover:bg-red-700"
          onClick={() => handleOrderSubmit("sell")}
        >
          Sell
        </Button>
      </div>
    </Card>
  );
};

export default OrderForm;
