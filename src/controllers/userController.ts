import UserService from "@/services/userService";
import { SuccessResponse } from "@/core/success.response"
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticationCookie";

class UserController {

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        return new SuccessResponse({
            message: 'Get all users successfully',
            metadata: await UserService.getAllUsers()
        }).send(res)
    }

    getUserById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.userId as string;
        const data = await UserService.getUserById(userId);
        return new SuccessResponse({
            message: 'Get user by ID successfully',
            metadata: data
        }).send(res);
    }
}

export default new UserController()