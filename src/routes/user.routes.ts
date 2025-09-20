import UserController from "@/controllers/userController";
import express from "express";
import { asyncHandler } from "@/helpers/asyncHandler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "@/models/schema/userSchema";

const router = express.Router()

export const userRegistry = new OpenAPIRegistry()
userRegistry.register('User', UserSchema)

userRegistry.registerPath({
    method: 'get',
    path: '/api/v1/users',
    tags: ['Users'],
    summary: 'Get all users',
    description: 'Retrieve a list of all users from the database',
    responses: {
        // [statusCodes.OK.toString()]: createSuccessArrayResponse('User', 'Get all users successfully'),
        // [statusCodes.BAD_REQUEST.toString()]: commonErrorResponses[400],
        // [statusCodes.INTERNAL_SERVER_ERROR.toString()]: commonErrorResponses[500]
    }
})

router.get('/', asyncHandler(UserController.getAllUsers))

export default router