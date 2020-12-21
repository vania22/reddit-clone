import { Request, Response, Router } from 'express';
import auth from '../middlewares/auth';
import user from '../middlewares/user';
import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';

const commentOnPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    const { body } = req.body;
    const user: User = res.locals.user;

    if (!body.trim()) {
        return res.status(400).json({ message: 'Comment must not be empty' });
    }

    try {
        const post = await Post.findOne({ identifier, slug });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = new Comment({ body, post, user });
        await comment.save();

        return res.json(comment);
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Something went wrong' });
    }
};

const router = Router();

router.post('/comment/:identifier/:slug', user, auth, commentOnPost);

export default router;
