import { BadRequestError } from "@/core/error.response"
import User from "@/models/entities/users.entity"
import { createNewUser, findEmailExist } from "@/models/repositories/authRepository"
import { comparePassword, hashPassword } from "@/utils/password"
import dotenv from 'dotenv'
import Token from "@/models/entities/tokens.entity"
import { generateJwt } from "@/utils/jsonwebtoken"
import { saveToken } from "@/models/repositories/tokenRepository"
dotenv.config()

class AuthService {
    static register = async (User: User) => {
        // check email exists
        const emailExist = await findEmailExist(User.email)
        if (emailExist) throw new BadRequestError(`Error: Email already exists!`)
        
        // hash password
        const hashedPassword = await hashPassword(User.password)
        // create new user 
        const newUser = await createNewUser({
            ...User,
            password: hashedPassword
        })
        if (!newUser) throw new BadRequestError('Error: Cannot create new user!')

        const { password: _, ...userWithoutPassword } = newUser
        return userWithoutPassword
    }

    static login = async (User: User) => {
        // found user by email in database
        const foundUser = await findEmailExist(User.email)
        if (!foundUser) throw new BadRequestError(`Error: Email or password is incorrect!`)
        
        // match password
        const matchPassword = await comparePassword(User.password, foundUser.password)
        if (!matchPassword) throw new BadRequestError(`Error: Email or password is incorrect!`)
        
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
        
    }
}

export default AuthService