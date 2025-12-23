import express from "express";
import { upsertProfile, getProfile } from "../controllers/profile.controller";
import { verifyToken } from "../middlewares/authtoken";   // ✅ ADD
const router = express.Router();

router.post("/profile", verifyToken, upsertProfile);
router.get("/profile/:userId", verifyToken, getProfile);


export default router;

