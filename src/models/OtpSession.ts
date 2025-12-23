import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpSession extends Document {
  countryCode: string;
  mobileNumber: string;
  fullPhoneKey: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSessionSchema = new Schema<IOtpSession>(
  {
    countryCode: 
    { 
        type: String,
        required: true 
    },
    mobileNumber: 
    { 
        type: String,
        required: true 
    },  
    fullPhoneKey: 
    { 
        type: String,
        required: true,
        index: true 
    },
    otp: 
    { 
        type: String,
        required: true 
    },
    expiresAt: 
    { 
        type: Date,
        required: true,
        index: true 
    },
    verified: 
    { 
        type: Boolean,
        default: false 
    },
    verifiedAt:   
    { 
        type: Date 
    },
  },
  {
    timestamps: true,
  }
);

export const OtpSession = mongoose.model<IOtpSession>('OtpSession', OtpSessionSchema);


