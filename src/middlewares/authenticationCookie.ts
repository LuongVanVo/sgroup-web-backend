import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '@/utils/jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    [key: string]: any;
  };
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy access token từ cookie
    const accessToken = req.cookies?.accessToken;
    console.log('🚀 ~ Access token from cookie:', accessToken ? 'Found' : 'Not found');

    if (!accessToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required. Please login.' 
      });
    }

    try {
      // Verify access token
      const decoded = verifyJwt(accessToken);
      
      if (!decoded || typeof decoded !== 'object') {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid access token' 
        });
      }

      // Gán user info vào request để sử dụng trong controller
      req.user = decoded as { userId: string; email: string; [key: string]: any };
      
      next();

    } catch (tokenError: any) {
      console.error('Token verification failed:', tokenError.message);
      
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Access token expired. Please refresh token or login again.' 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid access token' 
      });
    }

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error' 
    });
  }
};

export default authenticateToken;
export { AuthenticatedRequest };