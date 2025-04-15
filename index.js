

import {router as landingRouter} from './mod/landing/index.js';
import {router as authRouter, requireAuthentication} from './mod/auth/index.js';
import {router as stocksRouter} from './mod/stocks/index.js';

import express from 'express';

const app = express();
app.set('view engine', 'pug')
app.set('views', './mod/landing/assets');

app.use(authRouter);


app.use(landingRouter);
app.use('/stocks', requireAuthentication, stocksRouter);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
