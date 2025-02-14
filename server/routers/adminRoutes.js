import express from "express";

import {
  getUserRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/depositWithdrawController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/user-requests", isAdminAuthenticated, getUserRequests);
router.get("/all-requests", isAdminAuthenticated, getAllRequests);
router.put("/approve/:requestId", isAdminAuthenticated, approveRequest);
router.put("/reject/:requestId", isAdminAuthenticated, rejectRequest);

export default router;
