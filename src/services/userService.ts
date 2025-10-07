import User from "@/models/entities/users.entity";
import dataSource from "@/config/typeorm.config";
import { getAllUserRepo } from "@/models/repositories/userRepository";

class UserService {

    static async getAllUsers() {
        return await getAllUserRepo();
    }
}

export default UserService;