import passport from "@/config/passport.config";
import authController from "@/controllers/authController";
import { asyncHandler } from "@/helpers/asyncHandler";
import Token from "@/models/entities/tokens.entity";
import { saveToken } from "@/models/repositories/tokenRepository";
import { UserSchema } from "@/models/schema/userSchema";
import { generateJwt } from "@/utils/jsonwebtoken";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express from "express";


const router = express.Router()

export const authRegistry = new OpenAPIRegistry()
authRegistry.register('Auth', UserSchema)

authRegistry.registerPath({
    method: 'post',
    path: '/api/v1/auth/verify-email',
    tags: ['Authentication'],
    summary: 'Verify email address',
    description: 'Verify user email with the provided verification code',
    responses: {}
})
router.post('/verify-email', asyncHandler(authController.verifyEmail))

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

// Google OAuth2
authRegistry.registerPath({
    method: 'get',
    path: '/google',
    tags: ['Authentication'],
    summary: 'Google OAuth2 login',
    description: 'Authenticate user using Google OAuth2',
    responses: {}
})
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

/* Callback route for OAuth2 authentication */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async function (req, res) {
    try {
      console.log('>>> User authenticated: ', req.user);

      const user = req.user as any;
      const userPayload = {
        userId: user.id,
        email: user.email
      };

      // Tạo cả access token và refresh token
      const accessToken = generateJwt(userPayload);
      const refreshToken = generateJwt({ userId: user.id });

      // Lưu refresh token vào database
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const tokenEntity = new Token();
      tokenEntity.token = refreshToken;
      tokenEntity.user = user;
      tokenEntity.expiresAt = expiresAt;
      tokenEntity.revoked = false;
      await saveToken(tokenEntity);

      // Lưu access token vào cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
      });

      // Lưu refresh token vào cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      req.session.save(() => {
        res.redirect(`${process.env.FRONTEND_URL}/?&success=true`);
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
    }
  }
);

authRegistry.registerPath({
    method: 'post',
    path: '/api/v1/auth/logout',
    tags: ['Authentication'],
    summary: 'User logout',
    description: 'Logout user and invalidate refresh token',
    responses: {}
})
router.post('/logout', asyncHandler(authController.logout))

authRegistry.registerPath({
    method: 'post',
    path: '/api/v1/auth/refresh-token',
    tags: ['Authentication'],
    summary: 'Refresh access token',
    description: 'Refresh access token using refresh token',
    responses: {}
})
router.post('/refresh-token', asyncHandler(authController.refreshToken))

export default router
