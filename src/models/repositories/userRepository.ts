import dataSource from '@/config/typeorm.config';
import User from '@/models/entities/User';

export const getAllUserRepo = async () => {
    // query all users from the database with TypeORM
    return await dataSource.getRepository(User).find()
}