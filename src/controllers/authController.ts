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
            sameSite: 'lax', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
            // maxAge: 1 * 60 * 1000 // 1 phút
        })

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'lax', // Ngăn chặn việc gửi cookie từ các trang web khác
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
        const refreshToken = req.cookies.refreshToken
        console.log('Refresh token', refreshToken);
        if (!refreshToken) {
            return res.status(400).json({ message: 'No refresh token provided' });
        }
        const data = await AuthService.refreshToken(refreshToken)

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'lax', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 1 * 60 * 1000 // 1 phút
        })
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: 'lax', // Ngăn chặn việc gửi cookie từ các trang web khác
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        })
        return new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: data
        }).send(res)
    }

    // Forgot password
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const data = await AuthService.forgotPassword(email);
        return new SuccessResponse({
            message: 'Send forgot password email successfully',
            metadata: data
        }).send(res)
    }

    // Verify OTP
    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        const { email, code } = req.body;
        const data = await AuthService.verifyOTP(email, code);
        return new SuccessResponse({
            message: 'Verify OTP successfully',
            metadata: data
        }).send(res);
    }

    // Reset password
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email, newPassword, confirmPassword, token } = req.body;
        const data = await AuthService.resetPassword(email, newPassword, confirmPassword, token);
        return new SuccessResponse({
            message: 'Reset password successfully',
            metadata: data
        }).send(res)
    }
}

export default new AuthRepository()