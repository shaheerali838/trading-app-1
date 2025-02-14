import express from "express";
import { getMarketData } from "../controllers/marketController.js";
import { placeOrder} from "../controllers/tradeController.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/market", getMarketData);
router.post("/placeOrder", isUserAuthenticated, placeOrder);

export default router;
