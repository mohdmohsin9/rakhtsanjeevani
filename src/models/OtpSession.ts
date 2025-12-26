import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpSession extends Document {
  countryCode: string;
  mobileNumber: string;
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

OtpSessionSchema.index({ countryCode: 1, mobileNumber: 1 });

export const OtpSession = mongoose.model<IOtpSession>('OtpSession', OtpSessionSchema);


