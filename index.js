
import express from 'express';
import session from 'express-session';
import passport from 'passport';

import {router as authRouter} from './mod/auth/index.js';

import {router as stocksRouter} from './mod/stocks/index.js';

const app = express();


// Required middleware for authentication
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('Home page');
});


app.use(authRouter);


app.use('/stocks', stocksRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
