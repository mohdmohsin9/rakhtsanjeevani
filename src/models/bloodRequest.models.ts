import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requester_id: {
      type: String, // Changed from ObjectId to String to support custom IDs like 'RS234789'
      required: true,
    },
    patient_name: {
      type: String,
      required: true,
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
    },
    hospital_name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date_needed: {
      type: Date,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "fulfilled", "cancelled"],
      default: "pending",
    },
    accepted_by: {
      type: String, // The donor's user_id
      default: null,
    },
    is_emergency: {
      type: Boolean,
      default: false,
    },
    additional_note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
