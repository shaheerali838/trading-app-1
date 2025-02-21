import express from "express";
import {
  openFuturesPosition,
  closeFuturesPosition,
  getOpenPositions,
} from "../controllers/futuresTradeController.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/open", isUserAuthenticated, openFuturesPosition);
router.post("/close", isUserAuthenticated, closeFuturesPosition);
router.get("/positions", isUserAuthenticated, getOpenPositions);

export default router;
