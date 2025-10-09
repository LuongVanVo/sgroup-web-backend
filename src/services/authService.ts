import { BadRequestError } from "@/core/error.response"
import User from "@/models/entities/users.entity"
import { createNewUser, findEmailExist } from "@/models/repositories/authRepository"
import { comparePassword, hashPassword } from "@/utils/password"
import dotenv from 'dotenv'
import Token from "@/models/entities/tokens.entity"
import { generateJwt } from "@/utils/jsonwebtoken"
import { findTokenByValue, saveToken } from "@/models/repositories/tokenRepository"
import { randomBytes } from "crypto"
import { getMailTemplateVerifyAccount } from "@/models/repositories/mailRepository"
import { sendActivationEmail } from "./mailService"
import { findUserByVerificationToken, saveUser } from "@/models/repositories/userRepository"
import { getInfoData } from "@/utils/getInfoData"
dotenv.config()

class AuthService {

    static verifyEmail = async (code: string) => {
        const user = await findUserByVerificationToken(code);
        if (!user) {
            throw new BadRequestError('User not found.');
        }
        if (user.verificationToken !== code) {
            throw new BadRequestError('Invalid verification token.');
        }

        if (!user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
            throw new BadRequestError('Verification token has expired.');
        }

        user.isActive = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await saveUser(user)
    }

    static register = async (User: User) => {
        // check email exists
        const emailExist = await findEmailExist(User.email)
        if (emailExist) throw new BadRequestError(`Error: Email already exists!`)
        
        // hash password
        if (!User.password) throw new BadRequestError('Error: Password is required!')
        const hashedPassword = await hashPassword(User.password)
        // create new user 
        // random otp 6 chữ số
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const newUser = await createNewUser({
            ...User,
            password: hashedPassword,
            isActive: false, // chờ kích hoạt qua email
            verificationToken,
            verificationTokenExpiresAt: expiresAt
            
        })
        if (!newUser) throw new BadRequestError('Error: Cannot create new user!')
        
        // Gửi email kích hoạt tài khoản
        const templateEmail = await getMailTemplateVerifyAccount()
        if (!templateEmail) throw new BadRequestError('Error: Cannot get email template!')

        const htmlBody = templateEmail.content.replace('{{code}}', verificationToken)

        await sendActivationEmail(newUser.email, templateEmail.subject, htmlBody)

        return getInfoData(['id', 'email', 'name', 'isActive', 'createdAt', 'updatedAt'], newUser)
    }

    static login = async (User: User) => {
        // found user by email in database
        if (!User.password) 
            throw new BadRequestError('Error: Password is required!')
        const foundUser = await findEmailExist(User.email)
        if (!foundUser) throw new BadRequestError(`Error: Email or password is incorrect!`)
        if (!foundUser.isActive) throw new BadRequestError('Error: Please verify your email to activate your account.')

        // match password
        if (!foundUser.password) 
            throw new BadRequestError('Error: Password is required!')
        const matchPassword = await comparePassword(User.password, foundUser.password)
        if (!matchPassword) 
            throw new BadRequestError(`Error: Email or password is incorrect!`)
        
        // create access token & refresh token
        const accessToken = generateJwt({ userId: foundUser.id, email: foundUser.email });
        const refreshToken = generateJwt({ userId: foundUser.id });

        // save refresh token to database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const tokenEntity = new Token();
        tokenEntity.token = refreshToken;
        tokenEntity.user = foundUser;
        tokenEntity.expiresAt = expiresAt;
        tokenEntity.revoked = false;

        await saveToken(tokenEntity);

        return {
            accessToken,
            refreshToken
        };
    }

    static logout = async (refreshToken: string) => {
        const tokenEntity = await findTokenByValue(refreshToken);
        if (tokenEntity) {
            tokenEntity.revoked = true;
            await saveToken(tokenEntity);
        }
    }

    static refreshToken = async (refreshToken: string) => {
        // Tìm refresh token trong database
        const refreshTokenEntity = await findTokenByValue(refreshToken)
        if (!refreshTokenEntity) {
            throw new BadRequestError('Invalid refresh token')
        }
        if (refreshTokenEntity.revoked) {
            throw new BadRequestError('Refresh token has been revoked')
        }
        if (refreshTokenEntity.expiresAt < new Date()) {
            throw new BadRequestError('Refresh token has expired')
        }
        // Lấy thông tin user
        const user = refreshTokenEntity.user
        if (!user || !user.isActive) {
            throw new BadRequestError('User not found or inactive')
        }

        refreshTokenEntity.revoked = true // Thu hồi refresh token cũ
        await saveToken(refreshTokenEntity)

        // Tạo mới access token & refresh token
        const newAccessToken = generateJwt({ userId: user.id, email: user.email });
        const newRefreshToken = generateJwt({ userId: user.id });

        // Lưu refresh token mới vào database
        const newTokenEntity = new Token()
        newTokenEntity.token = newRefreshToken
        newTokenEntity.user = user
        newTokenEntity.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        newTokenEntity.revoked = false
        await saveToken(newTokenEntity)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }
}

export default AuthService