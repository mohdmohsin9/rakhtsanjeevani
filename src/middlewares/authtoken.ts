import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // 🔥 MUST CHECK FORMAT
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token malformed' });
    }

    // 🔥 EXTRACT TOKEN SAFELY
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token malformed' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jwt_secret_key' // 🔥 MUST MATCH verifyOtp
    ) as { userId: string };

    // 🔐 attach userId for next controllers
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
