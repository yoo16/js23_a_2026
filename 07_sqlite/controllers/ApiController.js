import * as User from '../models/User.js';
import * as Feed from '../models/Feed.js';
import * as Db from '../models/Db.js';

export const userList = (req, res) => {
    const result = User.fetchAll(Number(req.query.limit) || 20);
    const users = result.users;
    const sql = result.sql;
    // TODO: JSON を返す: json()
    res.json({ users, sql, message: 'Listed', errors: [] });
};

export const feedList = (req, res) => {
    const result = Feed.fetchAll(Number(req.query.limit) || 20);
    const feeds = result.feeds;
    const sql = result.sql;
    res.json({ feeds, sql, message: 'Listed', errors: [] });
};

export const feedPost = (req, res) => {
    // POST の送信データ: req.body を Feed.insert() に渡す
    const result = Feed.insert(req.body);
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'Posted' });
};

export const feedPostInjection = (req, res) => {
    // POST の送信データ: req.body
    const result = Feed.insertInjection(req.body);
    res.json({ ...result, message: 'Posted (injection)' });
};

export const feedUpdate = (req, res) => {
    const result = Feed.update(req.params.id, req.body.content);
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'Updated' });
};

export const feedPostTransaction = (req, res) => {
    const result = Feed.insertTwice(req.body);
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'Posted (transaction)' });
};

export const feedDestroy = (req, res) => {
    // URL の :id を受け取る: params
    const result = Feed.destroy(req.params.id);
    res.json({ ...result, message: 'Deleted' });
};

// DB の接続状態 (Home の Connected 表示用)
export const dbStatus = (req, res) => {
    const result = Db.status();
    const message = result.connected ? 'Connected' : 'Disconnected';
    res.json({ ...result, message });
};

// DB の操作 (Database ページ用)
export const dbTables = (req, res) => {
    const result = Db.tables();
    res.json({ ...result, message: 'Tables' });
};

export const dbCreate = (req, res) => {
    const result = Db.create();
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'Tables created' });
};

export const dbDrop = (req, res) => {
    const result = Db.drop();
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'Tables dropped' });
};

export const dbSeed = (req, res) => {
    const result = Db.seed();
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'Test data imported' });
};

export const dbTruncate = (req, res) => {
    const result = Db.truncate();
    const status = result.errors.length ? 400 : 200;
    res.status(status).json({ ...result, message: 'All data deleted' });
};

// SQL クライアント用: 定義済みクエリ
export const usersCount = (req, res) => {
    const result = User.count();
    const data = [{ count: result.count }];
    res.json({ data, sql: result.sql, message: 'success' });
};

export const userByEmail = (req, res) => {
    const email = String(req.query.email || '');
    const result = User.findByEmail(email);
    res.json({ data: result.users, sql: result.sql, message: 'success' });
};

export const feedsJoin = (req, res) => {
    const result = Feed.fetchAll(100);
    const data = result.feeds.map(({ user_name, content, created_at }) => ({ user_name, content, created_at }));
    res.json({ data, sql: result.sql, message: 'success' });
};
