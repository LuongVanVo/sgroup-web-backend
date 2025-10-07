import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import Cards from "./cards.entity";
import User from "./users.entity";

@Entity("cards_members")
export default class CardMembers extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    cardId: string;

    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @ManyToOne(() => Cards, card => card.members, { nullable: false, onDelete: "CASCADE" })
    card: Cards;

    @ManyToOne(() => User, user => user.assignedCards, { nullable: false, onDelete: "CASCADE", eager: true })
    user: User;

    @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    assignedAt: Date;
}