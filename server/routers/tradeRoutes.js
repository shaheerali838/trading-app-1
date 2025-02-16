import express from "express";
import { getMarketData } from "../controllers/marketController.js";
import { placeOrder} from "../controllers/tradeController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";
import { fetchPendingOrders } from "../controllers/tradeController.js";

const router = express.Router();

router.get("/market", getMarketData);
router.post("/placeOrder", isUserAuthenticated, placeOrder);
router.get("/pending-orders",isAdminAuthenticated, fetchPendingOrders)

export default router;
