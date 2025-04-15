

import {app} from './mod/server/index.js';
import {router as landingRouter} from './mod/landing/index.js';
import {requireAuthentication} from './mod/auth/index.js';
import {router as stocksRouter} from './mod/stocks/index.js';




app.use(landingRouter);
app.use('/stocks', requireAuthentication, stocksRouter);


