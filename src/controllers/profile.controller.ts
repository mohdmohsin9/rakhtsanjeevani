import { Request, Response } from "express";
import { Profile } from "../models/profile.models";

/**
 * CREATE / UPDATE PROFILE
 * 🔐 user_id JWT token se aayega (req.userId)
 */
export const upsertProfile = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId; // ✅ TOKEN SE MILA

    const {
      name,
      email,
      phone,
      address,
      language,
      profile_picture,
      // New fields from payload
      blood_group,
      dob,
      age,
      is_active_donor,
      last_donation_date,
      gender,
      weight_kg,
      location,
      is_aadhar_kyc_verified
    } = req.body;

    if (!userId || !phone || !language) {
      return res.status(400).json({
        error: "phone and language are required",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user_id: userId },
      {
        user_id: userId,
        name,
        email,
        phone,
        address,
        language,
        profile_picture: profile_picture || "",
        
        // Saving new fields
        blood_group,
        dob,
        age,
        is_active_donor,
        last_donation_date,
        gender,
        weight_kg,
        location,
        is_aadhar_kyc_verified: is_aadhar_kyc_verified || false,

        status: "active",
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/** 

  GET MY PROFILE
  user_id JWT token se aayega
 */
export const getProfile = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;

    const profile = await Profile.findOne({ user_id: userId });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
