import dataSource from '@/config/typeorm.config';
import User from '@/models/entities/users.entity';

class UserRepository {
    static getAllUserRepo = async () => {
    // query all users from the database with TypeORM
        return await dataSource.getRepository(User).find()
}

    static findUserByVerificationToken = async (token: string) => {
        return await dataSource.getRepository(User).findOne({ where: { verificationToken: token } });
}

    static saveUser = async (user: User) => {
        return await dataSource.getRepository(User).save(user);
}

    static findUserById = async (id: string) => {
        return await dataSource.getRepository(User).findOne({ where: { id: id } });
    }
}

export default UserRepository;