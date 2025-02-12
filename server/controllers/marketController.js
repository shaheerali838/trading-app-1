import axios from "axios";

export const getMarketData = async (req, res) => {
  try {
    const response = await axios.get("https://api.binance.com/api/v3/ticker/price");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching market data", error });
  }
};
