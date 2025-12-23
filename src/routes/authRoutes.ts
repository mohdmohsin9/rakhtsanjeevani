import { Router } from 'express';
import { sendOtp, verifyOtp, getOtpSessionStatus, } from '../controllers/authController';

const router = Router();

router.post('/send-otp', sendOtp );

router.post('/verify-otp', verifyOtp);

router.get('/otp-session', getOtpSessionStatus);

export default router;


