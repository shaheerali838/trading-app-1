import express from "express";
import { getMarketData } from "../controllers/marketController.js";
import { buyCrypto, sellCrypto } from "../controllers/tradeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/market", getMarketData);
router.post("/buy", protect, buyCrypto);
router.post("/sell", protect, sellCrypto);

export default router;
