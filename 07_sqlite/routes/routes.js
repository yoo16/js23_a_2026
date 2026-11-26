import { Router } from 'express';
import { page } from '../controllers/PageController.js';
import * as Api from '../controllers/ApiController.js';

const router = Router();

// Pages
router.get('/', page('home'));
router.get('/feeds', page('feeds'));
router.get('/users', page('users'));
router.get('/sql-client', page('sql_client'));
router.get('/database', page('database'));

// API
router.get('/api/db/status', Api.dbStatus);
router.get('/api/db/tables', Api.dbTables);
router.post('/api/db/create', Api.dbCreate);
router.post('/api/db/drop', Api.dbDrop);
router.post('/api/db/seed', Api.dbSeed);
router.post('/api/db/truncate', Api.dbTruncate);
router.get('/api/users', Api.userList);
router.get('/api/users/count', Api.usersCount);
router.get('/api/users/by-email', Api.userByEmail);
router.get('/api/feeds', Api.feedList);
router.get('/api/feeds/join', Api.feedsJoin);
router.post('/api/feeds', Api.feedPost);
router.post('/api/feeds/transaction', Api.feedPostTransaction);
router.post('/api/feeds/injection', Api.feedPostInjection);
router.post('/api/feeds/:id/update', Api.feedUpdate);
router.post('/api/feeds/:id/destroy', Api.feedDestroy);

export default router;
