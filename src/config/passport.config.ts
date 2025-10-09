import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@/models/entities/users.entity';
import { findUserById, createNewUser, findEmailExist } from '@/models/repositories/authRepository';
import dataSource from '@/config/typeorm.config';
import dotenv from 'dotenv';
import { saveUser } from '@/models/repositories/userRepository';
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
        },
        async function (token, tokenSecret, profile, done) {
            try {
                console.log('>>> profile: ', profile)
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error("No email found"), undefined);

                // Tìm user theo email thay vì profile.id
                let user = await findEmailExist(email);
                
                if (user) {
                    // Nếu user đã tồn tại, liên kết googleId nếu chưa có
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        user = await saveUser(user);
                    }
                    // Cập nhật thông tin mới nhất
                    user.name = profile.name?.givenName + ' ' + profile.name?.familyName;
                    user = await saveUser(user);
                } else {
                    // Tạo user mới
                    user = await createNewUser({
                        googleId: profile.id,
                        email: email,
                        name: profile.name?.givenName + ' ' + profile.name?.familyName,
                        isActive: true,
                    } as User);
                }
                
                return done(null, user);

            } catch (err) {
                console.error('Error in GoogleStrategy:', err);
                return done(err as Error, undefined);
            }
        }
    )
)

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await dataSource.getRepository(User).findOneBy({ id });
        done(null, user);
    } catch (err) {
        done(err as Error, undefined);
    }
});

export default passport;