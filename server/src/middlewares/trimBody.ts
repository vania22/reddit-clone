import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    // Fields which shouldn't be trimmed
    const exceptions = ['password'];

    for (let key of Object.keys(req.body)) {
        if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }

    next();
};
