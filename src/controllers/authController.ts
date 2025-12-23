import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';    // ✅ ADD (1 line)
import { OtpSession } from '../models/OtpSession';
import { User } from '../models/user.models';   // ✅ ADD
  
const generateOtp = (): string => {
  const min = 10000;
  const max = 99999;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { countryCode, mobileNumber } = req.body || {};

    if (!countryCode || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Country code and mobile number are required.',
      });
    }

    const cleanedMobile = String(mobileNumber).replace(/\D/g, '');
    if (cleanedMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number.',
      });
    }

    const fullPhoneKey = `${countryCode}${cleanedMobile}`;
    const otp = generateOtp();
    const ttlMs = 5 * 60 * 1000;
    const expiresAt = new Date(Date.now() + ttlMs);

    await OtpSession.deleteMany({ fullPhoneKey });

    await OtpSession.create({
      countryCode,
      mobileNumber: cleanedMobile,
      fullPhoneKey,
      otp,
      expiresAt,
      verified: false,
    });

    console.log(`OTP for ${fullPhoneKey}: ${otp}`);

    return res.json({
      success: true,
      message: 'OTP sent successfully.',
      otp, // testing ke liye
    });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { countryCode, mobileNumber, otp } = req.body || {};

    if (!countryCode || !mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Country code, mobile number and OTP are required.',
      });
    }


    const cleanedMobile = String(mobileNumber).replace(/\D/g, '');
    const fullPhoneKey = `${countryCode}${cleanedMobile}`;

    const session = await OtpSession.findOne({ fullPhoneKey })
      .sort({ createdAt: -1 })
      .exec();

    if (!session) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request again.',
      });
    }

    if (session.expiresAt.getTime() < Date.now() && !session.verified) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request again.',
      });
    }

    if (String(otp) !== session.otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP.',
      });
    }

    session.verified = true;
    session.verifiedAt = new Date();
    await session.save();

    let user = await User.findOne({ fullPhoneKey });

    if (!user) {
      user = await User.create({
        countryCode,
        mobileNumber: cleanedMobile,
        fullPhoneKey,
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'jwt_secret_key',
      { expiresIn: '7d' }
    );
  
    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      token,
      user_id: user._id,
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const getOtpSessionStatus = async (req: Request, res: Response) => {
  try {
    const { countryCode, mobileNumber } = req.query;

    if (!countryCode || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Country code and mobile number are required.',
      });
    }

    const cleanedMobile = String(mobileNumber).replace(/\D/g, '');
    const fullPhoneKey = `${countryCode}${cleanedMobile}`;

    const session = await OtpSession.findOne({ fullPhoneKey })
      .sort({ createdAt: -1 })
      .exec();

    if (!session) {
      return res.json({ success: true, status: 'none' });
    }

    if (session.expiresAt.getTime() < Date.now() && !session.verified) {
      return res.json({ success: true, status: 'expired' });
    }

    if (session.verified) {
      return res.json({
        success: true,
        status: 'verified',
        verifiedAt: session.verifiedAt,
      });
    }

    return res.json({
      success: true,
      status: 'pending',
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Error in getOtpSessionStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
