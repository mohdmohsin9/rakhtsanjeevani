import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    location: {
      type: String, // General location string (e.g. City, Area)
      default: "",
    },

    language: {
      type: String,
      required: true,
    },

    profile_picture: {
      type: String,
      default: "",
    },

    // New Fields
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    dob: {
      type: Date,
    },

    age: {
      type: Number,
    },

    is_active_donor: {
      type: Boolean,
      default: false,
    },

    last_donation_date: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Transgender"],
    },

    weight_kg: {
      type: Number,
    },

    is_aadhar_kyc_verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
