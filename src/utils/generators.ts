import { User } from "../models/user.models";
import { BloodRequest } from "../models/bloodRequest.models";

// Generate custom User ID (RS234788 format)
export const generateUserId = async (): Promise<string> => {
  let userId: string;
  let exists = true;

  while (exists) {
    // RS + 6 random digits
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    userId = `RS${randomNum}`;
    const user = await User.findOne({ user_id: userId });
    exists = !!user;
  }

  return userId!;
};

// Generate Order ID for blood requests
export const generateOrderId = async (): Promise<string> => {
  let orderId: string;
  let exists = true;

  while (exists) {
    // 4-6 digit order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    orderId = String(randomNum);
    const request = await BloodRequest.findOne({ order_id: orderId });
    exists = !!request;
  }

  return orderId!;
};

