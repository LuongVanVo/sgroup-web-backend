import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Project from "./projects.entity";
import User from "./users.entity";
import Roles from "./roles.entity";

@Entity("projects_members")
export default class ProjectMembers {
    @PrimaryGeneratedColumn("uuid")
    projectId: string;

    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @ManyToOne(() => Project, project => project.projectMembers, { nullable: false, onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => User, user => user.projectMembers, { nullable: false, onDelete: 'CASCADE', eager: true })
    user: User;

    @ManyToOne(() => Roles, { nullable: false })
    role: Roles;

    @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;
}