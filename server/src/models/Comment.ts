import { makeid } from './../util/helpers';
import {
    Column,
    Entity as TOEntity,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    Index,
    OneToMany,
} from 'typeorm';
import Entity from './Entity';
import Post from './Post';
import User from './User';
import Vote from './Vote';

@TOEntity('comments')
export default class Comment extends Entity {
    constructor(comment: Partial<Comment>) {
        super();
        Object.assign(this, comment);
    }

    @Index()
    @Column({ unique: true })
    identifier: string;

    @Column()
    body: string;

    @Column()
    username: string;

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    post: Post;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @OneToMany(() => Vote, (vote) => vote.comment)
    votes: Vote[];

    protected userVote: number;
    setUserVote(user: User) {
        const index = this.votes?.findIndex(
            (v) => v.username === user.username,
        );
        this.userVote = index !== -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeId() {
        this.identifier = makeid(8);
    }
}
