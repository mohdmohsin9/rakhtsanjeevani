import { Request, Response } from "express";
import { BloodRequest } from "../models/bloodRequest.models";
import { Profile } from "../models/profile.models"; 

// Create a new blood request
export const createBloodRequest = async (req: Request, res: Response) => {
  try {
    // Assuming user_id is coming from auth middleware via req.body or req.user
    // For now taking from body for simplicity, but ideally from req.user
    const { requester_id, patient_name, blood_group, units, hospital_name, location, date_needed, contact_number, is_emergency, additional_note } = req.body;

    if (!requester_id || !patient_name || !blood_group || !units || !hospital_name || !location || !date_needed || !contact_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new BloodRequest({
      requester_id, 
      patient_name,
      blood_group,
      units,
      hospital_name,
      location,
      date_needed,
      contact_number,
      is_emergency,
      additional_note
    });

    await newRequest.save();

    res.status(201).json({
      message: "Blood request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all blood requests (Feed)
// Filters can be added (e.g., by location, blood group)
export const getAllBloodRequests = async (req: Request, res: Response) => {
  try {
    const { blood_group, location } = req.query;
    let query: any = { status: "pending" }; // Only show pending requests by default for potential donors

    if (blood_group) {
      query.blood_group = blood_group;
    }
    
    // Simple substring match for location/city
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const requests = await BloodRequest.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Blood requests fetched successfully",
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    res.status(500).json({ message: "Server error", error });
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
export const acceptBloodRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { donor_id } = req.body; // In real app, get from auth token

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is no longer pending" });
    }

    request.status = "accepted";
    request.accepted_by = donor_id;
    await request.save();

    // Here you might trigger a notification to the requester

    res.status(200).json({
      message: "Request accepted successfully. You are a saviour!",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get requests made by the logged-in user
export const getMyRequests = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params; // Or from query/auth
        const requests = await BloodRequest.find({ requester_id: user_id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "User requests fetched",
            data: requests
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
