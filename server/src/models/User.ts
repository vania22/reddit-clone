import { IsEmail, MinLength } from 'class-validator';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
    Entity as TOEntity,
    Column,
    Index,
    BeforeInsert,
    OneToMany,
} from 'typeorm';

import Entity from './Entity';
import Post from './Post';

@TOEntity('users')
export default class User extends Entity {
    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

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

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
