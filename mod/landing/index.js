// mod/landing/index.js
// ====================

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

import {appRouter} from './dependencies.js';

const router = appRouter(import.meta.dirname);

export {router};

const routes = [
    ['/', 'landing'],
    ['/getting-started', 'getStarted'],
]


routes.forEach(([path, view, locals = {}]) => {
	router.get(path, (req, res) => {
        const { user } = req;
        res.render(view, {user, ...locals});
    });
});


