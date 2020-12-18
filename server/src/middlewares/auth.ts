import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) throw new Error('Unauthorized');

        const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ username });

        if (!user) throw new Error('Unauthorized');

        res.locals.user = user;

        return next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};
