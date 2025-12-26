import { Request, Response } from "express";
import { BloodRequest } from "../models/bloodRequest.models";
import { Profile } from "../models/profile.models";
import { Notification } from "../models/notification.models";
import { generateOrderId } from "../utils/generators"; 

// Create a new blood request
export const createBloodRequest = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId; // From JWT token
    const {
      patient_name,
      blood_group,
      units,
      hospital_name,
      location,
      latitude,
      longitude,
      date_needed,
      contact_number,
      is_emergency,
      additional_note,
    } = req.body;

    if (
      !patient_name ||
      !blood_group ||
      !units ||
      !hospital_name ||
      !location ||
      !latitude ||
      !longitude ||
      !date_needed ||
      !contact_number
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields including precise location are required" });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from token",
      });
    }

    // Get user's profile to get user_id format
    const profile = await Profile.findOne({ user_id: userId });
    const requesterId = profile?.user_id || userId;

    const orderId = await generateOrderId();

    const newRequest = new BloodRequest({
      order_id: orderId,
      requester_id: requesterId,
      patient_name,
      blood_group,
      units,
      hospital_name,
      location,
      latitude,
      longitude,
      date_needed,
      contact_number,
      is_emergency: is_emergency || false,
      additional_note: additional_note || "",
      status: "pending",
    });

    await newRequest.save();

    // Create notification for requester
    await Notification.create({
      user_id: requesterId,
      type: "Request Created",
      order_id: orderId,
      title: "Request Created",
      message: `Request Created Order ID-${orderId} and we will send notifications to the donor.`,
      request_id: newRequest._id,
    });

    // Find nearby donors with matching blood group and notify them
    const matchingDonors = await Profile.find({
      blood_group: blood_group,
      is_active_donor: true,
      status: "active",
    }).limit(10); // Limit to avoid spam

    for (const donor of matchingDonors) {
      await Notification.create({
        user_id: donor.user_id,
        type: "New Donor",
        order_id: orderId,
        title: "New Donor",
        message: `A new donor found near to your location Blood Group: ${blood_group} contact to find more`,
        blood_group: blood_group,
        request_id: newRequest._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get all blood requests (Feed)
// Filters: Your Blood Group vs Other Blood Group
export const getAllBloodRequests = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;
    const { filter, location } = req.query; // filter: "your_blood_group" or "other"

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from token",
      });
    }

    // Get user's profile to know their blood group
    const profile = await Profile.findOne({ user_id: userId });
    const userBloodGroup = profile?.blood_group;

    let query: any = { status: "pending" };

    // Filter by blood group based on filter type
    if (filter === "your_blood_group" && userBloodGroup) {
      query.blood_group = userBloodGroup;
    } else if (filter === "other" && userBloodGroup) {
      query.blood_group = { $ne: userBloodGroup };
    }

    // Simple substring match for location/city
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const requests = await BloodRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // Populate requester profile data manually
    const requestsWithProfile = await Promise.all(
      requests.map(async (req) => {
        const requesterProfile = await Profile.findOne({
          user_id: req.requester_id,
        }).select("name profile_picture");
        return {
          ...req.toObject(),
          requester_profile: requesterProfile || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Blood requests fetched successfully",
      count: requestsWithProfile.length,
      data: requestsWithProfile,
    });
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get specific request by ID
export const getBloodRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Accept a blood request
export const acceptBloodRequest = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From JWT token

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from token",
      });
    }

    const profile = await Profile.findOne({ user_id: userId });
    const donorId = profile?.user_id || userId;

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request is no longer pending",
      });
    }

    request.status = "accepted";
    request.accepted_by = donorId;
    await request.save();

    // Notify requester that request was accepted
    await Notification.create({
      user_id: request.requester_id,
      type: "Request Accepted",
      order_id: request.order_id || String(request._id),
      title: "Request Accepted",
      message: `Your blood request Order ID-${request.order_id || request._id} has been accepted by a donor.`,
      request_id: request._id,
      donor_id: donorId,
    });

    res.status(200).json({
      success: true,
      message: "Request accepted successfully. You are a saviour!",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get requests made by the logged-in user
export const getMyRequests = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from token",
      });
    }

    const profile = await Profile.findOne({ user_id: userId });
    const requesterId = profile?.user_id || userId;

    const requests = await BloodRequest.find({ requester_id: requesterId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User requests fetched",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
