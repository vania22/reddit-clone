import { IsEmail, MinLength } from 'class-validator';
import bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super();

        Object.assign(this, user);
    }

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @MinLength(3)
    @Column({ unique: true })
    username: string;

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Exclude()
    @MinLength(6)
    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toJSON() {
        return classToPlain(this);
    }
}
