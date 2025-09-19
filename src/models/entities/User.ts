import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ unique: true })
    email!: string

    @Column({ nullable: true })
    name!: string

    @CreateDateColumn()
    createdAt!: Date
}

export default User