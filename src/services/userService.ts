import User from "@/models/entities/users.entity";
import dataSource from "@/config/typeorm.config";
import UserRepository from "@/models/repositories/userRepository";
import { BadRequestError } from "@/core/error.response";
import { getInfoData } from "@/utils/getInfoData";
class UserService {

    static async getAllUsers() {
        return await UserRepository.getAllUserRepo();
    }

    static async getUserById(id: string) {
        if (!id) {
            throw new BadRequestError('User ID is required');
        }

        const user = await UserRepository.getUserByIdRepo(id);
        if (!user) {
            throw new BadRequestError('User not found or inactive');
        }
        return getInfoData(["id", "name", "email", "avatar_url", "phone", "address", "createdAt", "updatedAt"], user);
    }
}

export default UserService;