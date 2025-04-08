

import express from 'express';
import passport from 'passport';

import session from 'express-session';



import {Strategy as LocalStrategy} from 'passport-local';

import {signup, authenticate} from './users.js';

const router = express.Router();
export default router ;

// Required middleware for authentication
router.use(express.urlencoded({ extended: true }));
router.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());





// Passport local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await authenticate(username, password);
    if (!user) return done(null, false, { message: 'Invalid user name or password' });
    return done(null, user);
  }
));


// FIXME: This is a mock database, replace with real DB later
const usersCache = new Map();


// Serialize/deserialize user (required for sessions)
passport.serializeUser((user, done) => {
    // Store user ID in session
    console.log(user);
    usersCache.set(user.id, user);
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    // Retrieve user from session
    const user = usersCache.get(id);
    done(null, user);
});


// Routes
router.use(inlineLoginMiddleware); // Protect all routes below this middleware
router.get('/logout', logoutHandler);



// Inline login middleware
async function inlineLoginMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.method === 'GET') {
    return res.send(`
      <h1>Login</h1>
      <form method="post" action="${req.originalUrl}">
        <p>
            <input type="hidden" name="mode" value="login"/>
        </p>
        <p>
            <label>User name: <input type="text" name="username" placeholder="Username"/></label>
        </p>
        <p>
            <label>Passowrd: <input type="password" name="password" placeholder="Password"/></label>
        </p>
        <p>
            <button type="submit">Login</button>
        </p>
      </form>
      <h1>Sign Up</h1>
      <form method="post" action="${req.originalUrl}">
        <p>
            <input type="hidden" name="mode" value="signup" />
        </p>
        <p>
            <label>User name: <input type="text" name="username"/></label>
        </p>
        <p>
            <label>Passowrd: <input type="password" name="password"/></label>
        </p>
        <p>
            <label>Confirm Passowrd: <input type="password" name="password_confirm"/></label>
        </p>
        <p>
            <button type="submit">Sign Up</button>
        </p>
      </form>
    `);
  }

  // If POST and mode is signup, try signup
  if (req.body.mode === 'signup') {
      const { username, password, password_confirm } = req.body;
      try {
          await signup(username, password, password_confirm);
      } catch (err) {
          return res.status(401).send(`${err.message}. <a href="">Try again</a>`);
      }
  };

  // If POST and not logged in, try login
  passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
          return res.status(401).send('Login failed. <a href="">Try again</a>');
      }

      req.logIn(user, (err) => {
          if (err) return next(err);
          //return next(); // Auth success, continue
          res.redirect(req.originalUrl); // Force GET method
      });
  })(req, res, next);
};


// Logout handler
function logoutHandler (req, res) {
  req.logout((err) => {
    if (err) return next(err);
    const backTo = req.get('Referer') || '/';
    res.redirect(backTo);
  });
};


