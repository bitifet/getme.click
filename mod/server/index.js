


import path from 'path';
import express from 'express';
import {authRouter} from './dependencies.js';
import defaults from './defaults.js';

const app = express();
const mainRouter = express.Router();

app.set('view engine', 'pug')
app.set('views', defaults.default_views_path);
app.use(applyAssetsPath);

app.use(authRouter);
app.use(mainRouter);




app.listen(3000, () => {
    console.log('Server running on port 3000');
});



export { mainRouter as app };

export function appRouter(modulePath, options) {
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








// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

function setAssetsPath(assetsPath) {
    return function(req, res, next) {
        res.assetsPath = assetsPath;
        next();
    };
};

function applyAssetsPath(req, res, next) {
    const render = res.render.bind(res);
    res.render = function(view, model, ...rest) {
        model.basedir = res.app.get('views');
        if (
            ! view.startsWith("/")
            && !! this.assetsPath
        ) {
            view = path.normalize(this.assetsPath + '/' + view);
        }
        return render(view, model, ...rest);
    }
    next();
}

