import { SuccessResponse } from "@/core/success.response";
import AuthService from "@/services/authService";
import { NextFunction, Request, Response } from "express";

class AuthRepository {

    register = async (req: Request, res: Response, next: NextFunction) => {
        const data = await AuthService.register(req.body)
        return new SuccessResponse({
            message: 'Register successfully',
            metadata: data
        }).send(res)
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const data = await AuthService.login(req.body)

        res.cookie("accessToken", req.body.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'strict', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        })
        return new SuccessResponse({
            message: 'Login successfully',
            metadata: data
        }).send(res)
    }
}

export default new AuthRepository()