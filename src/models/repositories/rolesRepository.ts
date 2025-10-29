import Roles from "../entities/roles.entity";
import dataSource from "@/config/typeorm.config";

class RolesRepository {
    static findRoleByName = async (roleName: string) => {
        return await dataSource.getRepository(Roles).findOne({
            where: { name: roleName }
        });
    }

    static findRoleById = async (roleId: string) => {
        return await dataSource.getRepository(Roles).findOne({
            where: { id: roleId }
        });
    }

    static getAllRoles = async () => {
        return await dataSource.getRepository(Roles).find();
    }

    static findRoleByNameWithPermissions = async (currentRole: string) => {
        return await dataSource.getRepository(Roles).findOne({
            where: { name: currentRole },
            relations: ["permissions"],
        });
    }
}

export default RolesRepository;