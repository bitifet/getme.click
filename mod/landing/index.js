

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
        res.render(view, locals);
    });
});


