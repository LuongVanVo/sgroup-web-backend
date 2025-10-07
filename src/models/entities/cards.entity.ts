import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import  Lists  from "./lists.entity";
import User from "./users.entity";
import  CardMembers  from "./card_members.entity";
import  Comments  from "./comments.entity";

@Entity("cards")
export default class Cards extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => Lists, list => list.cards, { nullable: false, onDelete: "CASCADE" })
    list: Lists;

    @ManyToOne(() => User, { nullable: true, eager: true })
    createdBy: User;

    // due date
    @Column({ type: "timestamptz", nullable: true })
    dueDate?: Date;

    @Column({ nullable: false })
    position: number;

    // status enum ('todo', 'in_progress', 'done')
    @Column({ type: "enum", enum: ['todo', 'in_progress', 'done'], default: 'todo' })
    status: 'todo' | 'in_progress' | 'done';

    @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
    priority: string;

    @OneToMany(() => CardMembers, cm => cm.card)
    members: CardMembers[];

    @OneToMany(() => Comments, comment => comment.card)
    comments: Comments[];
}