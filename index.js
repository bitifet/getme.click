

import {app} from './mod/server/index.js';
import {router as landingRouter} from './mod/landing/index.js';
import {requireAuthentication} from './mod/auth/index.js';
import {router as stocksRouter} from './mod/stocks/index.js';



app.set('views', './mod/landing/assets');



app.use(landingRouter);
app.use('/stocks', requireAuthentication, stocksRouter);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
