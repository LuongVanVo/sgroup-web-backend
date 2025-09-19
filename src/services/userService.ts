import User from "@/models/entities/User";
import dataSource from "@/config/typeorm.config";
import { getAllUserRepo } from "@/models/repositories/userRepository";

class UserService {

    static async getAllUsers() {
        return await getAllUserRepo();
    }
}

export default UserService;