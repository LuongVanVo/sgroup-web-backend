import { ForbiddenRequestError } from "@/core/error.response";
import { Request, Response, NextFunction } from "express";

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user

        if (!user) {
            throw new ForbiddenRequestError('Unauthorized')
        }

        if (!allowedRoles.includes(user.role as string)) {
            throw new ForbiddenRequestError(`Role ${user.role} is not allowed`)
        }

        next()
    }
}