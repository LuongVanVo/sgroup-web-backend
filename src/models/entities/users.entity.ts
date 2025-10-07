import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { DateTimeEntity } from "./base/dateTimeEntity";
import Token from "./tokens.entity";
import ProjectMembers from "./projectMembers.entity";
import CardMembers from "./card_members.entity";
import Comments from "./comments.entity";

@Entity("users")
class User extends DateTimeEntity  {
   @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    name!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    avatar_url?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    // one to many with tokens
    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @OneToMany(() => ProjectMembers, pm => pm.user)
    projectMembers: ProjectMembers[];

    @OneToMany(() => CardMembers, cm => cm.user)
    assignedCards: CardMembers[];

    @OneToMany(() => Comments, comment => comment.user)
    comments: Comments[];

    @OneToMany(() => CardMembers, cm => cm.user)
    cardMembers: CardMembers[];
}

export default User