import { Request, Response, Router } from 'express';
import auth from '../middlewares/auth';
import user from '../middlewares/user';
import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';
import Vote from '../models/Vote';

const vote = async (req: Request, res: Response) => {
    let { postId = '', slug = '', commentId = '', value } = req.body;
    const user: User = res.locals.user;
    value = parseInt(value);

    // Validate vote value
    if (![-1, 0, 1].includes(value)) {
        return res.status(400).json({ message: 'Incorrect vote value' });
    }

    try {
        let post: Post = await Post.findOneOrFail({ identifier: postId });
        let vote: Vote | undefined;
        let comment: Comment | undefined;

        if (commentId) {
            comment = await Comment.findOneOrFail({ identifier: commentId });
            vote = await Vote.findOne({ user, comment });
        } else {
            vote = await Vote.findOne({ user, post });
            console.log(vote);
        }

        if (!vote && value === 0) {
            return res.status(400).json({ message: 'Vote was not found' });
        } else if (!vote) {
            vote = new Vote({ user, value });

            if (comment) vote.comment = comment;
            else vote.post = post;

            await vote.save();
        } else if (value === 0) {
            await vote.remove();
        } else if (vote.value !== value) {
            vote.value = value;
            await vote.save();
        }

        post = await Post.findOne(
            { identifier: postId, slug },
            { relations: ['comments', 'sub', 'votes', 'comments.votes'] },
        );

        post.setUserVote(user);
        post.comments.forEach((c) => c.setUserVote(user));

        return res.json(post);
    } catch (error) {
        console.log(error);

        return res.json({ message: 'Something went wrong' });
    }
};

const router = Router();

router.post('/', user, auth, vote);

export default router;
