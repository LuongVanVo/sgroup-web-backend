import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import Boards from "./boards.entity";
import Cards from "./cards.entity";

@Entity("lists")
export default class Lists extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => Boards, board => board.lists, { nullable: false, onDelete: "CASCADE" })
    board: Boards;

    @Column({ nullable: false })
    position: number;

    @OneToMany(() => Cards, card => card.list)
    cards: Cards[];
}