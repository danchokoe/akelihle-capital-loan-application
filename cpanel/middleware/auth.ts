import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: 'user' | 'admin';
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.type === 'admin') {
      req.user = {
        id: decoded.id,
        email: decoded.username,
        type: 'admin'
      };
    } else {
      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        type: 'user'
      };
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.type !== 'user') {
    return res.status(403).json({ error: 'User access required' });
  }
  next();
};