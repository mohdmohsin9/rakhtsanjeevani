import express from "express";
import {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  acceptBloodRequest,
  getMyRequests
} from "../controllers/bloodRequest.controller";

const router = express.Router();

router.post("/blood-requests", createBloodRequest);
router.get("/blood-requests", getAllBloodRequests);
router.get("/blood-requests/user/:user_id", getMyRequests);
router.get("/blood-requests/:id", getBloodRequestById);
router.put("/blood-requests/:id/accept", acceptBloodRequest);

export default router;
