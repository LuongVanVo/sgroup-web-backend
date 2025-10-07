import authController from "@/controllers/authController";
import { asyncHandler } from "@/helpers/asyncHandler";
import authenticateJWT from "@/middlewares/authentication";
import { UserSchema } from "@/models/schema/userSchema";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express from "express";

const router = express.Router()

export const authRegistry = new OpenAPIRegistry()
authRegistry.register('Auth', UserSchema)

authRegistry.registerPath({
    method: 'post',
    path: '/api/v1/auth/register',
    tags: ['Authentication'],
    summary: 'Register a new user',
    description: 'Create a new user account with the provided email and password',
    responses: {}
})
router.post('/register', asyncHandler(authController.register))

authRegistry.registerPath({
    method: 'post',
    path: '/api/v1/auth/login',
    tags: ['Authentication'],
    summary: 'User login',
    description: 'Authenticate user and return access token',
    responses: {}
})
router.post('/login', asyncHandler(authController.login))

export default router
