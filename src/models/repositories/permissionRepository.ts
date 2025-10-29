import Permissions from "../entities/permissions.entity";
import RolePermissions from "../entities/rolePermissions.entity";
import dataSource from "@/config/typeorm.config";

class PermissionRepository {
    static async getPermissionByRole(roleId: string) {
        const rolePermission = await dataSource.getRepository(RolePermissions).find({
            where: { roleId },
            relations: ["permission"],
        });
        return rolePermission.map(rp => rp.permission);
    }
}

export default PermissionRepository;