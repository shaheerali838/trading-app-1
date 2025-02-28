import express from "express";
import { placeOrder } from "../controllers/tradeController.js";
import {
  isAdminAuthenticated,
  isUserAuthenticated,
} from "../middlewares/auth.js";
import { fetchPendingOrders } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/placeOrder", isUserAuthenticated, placeOrder);
router.get("/pending-orders", isAdminAuthenticated, fetchPendingOrders);

export default router;
