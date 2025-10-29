import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "@/utils/jsonwebtoken";
import { RoleName } from "./rbac";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        [key: string]: any;
    };
    projectAuth?: {
        projectId: string;
        role: RoleName;
    };
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để sử dụng tính năng này'
            });
            return;
        }

        const decoded = verifyJwt(accessToken);
        if (!decoded || typeof decoded !== 'object') {
            res.status(401).json({ 
                success: false,
                message: 'Token không hợp lệ'
            });
            return; 
        }

        // ✅ Type assertion để add user property
        (req as AuthenticatedRequest).user = decoded as { 
            userId: string; 
            email: string; 
            [key: string]: any; 
        };
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        });
        return;
    }
};

export default authenticateToken;
export { AuthenticatedRequest };