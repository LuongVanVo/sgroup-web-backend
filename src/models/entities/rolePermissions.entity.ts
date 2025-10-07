import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Roles from "./roles.entity";
import Permissions from "./permissions.entity";

@Entity("role_permissions")
export default class RolePermissions {
    @PrimaryGeneratedColumn("uuid")
    roleId: string;

    @PrimaryGeneratedColumn("uuid")
    permissionId: string;

    @ManyToOne(() => Roles, role => role.id, { nullable: false })
    role: Roles;

    @ManyToOne(() => Permissions, permission => permission.id, { nullable: false })
    permission: Permissions;
}