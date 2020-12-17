import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';

// Importing routers
import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Using routers
app.use('/api/auth', authRouter);

app.listen(5000, async () => {
    console.log('Server started at port 5000');

    try {
        await createConnection();
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
});
