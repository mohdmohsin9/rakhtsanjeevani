import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  searchDonor,
} from "../controllers/notification.controller";
import { verifyToken } from "../middlewares/authtoken";

const router = express.Router();

// Notifications
router.get("/notifications", verifyToken, getNotifications);
router.put("/notifications/:notificationId/read", verifyToken, markAsRead);
router.put("/notifications/read-all", verifyToken, markAllAsRead);

// Search Donor
router.get("/search-donor", verifyToken, searchDonor);

export default router;

