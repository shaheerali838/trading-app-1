export const sellCrypto = async (req, res) => {
    try {
      const { asset, quantity, price } = req.body;
      const totalValue = quantity * price;
  
      const wallet = await Wallet.findOne({ userId: req.user.userId });
      if (!wallet) return res.status(404).json({ msg: "Wallet not found" });
  
      const assetHolding = wallet.holdings.find((item) => item.asset === asset);
      if (!assetHolding || assetHolding.quantity < quantity) {
        return res.status(400).json({ msg: "Insufficient crypto balance" });
      }
  
      // Deduct crypto holdings
      assetHolding.quantity -= quantity;
      if (assetHolding.quantity === 0) {
        wallet.holdings = wallet.holdings.filter((item) => item.asset !== asset);
      }
  
      // Add USDT balance
      wallet.balanceUSDT += totalValue;
  
      await wallet.save();
  
      // Record the trade
      const trade = new Trade({ userId: req.user.userId, type: "sell", asset, quantity, price, totalCost: totalValue });
      await trade.save();
  
      res.json({ msg: "Sale successful", trade });
  
    } catch (error) {
      res.status(500).json({ msg: "Error processing sale", error });
    }
  };
