


import express from 'express';
import {authRouter} from './dependencies.js';

export const app = express();
app.set('view engine', 'pug')
app.use(authRouter);




