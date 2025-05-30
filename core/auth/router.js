// mod/auth/router.js
// ==================

/*  Copyright © 2025  Joan Miquel Torres Rigo  {{{
  
    This file is part of getme.click website.

    getme.click website is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    getme.click website is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with getme.click website.  If not, see <https://www.gnu.org/licenses/>.
}}} */


import express from 'express';
import passport from 'passport';
import {URL} from 'url';

import session from 'express-session';

import {moduleRouter, Bool} from './dependencies.js';


import {Strategy as LocalStrategy} from 'passport-local';

import {signup, authenticate} from './users.js';

export const router = moduleRouter(import.meta.dirname);

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
router.all('/login', requireAuthentication, loginHandler);
router.get('/logout', logoutHandler);


// Inline login middleware
export async function requireAuthentication(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    };
    const {originalUrl} = req;

    let referer, allowDismiss;
    if (req.method === 'GET') {
        if (originalUrl.startsWith('/login')) {
            if (req.query?.referer) { // Login retry
                referer = req.query.referer;
                allowDismiss = Bool(req.query.allowDismiss);
            } else if (req.get('Referer')) { // Very first step
                referer = req.get('Referer');
                allowDismiss = true;
            } else { // Direct access to /login
                referer = "/";
                allowDismiss = true;
            };
        } else { // Login is required to access current page
            referer = originalUrl;
            allowDismiss = false;
        };
    } else { // Remember values across the rest of the process
        referer = req.query?.referer;
        allowDismiss = Bool(req.query?.allowDismiss);
    };

    if (req.method === 'GET') {

        // Build return path url:
        const returnPath = new URL('/login', `${req.protocol}://${req.get('host')}`);

        const isEnforcedLogin = ! originalUrl.startsWith('/login');

        returnPath.search = (new URLSearchParams({
            referer,
            allowDismiss,
        })).toString();

        // Redirect to /login if not already there:
        if (isEnforcedLogin) return res.redirect(returnPath);

        // Render login page:
        return res.render('log_or_sign_in', { returnPath, user: null });

    };

    // If POST and mode is signup, try signup
    if (req.body?.mode === 'signup') {
        const { username, password, password_confirm } = req.body;
        try {
            await signup(username, password, password_confirm);
        } catch (error) {
            const dismissUrl = allowDismiss ? referer : "/";
            return res.status(401).render('log_or_sign_in_error', {error, dismissUrl});
        }
    };

    // If POST and not logged in, try login
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            const error = {message: "Login failed"};
            const dismissUrl = allowDismiss ? referer : "/";
            return res.status(401).render('log_or_sign_in_error', {error, dismissUrl});
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            //return next(); // Auth success, continue
            res.redirect(originalUrl); // Force GET method
        });
    })(req, res, next);
};

// Login handler
function loginHandler (req, res) {
    // Just return to where we came from after requireAuthentication middleware
    const backTo = req.query?.referer || '/';
    res.redirect(backTo);
};

// Logout handler
function logoutHandler (req, res) {
  req.logout((err) => {
    if (err) return next(err);
    const backTo = req.get('Referer') || '/';
    res.redirect(backTo);
  });
};


