// index.js
// ========

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

import {app} from './mod/www/index.js';
import {router as landingRouter} from './mod/landing/index.js';
import {router as stocksRouter} from './mod/stocks/index.js';


app.use(landingRouter);
app.use('/stocks', stocksRouter);


