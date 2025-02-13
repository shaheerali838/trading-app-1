import express from "express";
import { createDepositWithdrawRequest } from "../controllers/depositWithdrawController.js";
import authMiddleware from "../middlewares/auth.js";
import adminMiddleware from "../middlewares/admin.js";

const router = express.Router();

router.post("/request", authMiddleware, createDepositWithdrawRequest);

export default router;
