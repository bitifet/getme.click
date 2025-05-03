// mod/www/moduleRouter.js
// =======================

import express from 'express';


export default function moduleRouter(modulePath, options) {
    if (!modulePath) {
        throw new Error("Module path is required");
    };

    const assetsPath = modulePath + '/assets'; // Local assets path.

    const router = express.Router();

    // Supported kinds of assets:
    router.use(setAssetsPath(assetsPath));  // Templates
    router.use(express.static(assetsPath)); // Static files

    return router;

};


function setAssetsPath(assetsPath) {
    return function(req, res, next) {
        res.assetsPath = assetsPath;
        next();
    };
};

