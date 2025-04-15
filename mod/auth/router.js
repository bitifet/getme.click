

import express from 'express';
import passport from 'passport';

import session from 'express-session';

import {appRouter} from './dependencies.js';


import {Strategy as LocalStrategy} from 'passport-local';

import {signup, authenticate} from './users.js';

export const router = appRouter(import.meta.dirname);

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
    usersCache.set(user.id, user);
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    // Retrieve user from session
    const user = usersCache.get(id);
    done(null, user);
});


// Routes
router.get('/logout', logoutHandler);



// Inline login middleware
export async function requireAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };

    if (req.method === 'GET') {
        return res.render('../../auth/assets/log_or_sign_in', { originalUrl: req.originalUrl });
    };

    // If POST and mode is signup, try signup
    if (req.body?.mode === 'signup') {
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


