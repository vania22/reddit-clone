import {
    Entity as TOEntity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm';
import { makeid, slugify } from './../util/helpers';
import Comment from './Comment';
import Entity from './Entity';
import Sub from './Sub';
import User from './User';

@TOEntity('posts')
export default class Post extends Entity {
    constructor(post: Partial<Post>) {
        super();
        Object.assign(this, post);
    }

    @Index()
    @Column({ unique: true })
    identifier: string; // 7 Character Id

    @Column()
    title: string;

    @Index()
    @Column()
    slug: string;

    @Column({ nullable: true, type: 'text' })
    body: string;

    @Column()
    subName: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Sub;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeid(7);
        this.slug = slugify(this.title);
    }
}