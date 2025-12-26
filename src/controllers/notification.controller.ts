import { Request, Response } from "express";
import { Notification } from "../models/notification.models";
import { Profile } from "../models/profile.models";
import { BloodRequest } from "../models/bloodRequest.models";

// Get all notifications for logged-in user
export const getNotifications = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is missing from token",
      });
    }

    // Get profile to get user_id format
    const profile = await Profile.findOne({ user_id: userId });
    const userIdentifier = profile?.user_id || userId;

    const notifications = await Notification.find({ user_id: userIdentifier })
      .sort({ createdAt: -1 })
      .limit(50);

    // Group by date (Today, Yesterday, etc.)
    const grouped = {
      today: [] as any[],
      yesterday: [] as any[],
      older: [] as any[],
    };

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    notifications.forEach((notif) => {
      const notifDate = new Date(notif.createdAt);
      if (notifDate >= todayStart) {
        grouped.today.push(notif);
      } else if (notifDate >= yesterdayStart) {
        grouped.yesterday.push(notif);
      } else {
        grouped.older.push(notif);
      }
    });

    // Count unread
const unreadCount = notifications.filter((n) => !n.is_read).length;

    return res.json({
      success: true,
      data: {
        notifications: grouped,
        unread_count: unreadCount,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Mark notification as read
export const markAsRead = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is missing from token",
      });
    }

    const profile = await Profile.findOne({ user_id: userId });
    const userIdentifier = profile?.user_id || userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user_id: userIdentifier },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    return res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Mark all as read
export const markAllAsRead = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is missing from token",
      });
    }

    const profile = await Profile.findOne({ user_id: userId });
    const userIdentifier = profile?.user_id || userId;

    await Notification.updateMany(
      { user_id: userIdentifier, is_read: false },
      { is_read: true }
    );

    return res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Search Donor API (based on location and blood group)
export const searchDonor = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;
    const { blood_group, location, latitude, longitude, radius_km = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is missing from token",
      });
    }

    // Exclude current user from search results
    const profile = await Profile.findOne({ user_id: userId });
    const currentUserId = profile?.user_id || userId;

    let query: any = {
      is_active_donor: true,
      status: "active",
      user_id: { $ne: currentUserId }, // Exclude current user
    };

    if (blood_group) {
      query.blood_group = blood_group;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    let profiles = await Profile.find(query).select(
      "name profile_picture blood_group location addresses user_id"
    );

    // If latitude/longitude provided, filter by distance
    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radius = parseFloat(radius_km as string) || 10;

      profiles = profiles.filter((profile) => {
        if (profile.addresses && profile.addresses.length > 0) {
          const addr = profile.addresses[0];
          if (addr.latitude && addr.longitude) {
            const distance = calculateDistance(
              lat,
              lng,
              addr.latitude,
              addr.longitude
            );
            return distance <= radius;
          }
        }
        return false;
      });
    }

    return res.json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

