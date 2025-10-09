import dataSource from '@/config/typeorm.config';
import User from '@/models/entities/users.entity';

export const getAllUserRepo = async () => {
    // query all users from the database with TypeORM
    return await dataSource.getRepository(User).find()
}

export const findUserByVerificationToken = async (token: string) => {
    return await dataSource.getRepository(User).findOne({ where: { verificationToken: token } });
}

export const saveUser = async (user: User) => {
    return await dataSource.getRepository(User).save(user);
}