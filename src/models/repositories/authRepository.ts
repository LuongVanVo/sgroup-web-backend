import dataSource from '@/config/typeorm.config';
import User from '@/models/entities/users.entity';

export const findEmailExist = async (email: string) => {
    return await dataSource.getRepository(User).findOneBy({ email });
}

export const createNewUser = async (user: User) => {
    return await dataSource.getRepository(User).save(user);
}