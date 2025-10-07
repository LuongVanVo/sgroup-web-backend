import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Permissions from "./permissions.entity";

@Entity("roles")
export default class Roles {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: ['global', 'project'], default: 'project' })
    scope: 'global' | 'project';

    @ManyToMany(() => Permissions, permission => permission.roles)
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "roleId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permissionId", referencedColumnName: "id" }
    })
    permissions: Permissions[];
}