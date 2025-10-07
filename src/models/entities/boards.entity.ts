import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import Project from "./projects.entity";
import Lists from "./lists.entity";

@Entity("boards")
export default class Boards extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => Project, project => project.boards, { nullable: false, onDelete: "CASCADE" })
    project: Project;

    @Column({ nullable: true })
    background?: string;

    @Column({ nullable: false })
    position: number;

    @OneToMany(() => Lists, list => list.board)
    lists: Lists[];
}