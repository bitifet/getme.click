const express = require('express');
const session = require('express-session');
const passport = require('passport');

const {router: authRouter} = require('./mod/auth');


const stocks = require('./mod/stocks');

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


app.use('/stocks', stocks);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
