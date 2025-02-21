import express from "express";
import {
  openPerpetualPosition,
  closePerpetualPosition,
  applyFundingRates,
  fetchOpenPerpetualTrades,
} from "../controllers/perpetualController.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/open", isUserAuthenticated, openPerpetualPosition);
router.post("/close", isUserAuthenticated, closePerpetualPosition);
router.get("/funding-rates", applyFundingRates);
router.get("/open-positions", isUserAuthenticated, fetchOpenPerpetualTrades);

export default router;
