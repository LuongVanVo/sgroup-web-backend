import User from "@/models/entities/users.entity";
import dataSource from "@/config/typeorm.config";
import UserRepository from "@/models/repositories/userRepository";
class UserService {

    static async getAllUsers() {
        return await UserRepository.getAllUserRepo();
    }
}

export default UserService;