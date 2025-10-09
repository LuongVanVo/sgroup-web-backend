import { SuccessResponse } from "@/core/success.response";
import AuthService from "@/services/authService";
import { NextFunction, Request, Response } from "express";

class AuthRepository {

    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        const data = await AuthService.verifyEmail(req.body.code)
        return new SuccessResponse({
            message: 'Email verified successfully',
            metadata: data
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        const data = await AuthService.register(req.body)
        return new SuccessResponse({
            message: 'Register successfully',
            metadata: data
        }).send(res)
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const data = await AuthService.login(req.body)

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'strict', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        })

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'strict', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        })
        return new SuccessResponse({
            message: 'Login successfully',
            metadata: data
        }).send(res)
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await AuthService.logout(refreshToken);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return new SuccessResponse({
            message: 'Logout successfully'
        }).send(res)
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: 'No refresh token provided' });
        }
        const data = await AuthService.refreshToken(refreshToken)

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'strict', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        })
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'strict', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        })
        return new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: data
        }).send(res)
    }
}

export default new AuthRepository()