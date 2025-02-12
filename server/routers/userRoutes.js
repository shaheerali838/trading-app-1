import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getWallet,
  requestDeposit,
  requestWithdraw,
  getTransactions,
  logoutUser,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authMiddleware, logoutUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/wallet", authMiddleware, getWallet);
router.post("/deposit", authMiddleware, requestDeposit);
router.post("/withdraw", authMiddleware, requestWithdraw);
router.get("/transactions", authMiddleware, getTransactions);

export default router;
