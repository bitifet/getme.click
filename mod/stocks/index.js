// mod/stocks/index.js
// ===================

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

import { h_qr, requireAuthentication, moduleRouter } from './dependencies.js';

export const router = moduleRouter(import.meta.dirname);

router.get('/:store/labels.pdf', h_qr);
router.get('/:store/:uuid', requireAuthentication, h_item);
router.get('/:store', requireAuthentication, h_list);
router.get('/', h_index);

function h_index(req, res) {
    const { user } = req;
    console.log(`User requested:`, user);
    res.render('index', {user, stores: ["foo", "bar"]});
}

function h_list(req, res) {
    const { user } = req;
    const { store } = req.params;
    console.log(`List requested: ${user}/${store}`);
    res.render('storeIndex', {user, store, items: ["foo", "bar"]});
}

function h_item(req, res) {
    const { user } = req;
    const { store, uuid } = req.params;
    console.log(`Item requested: ${user}/${store}/${uuid}`);
    res.send(`Item requested: ${user}/${store}/${uuid}`);
};

