

import moduleRouter from './moduleRouter.js';


const router = moduleRouter(import.meta.dirname); 

// 404 handler
router.use((req, res, next) => {
  res.status(404).render('404', {user: null, message: 'Page not found' });
});



export default router;
