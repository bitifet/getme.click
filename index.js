
import express from 'express';

import {router as authRouter} from './mod/auth/index.js';

import {router as stocksRouter} from './mod/stocks/index.js';

const app = express();



app.get('/', (req, res) => {
  res.send('Home page');
});


app.use(authRouter);


app.use('/stocks', stocksRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
