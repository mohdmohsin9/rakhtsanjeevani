import express from "express";
import {
  upsertProfile,
  getProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/profile.controller";
import { verifyToken } from "../middlewares/authtoken";

const router = express.Router();

// Profile basic details (JSON body)
router.post("/profile", verifyToken, upsertProfile);
router.get("/profile", verifyToken, getProfile);

// Address Management
router.post("/address", verifyToken, addAddress);
router.put("/address/:addressId", verifyToken, updateAddress);
router.delete("/address/:addressId", verifyToken, deleteAddress);

export default router;

