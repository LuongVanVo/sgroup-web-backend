import { ForbiddenRequestError } from "@/core/error.response";
import PermissionRepository from "@/models/repositories/permissionRepository";
import { Request, Response, NextFunction } from "express";

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            throw new ForbiddenRequestError('Unauthorized');
        }

        const permissions = await PermissionRepository.getPermissionByRole(user.roleId);

        const hasPermission = permissions.some(permission => permission.name === requiredPermission);

        if (!hasPermission) {
            throw new ForbiddenRequestError(`Permission ${requiredPermission} denied`);
        }
        next();
    }
}