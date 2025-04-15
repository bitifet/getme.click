

import express from 'express';

const router = express.Router();
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


