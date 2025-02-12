import express from "express";
import { getMarketData } from "../controllers/marketController.js";
import { buyCrypto, sellCrypto } from "../controllers/tradeController.js";
import isUserAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.get("/market", getMarketData);
router.post("/buy", isUserAuthenticated, buyCrypto);
router.post("/sell", isUserAuthenticated, sellCrypto);

export default router;
