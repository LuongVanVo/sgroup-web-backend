import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import Cards from "./cards.entity";
import User from "./users.entity";

@Entity("comments")
export default class Comments extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text", nullable: false })
    content: string;

    @ManyToOne(() => Cards, card => card.comments, { nullable: false, onDelete: "CASCADE" })
    card: Cards;

    @ManyToOne(() => User, { nullable: false, eager: true })
    user: User;
}