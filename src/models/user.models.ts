import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  user_id: string; // Custom user ID like RS234788
  countryCode: string;
  mobileNumber: string;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    user_id: {
      type: String,
      unique: true,
      index: true,
    },
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

    isVerified: {
      type: Boolean,
      default: false, // ✅ default false (OTP verify ke baad true karo)
    },
  },
  { timestamps: true }
);

userSchema.index({ countryCode: 1, mobileNumber: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', userSchema);
