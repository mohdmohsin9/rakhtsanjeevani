import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Request Created", "New Donor", "Request Accepted", "Request Fulfilled"],
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
    },
    donor_id: {
      type: String,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);

