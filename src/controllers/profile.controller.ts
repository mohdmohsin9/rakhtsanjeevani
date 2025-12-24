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
      addresses,
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
        addresses,
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
      data: {
        ...profile.toObject(),
        badge: profile.is_active_donor ? "SAVIOUR" : "VOLUNTEER",
        rewards_preview: "Earn Instant Rewards*",
        benefits: [
          "FREE Checkups (OPD/DIAGNOSTICS)",
          "NO-COST Health Insurance",
          "Quick FREE AMBULANCE for Self & Family"
        ]
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * ADD ADDRESS
 */
export const addAddress = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId;
    const { 
      label, 
      flat, 
      area, 
      landmark, 
      city, 
      state, 
      pincode, 
      latitude, 
      longitude, 
      fullAddress 
    } = req.body;

    if (!fullAddress) {
      return res.status(400).json({ error: "fullAddress is required" });
    }

    const profile = await Profile.findOneAndUpdate(
      { user_id: userId },
      { 
        $push: { 
          addresses: { 
            label, flat, area, landmark, city, state, pincode, latitude, longitude, fullAddress 
          } 
        } 
      },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: profile.addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * UPDATE ADDRESS
 */
export const updateAddress = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;
    const { 
      label, 
      flat, 
      area, 
      landmark, 
      city, 
      state, 
      pincode, 
      latitude, 
      longitude, 
      fullAddress 
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user_id: userId, "addresses._id": addressId },
      { 
        $set: { 
          "addresses.$.label": label,
          "addresses.$.flat": flat,
          "addresses.$.area": area,
          "addresses.$.landmark": landmark,
          "addresses.$.city": city,
          "addresses.$.state": state,
          "addresses.$.pincode": pincode,
          "addresses.$.latitude": latitude,
          "addresses.$.longitude": longitude,
          "addresses.$.fullAddress": fullAddress 
        } 
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Address or profile not found" });
    }

    return res.json({ success: true, data: profile.addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE ADDRESS
 */
export const deleteAddress = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    const profile = await Profile.findOneAndUpdate(
      { user_id: userId },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json({ success: true, data: profile.addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
