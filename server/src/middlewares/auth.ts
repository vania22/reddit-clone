import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User | undefined = res.locals.user;

        if (!user) throw new Error('Unauthorized');

        return next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};
