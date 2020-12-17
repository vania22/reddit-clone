import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { User } from '../models/User';
import trimBody from '../middlewares/trimBody';

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        // Validate if email isn't in use
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res
                .status(400)
                .json({ message: 'User with given email already exists' });
        }

        // Validate if username isn't in use
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res
                .status(400)
                .json({ message: 'User with given username already exists' });
        }

        // Create user
        const user = new User({ username, email, password });

        // Validate user data
        const errors = await validate(user);
        if (errors.length > 0) return res.status(400).json(errors);

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

const router = Router();

router.post('/register', trimBody, register);

export default router;
