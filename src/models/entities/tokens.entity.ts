import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./users.entity";

@Entity("tokens")
export default class Token {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    token: string;

    // expires
    @Column({ type: 'timestamptz', nullable: false })
    expiresAt: Date;

    // revoked boolean
    @Column({ default: false })
    revoked: boolean;

    @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // one to many with user
    @ManyToOne(() => User, user => user.tokens, { eager: true })
    user: User;
}