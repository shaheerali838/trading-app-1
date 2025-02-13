import express from 'express';

import { getUserRequests, getAllRequests, approveRequest, rejectRequest } from './controllers/depositWithdrawController.js';

const router = express.Router();


router.get("/user-requests", authMiddleware, getUserRequests);
router.get("/all-requests", authMiddleware, adminMiddleware, getAllRequests);
router.put("/approve/:requestId", authMiddleware, adminMiddleware, approveRequest);
router.put("/reject/:requestId", authMiddleware, adminMiddleware, rejectRequest);

export default router;