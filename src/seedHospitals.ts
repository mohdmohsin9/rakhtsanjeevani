import 'dotenv/config';
import mongoose from 'mongoose';
import { Hospital } from './models/hospital.models';
import connectDB from './config/db';

const hospitals = [
  { name: "Bara Hindu Rao Hospital", city: "Delhi" },
  { name: "Deen Dayal Upadhyaya", city: "Delhi" },
  { name: "Sir Ganga Ram Hospital", city: "Delhi" },
  { name: "Babu Jagjivan Ram Memorial Hospital", city: "Delhi" },
  { name: "Bhagwan Mahavir Hospital", city: "Delhi" },
  { name: "Max Super Speciality Hospital", city: "Delhi" },
  { name: "Medanta The Medicity", city: "Gurugram" },
  { name: "Apollo Hospitals", city: "Delhi" }
];

const seedHospitals = async () => {
  try {
    await connectDB();
    
    console.log('Seeding hospitals...');
    
    for (const h of hospitals) {
      await Hospital.findOneAndUpdate(
        { name: h.name },
        h,
        { upsert: true, new: true }
      );
    }
    
    console.log('Hospitals seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hospitals:', error);
    process.exit(1);
  }
};

seedHospitals();
