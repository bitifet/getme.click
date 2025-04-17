
import { h_qr, requireAuthentication, appRouter } from './dependencies.js';

export const router = appRouter(import.meta.dirname);

router.all('/:store/labels.pdf', requireAuthentication, h_qr);
router.all('/:store/:uuid', requireAuthentication, h_item);
router.all('/:store', requireAuthentication, h_list);
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

