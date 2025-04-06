// mod/stocks/index.js
// ===================


const express = require('express');
const router = express.Router();
const {h_qr} = require('./dependencies');

router.get('/:list/labels.pdf', h_qr);
router.get('/:list/:uuid', h_item);
router.get('/:list', h_list);
router.get('/', h_index);

function h_index(req, res) {
    const { user } = req;
    console.log(`User requested:`, user);
    res.send(`
		User requested: ${JSON.stringify(user, null, 4)}
		<a href="/logout">Log out</a>
	`);
}

function h_list(req, res) {
    const { user } = req;
    const { list } = req.params;
    console.log(`List requested: ${user}/${list}`);
    res.send(`List requested: ${user}/${list}`);
}

function h_item(req, res) {
    const { user } = req;
    const { list, uuid } = req.params;
    console.log(`Item requested: ${user}/${list}/${uuid}`);
    res.send(`Item requested: ${user}/${list}/${uuid}`);
};


module.exports = router;
