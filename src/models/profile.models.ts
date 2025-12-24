import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
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

    },

    addresses: [
      {
        label: {
          type: String,
          enum: ["Home", "Work", "Other"],
          default: "Home",
        },
        flat: { type: String, default: "" }, // Flat / House / Floor / Building
        area: { type: String, default: "" }, // Street name / Area
        landmark: { type: String, default: "" }, // Nearby landmark
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        latitude: { type: Number },
        longitude: { type: Number },
        fullAddress: { type: String, required: true }, // Combined address for display
      },
    ],

    location: {
      type: String, // General location string (e.g. City, Area)
      default: "",
    },

    language: {
      type: String,

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
