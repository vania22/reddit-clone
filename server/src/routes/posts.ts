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

    const existingSub = await Sub.findOne({ name: sub });

    if (!existingSub) {
        return res.status(400).json({ message: 'Sub does not exist anymore' });
    }

    try {
        const post = new Post({
            title,
            body,
            user,
            sub: existingSub,
        });
        await post.save();

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });

        return res.json(posts);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;

    try {
        const post = await Post.findOne(
            { identifier, slug },
            { relations: ['sub', 'comments'] },
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.json(post);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const router = Router();

// Routes
router.post('/', auth, createPost);
router.get('/', getPosts);
router.get('/:identifier/:slug', getPost);

export default router;
