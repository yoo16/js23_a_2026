import { db, format } from '../lib/db.js';

export const fetchAll = (limit = 20) => {
    const sql = "SELECT id, name, email, created_at FROM users ORDER BY id LIMIT ?;";
    // TODO: SQL を準備: db.prepare(sql) を statement に入れる
    // TODO: 全件取得: statement.all(limit)
    const users = { rows: [] };
    return { users, sql: format(sql, [limit]) };
};

export const count = () => {
    // SQL: 件数を数える関数: COUNT
    const sql = "SELECT COUNT(*) AS count FROM users;";
    // TODO: SQL を準備: db.prepare(sql) を statement に入れる
    // TODO: 1件取得: statement.get()
    const count = 0;
    return { count, sql };
};

export const findByEmail = (email) => {
    const sql = "SELECT id, name, email, created_at FROM users WHERE email = ?;";
    // TODO: SQL を準備: db.prepare(sql) を statement に入れる
    // TODO: プレースホルダに渡す値を指定して全件取得: statement.all(email)
    const users = { rows: [] };
    return { users, sql: format(sql, [email]) };
};
