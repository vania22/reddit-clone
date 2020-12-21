import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import Sub from '../models/Sub';
import User from '../models/User';
import auth from '../middlewares/auth';
import user from '../middlewares/user';
import Post from '../models/Post';

const createSub = async (req: Request, res: Response) => {
    const { name, title, description } = req.body;

    const user: User = res.locals.user;

    if (!title.trim() || !name.trim()) {
        return res
            .status(400)
            .json({ message: 'Not all mandatory fields are populated' });
    }

    try {
        const subExists = await getRepository(Sub)
            .createQueryBuilder('sub')
            .where('lower(sub.name) = :name', { name: name.toLowerCase() })
            .getOne();

        if (subExists) {
            return res
                .status(400)
                .json({ message: 'Sub with given name already exists' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }

    try {
        const sub = new Sub({ name, title, user });
        await sub.save();

        return res.json(sub);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const getSub = async (req: Request, res: Response) => {
    const name = req.params.name;

    try {
        const sub = await Sub.findOneOrFail({ name });
        const posts = await Post.find({
            where: { sub },
            order: { createdAt: 'DESC' },
            relations: ['comments', 'votes', 'user'],
        });

        if (res.locals.user) {
            posts.forEach((p) => p.setUserVote(res.locals.user));
        }

        sub.posts = posts;

        return res.json(sub);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const router = Router();

// Routes
router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);

export default router;
