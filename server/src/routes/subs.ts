import { Request, Response, Router } from 'express';
import { getRepository, getConnection } from 'typeorm';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { makeid } from './../util/helpers';
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
        const sub = await Sub.findOneOrFail({ name }, { relations: ['user'] });
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

const getTopSubs = async (req: Request, res: Response) => {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn", 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;

    try {
        const subs: Sub[] = await getConnection()
            .createQueryBuilder()
            .select(
                `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`,
            )
            .from(Sub, 's')
            .leftJoin(Post, 'p', 's.name = p."subName"')
            .groupBy('s.title, s.name, "imageUrl"')
            .orderBy(`"postCount"`, 'DESC')
            .limit(5)
            .execute();

        return res.json(subs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const ownSub = async (req: Request, res: Response, next: NewableFunction) => {
    const user: User = res.locals.user;

    const sub: Sub = await Sub.findOne({ name: req.params.name, user });

    if (!sub) {
        return res
            .status(403)
            .json({ message: 'You are not the owner of the sub' });
    }

    res.locals.sub = sub;
    next();
};

const findSub = async (req: Request, res: Response) => {
    const searchTerm = req.params.searchTerm;

    try {
        const subs = await getRepository(Sub)
            .createQueryBuilder('sub')
            .where('LOWER(sub.name) like LOWER(:name)', {
                name: `%${searchTerm}%`,
            })
            .getMany();

        return res.json(subs);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: 'public/images',
        filename: (req, file, callback) => {
            const name = makeid(15);
            callback(null, name + path.extname(file.originalname));
        },
    }),
    fileFilter: (req, file, callback: FileFilterCallback) => {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png'
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not an image'));
        }
    },
});

const uploadSubImage = async (req: Request, res: Response) => {
    const sub: Sub = res.locals.sub;

    try {
        const type = req.body.type;

        if (type !== 'image' && type !== 'banner') {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Invalid type' });
        }

        let oldImageUrn;
        if (type === 'image') {
            oldImageUrn = sub.imageUrn || '';
            sub.imageUrn = req.file.filename;
        } else {
            oldImageUrn = sub.bannerUrn || '';
            sub.bannerUrn = req.file.filename;
        }

        if (oldImageUrn) {
            fs.unlinkSync(`public\\images\\${oldImageUrn}`);
        }
        await sub.save();

        return res.json(sub);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const router = Router();

// Routes
router.post('/', user, auth, createSub);
router.get('/sub/:name', user, getSub);
router.get('/top-subs', user, getTopSubs);
router.post(
    '/:name/image',
    user,
    auth,
    ownSub,
    upload.single('file'),
    uploadSubImage,
);
router.get('/find/:searchTerm', user, findSub);

export default router;
