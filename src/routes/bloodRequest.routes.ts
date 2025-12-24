import express from "express";
import {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  acceptBloodRequest,
  getMyRequests
} from "../controllers/bloodRequest.controller";

import { verifyToken } from "../middlewares/authtoken";

const router = express.Router();

router.post("/blood-requests", verifyToken, createBloodRequest);
router.get("/blood-requests", verifyToken, getAllBloodRequests);
router.get("/blood-requests/user/:user_id", verifyToken, getMyRequests);
router.get("/blood-requests/:id", verifyToken, getBloodRequestById);
router.put("/blood-requests/:id/accept", verifyToken, acceptBloodRequest);

export default router;
