import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import trimBody from './middlewares/trimBody';

dotenv.config();

// Importing routers
import authRouter from './routes/auth';
import postRouter from './routes/posts';
import subRouter from './routes/subs';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(trimBody);

// Using routers
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/sub', subRouter);

app.listen(process.env.PORT, async () => {
    console.log(`Server started at port ${process.env.PORT}`);

    try {
        await createConnection();
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
});
