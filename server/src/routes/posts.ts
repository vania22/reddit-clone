import { Request, Response, Router } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import Sub from '../models/Sub';
import auth from '../middlewares/auth';

const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body;

    const user: User = res.locals.user;

    if (title.trim() === '') {
        return res.status(400).json({ message: 'Title must not be empty' });
    }

    const subExists = await Sub.findOne({ name: sub });

    if (!subExists) {
        return res.status(400).json({ message: 'Sub does not exist anymore' });
    }

    try {
        const post = new Post({
            title,
            body,
            user,
            subName: sub,
        });
        await post.save();

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const router = Router();

// Routes
router.post('/', auth, createPost);

export default router;
