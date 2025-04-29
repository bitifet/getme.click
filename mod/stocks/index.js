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

const re_seemsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const router = moduleRouter(import.meta.dirname);

// Generate pdf wit QR labels for given storage:
router.get('/:storage/labels.pdf', h_qr);

// Create or edit an item:
router.get('/:storage/:uuid', requireAuthentication, h_item);

// list of items of given article in given storage (or _all):
router.get('/:storage/:article', requireAuthentication, h_article);

// List of distinct articles (items grouped by name) in given storage (or _all):
router.get('/:storage', requireAuthentication, h_articles);

// List of storages:
router.get('/', requireAuthentication, h_storages);



const stocksLink = { icon: '🛍️', name: 'Stocks', path: '/' };


// h_storages
// ==========
// List of storages
//
// This is the main page of the stocks module.
//
//   * Shows a list of all available storages
//   * Allow to create new ones
//
function h_storages(req, res) {
    const title = "Storages";
    const { baseUrl, user } = req;
    const storages = ["foo", "bar", "baz"];
    const navLinks = [stocksLink];

    const locals = { title, baseUrl, user, storages, navLinks };
    res.render('storages', locals);
}

// h_articles
// ==========
// List of articles in a storage
//
//   * Shows a list of all different articles in a storage
//     - They link to their corresponding article (h_articles);view by its name
//   * Detail stock (count of items) of each article
//   * Allow to create new items (not articles)
//     - Just linking to a an item with random uuid (like from a QR label)
//     - If we give a new name to the item, we implicitly create a new article
//     - Iw we give a name of already existing article, we are just increasing its stock.
//
function h_articles(req, res) {
    const { baseUrl, user } = req;
    let { storage:storageId, storage } = req.params;
    let articles = [];
    if (storageId === "_all") {
        storage = "(All Storages)";
        // TODO: Load all articles
        articles = ["foo", "bar", "baz", "foobar", "bazqux"];
    } else {
        // TODO: Load articles in the storage
        articles = ["foo", "bar"];
    };

    const navLinks = [
        stocksLink,
        { icon: '📦', name: storage, path: `/${storageId}` },
    ];

    const locals = { baseUrl, user, storageId, storage, articles, navLinks };
    res.render('articles', locals);
}


// h_article
// =========
// Show details of an article
//
//   * Shows a list of all existing items of the article in the storage
//     - They link to their corresponding item (h_item) view by its uuid
//   * Allow to create new items
//     - Just linking to a an item with random uuid (like from a QR label)
//     - Pre-filling the name by the article name
function h_article(req, res) {
    const { baseUrl, user } = req;
    const { storage, article } = req.params;

    const navLinks = [
        stocksLink,
        { icon: '📦', name: storage, path: `/${storage}` },
        { icon: '🍆', name: article, path: `/${storage}/${article}` },
    ];

    const items = [
        "ifoo", "ibar", "ibaz"
    ];

    console.log(`Article requested: ${user}/${storage}/${article}`);
    const locals = { baseUrl, user, storage, article, navLinks };
    res.render('items', {user, storage, article, items, navLinks});
};


// h_item
// ======
// Show details of an item
//
//   * Allow to create new item if it does not already exist.
//   * Show it and allow to modify the item if already exists.
//
function h_item(req, res, next) {
    const { baseUrl, user } = req;
    const { storage, uuid } = req.params;
    if (! re_seemsUUID.test(uuid)) return next();

    const navLinks = [
        stocksLink,
        { icon: '📦', name: storage, path: `/${storage}` },
    ];

    console.log(`Item requested: ${user}/${storage}/${uuid}`);
    const locals = { baseUrl, user, storage, uuid, navLinks };
    res.send(`Item requested: ${user}/${storage}/${uuid}`);
    ///res.render('storeItem', {user, storage, item, navLinks});
};



