import RolePermissions from "../entities/rolePermissions.entity";
import dataSource from "@/config/typeorm.config";

class RolePermissionRepository {

    static findRoleByName = async (roleName: string) => {
        return await dataSource.getRepository(RolePermissions).findOne({
            where: {
                role: { name: roleName },
            },
            relations: ['role']
        })
    }
}

export default RolePermissionRepository;