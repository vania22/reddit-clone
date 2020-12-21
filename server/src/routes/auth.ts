import { validate } from 'class-validator';
import e, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import User from '../models/User';
import auth from '../middlewares/auth';
import user from '../middlewares/user';

const register = async (req: Request, res: Response) => {
    let { email, username, password } = req.body;
    email = email.toLowerCase();

    try {
        // Create user
        const user = new User({ username, email, password });

        // Validate user data
        const errors = await validate(user);
        let mappedErrors = {};
        if (errors.length > 0) {
            errors.forEach((element) => {
                const fieldName = element.property;
                const value = Object.entries(element.constraints)[0][1];
                mappedErrors[fieldName] = value;
            });

            return res.status(400).json(mappedErrors);
        }

        // Validate if email isn't in use
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res
                .status(400)
                .json({ email: 'User with given email already exists' });
        }

        // Validate if username isn't in use
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res
                .status(400)
                .json({ username: 'User with given username already exists' });
        }

        // Save user
        await user.save();

        console.log(user);
        return res.json(user);

        // TODO Return user
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    let errors = {};

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({ error: 'Incorrect username or password' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res
                .status(401)
                .json({ error: 'Incorrect username or password' });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET);

        res.set(
            'Set-Cookie',
            cookie.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600,
                path: '/',
            }),
        );

        return res.json({ user, token });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const me = async (req: Request, res: Response) => {
    return res.json(res.locals.user);
};

const logout = (req: Request, res: Response) => {
    res.set(
        'Set-Cookie',
        cookie.serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        }),
    );

    return res.status(200).json({ success: true });
};

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me',user, auth, me);
router.get('/logout',user, auth, logout);

export default router;
