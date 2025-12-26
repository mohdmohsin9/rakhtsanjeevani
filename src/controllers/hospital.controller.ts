import { Request, Response } from "express";
import { Hospital } from "../models/hospital.models";

export const getHospitals = async (req: Request, res: Response) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    
    // If no hospitals in DB, return the default list provided by user
    if (hospitals.length === 0) {
      const defaultHospitals = [
        "Bara Hindu Rao Hospital",
        "Deen Dayal Upadhyaya",
        "Sir Ganga Ram Hospital",
        "Babu Jagjivan Ram Memorial Hospital",
        "Bhagwan Mahavir Hospital",
        "Max Super Speciality Hospital",
        "Medanta The Medicity",
        "Apollo Hospitals"
      ].map(name => ({ name }));
      
      return res.status(200).json({
        success: true,
        data: defaultHospitals
      });
    }

    res.status(200).json({
      success: true,
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const addHospital = async (req: Request, res: Response) => {
  try {
    const { name, address, city, latitude, longitude } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Hospital name is required" });
    }

    const newHospital = new Hospital({
      name,
      address,
      city,
      location: latitude && longitude ? {
        type: "Point",
        coordinates: [longitude, latitude]
      } : undefined
    });

    await newHospital.save();
    res.status(201).json({ success: true, data: newHospital });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Quick seed function for the hospitals you mentioned
export const seedHospitals = async (req: Request, res: Response) => {
    try {
        const hospitalNames = [
            "Bara Hindu Rao Hospital",
            "Deen Dayal Upadhyaya",
            "Sir Ganga Ram Hospital",
            "Babu Jagjivan Ram Memorial Hospital",
            "Bhagwan Mahavir Hospital",
            "Max Super Speciality Hospital",
            "Medanta The Medicity",
            "Apollo Hospitals"
        ];

        for (const name of hospitalNames) {
            await Hospital.findOneAndUpdate(
                { name },
                { name },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ success: true, message: "Hospitals seeded successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
}
