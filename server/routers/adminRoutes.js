import express from "express";

import {
  getUserRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getAllUsers,
} from "../controllers/depositWithdrawController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import { logoutAdmin } from "../controllers/userController.js";
import { approveOrder, rejectOrder } from "../controllers/adminController.js";

const router = express.Router();

router.get('/logout', isAdminAuthenticated, logoutAdmin);
router.get("/user-requests", getUserRequests);
router.get("/all-requests", getAllRequests);
router.get('/all-users', getAllUsers);
router.put("/approve/:requestId", isAdminAuthenticated, approveRequest);
router.put("/reject/:requestId", isAdminAuthenticated, rejectRequest);
router.put("/approve-order/:orderId", isAdminAuthenticated, approveOrder);
router.put("/reject-order/:orderId", isAdminAuthenticated, rejectOrder);

export default router;
 