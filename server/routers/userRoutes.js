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
import { isUserAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isUserAuthenticated, logoutUser);
router.get("/profile", isUserAuthenticated, getProfile);
router.put("/profile", isUserAuthenticated, updateProfile);
router.get("/getwallet", getWallet);
router.post("/deposit", isUserAuthenticated, requestDeposit);
router.post("/withdraw", isUserAuthenticated, requestWithdraw);
router.get("/transactions", isUserAuthenticated, getTransactions);

export default router;
