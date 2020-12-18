import { makeid } from './../util/helpers';
import {
    Column,
    Entity as TOEntity,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    Index,
} from 'typeorm';
import Entity from './Entity';
import Post from './Post';
import User from './User';

@TOEntity('comments')
export default class Comment extends Entity {
    constructor(comment: Partial<Comment>) {
        super();
        Object.assign(this, comment);
    }

    @Index()
    @Column({ unique: true })
    indentifier: string;

    @Column()
    body: string;

    @Column()
    username: string;

    @ManyToOne(() => Post, (post) => post.comments, {nullable: false})
    post: Post;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @BeforeInsert()
    makeId() {
        this.indentifier = makeid(8);
    }
}
