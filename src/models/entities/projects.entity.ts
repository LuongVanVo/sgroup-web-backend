import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import User from "./users.entity";
import ProjectMembers from "./projectMembers.entity";
import Boards from "./boards.entity";

@Entity("projects")
export default class Project extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => User, { nullable: false, eager: true })
    owner: User;

    @OneToMany(() => ProjectMembers, pm => pm.project)
    projectMembers: ProjectMembers[];

    @OneToMany(() => Boards, board => board.project)
    boards: Boards[];
}