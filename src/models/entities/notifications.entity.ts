import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import User from "./users.entity";

@Entity("notifications")
export default class Notifications extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'enum', enum: ['info', 'warning', 'error'], default: 'info' })
    type: string;

    @Column({ type: "text", nullable: false })
    message: string;

    @Column({ default: false })
    isRead: boolean;

    @ManyToOne(() => User, { nullable: false, eager: true })
    user: User;
}