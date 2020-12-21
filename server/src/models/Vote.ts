import { Exclude } from 'class-transformer';
import {
    Entity as TOEntity,
    Column,
    Index,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import Comment from './Comment';

import Entity from './Entity';
import Post from './Post';
import User from './User';

@TOEntity('votes')
export default class Vote extends Entity {
    constructor(vote: Partial<Vote>) {
        super();
        Object.assign(this, vote);
    }

    @Column()
    value: number;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @ManyToOne(() => Post)
    post: Post;

    @ManyToOne(() => Comment)
    comment: Comment;
}
