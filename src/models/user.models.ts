import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  countryCode: string;
  mobileNumber: string;
  fullPhoneKey: string;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    countryCode: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    fullPhoneKey: {
      type: String,
      required: true,
      unique: true,   // 🔐 one user per phone
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false, // ✅ default false (OTP verify ke baad true karo)
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
