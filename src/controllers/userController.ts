import UserService from "@/services/userService";
import { SuccessResponse } from "@/core/success.response"
import { NextFunction, Request, Response } from "express";

class UserController {

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        return new SuccessResponse({
            message: 'Get all users successfully',
            metadata: await UserService.getAllUsers()
        }).send(res)
    }
}

export default new UserController()