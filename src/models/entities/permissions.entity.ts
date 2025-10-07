import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Roles from "./roles.entity";

@Entity("permissions")
export default class Permissions {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => Roles, role => role.permissions)
    roles: Roles[];
}