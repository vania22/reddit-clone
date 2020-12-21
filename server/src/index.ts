import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import trimBody from './middlewares/trimBody';

dotenv.config();

// Importing routers
import authRouter from './routes/auth';
import postRouter from './routes/posts';
import subRouter from './routes/subs';
import commentRouter from './routes/comments';
import voteRouter from './routes/votes';

const app = express();

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200,
    }),
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(trimBody);

// Using routers
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/post', commentRouter);
app.use('/api/sub', subRouter);
app.use('/api/vote', voteRouter);

app.listen(process.env.PORT, async () => {
    console.log(`Server started at port ${process.env.PORT}`);

    try {
        await createConnection();
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
});
