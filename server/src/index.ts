import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('hello'));

app.listen(5000, async () => {
    console.log('Server started at port 5000');

    try {
        await createConnection();
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
});
