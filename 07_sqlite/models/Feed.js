import { db, format } from '../lib/db.js';

export const fetchAll = (limit = 20) => {
    // feeds と users を結合し、新しい順に取得
    // const sql = `SELECT 
    //                 feeds.id, 
    //                 feeds.user_id, 
    //                 feeds.content, 
    //                 feeds.created_at, 
    //                 users.name AS user_name
    //             FROM feeds
    //             JOIN users ON feeds.user_id = users.id
    //             ORDER BY feeds.created_at DESC, feeds.id DESC
    //             LIMIT ?;`;

    // SQL を準備し、全件取得: statement.all(limit)
    const statement = db.prepare(sql);
    const feeds = statement.all(limit);
    return { feeds, sql: format(sql, [limit]) };
};

export const insert = ({ user_id, content }) => {
    // TODO: INSERT: user_id, content : プレースホルダ2つ: ?, ? 
    const sql = "";
    // user_id と content をバインドするためのパラメータ
    const params = [Number(user_id), content];
    try {
        // SQL実行
        const statement = db.prepare(sql);
        const result = statement.run(...params);
        const id = Number(result.lastInsertRowid);
        return { id, errors: [], sql: format(sql, params) };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql: format(sql, params) };
    }
};

export const update = (id, content) => {
    // TODO: 更新する列は SET、絞り込み列は id
    const sql = "UPDATE feeds ____2____ content = ? WHERE ____3____ = ?;";
    const params = [content, Number(id)];
    try {
        const statement = db.prepare(sql);
        const result = statement.run(...params);
        const changes = result.changes;
        const errors = changes ? [] : [{ msg: 'Feed not found' }];
        return { id: Number(id), changes, errors, sql: format(sql, params) };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql: format(sql, params) };
    }
};

// トランザクション: 2件まとめて追加 (fail: true なら2件目の前に失敗 → ROLLBACK)
export const insertTwice = ({ user_id, fail = false }) => {
    const sql = "INSERT INTO feeds (user_id, content) VALUES (?, ?);";
    const statement = db.prepare(sql);
    const sql1 = format(sql, [Number(user_id), 'トランザクション1']);
    const sql2 = format(sql, [Number(user_id), 'トランザクション2']);
    // TODO: トランザクション開始: BEGIN
    db.exec('____4____');
    try {
        statement.run(Number(user_id), 'トランザクション1');
        if (fail) throw new Error('わざと失敗させました (1件目も取り消されます)');
        statement.run(Number(user_id), 'トランザクション2');
        // TODO: 確定: COMMIT
        db.exec('____5____');
        return { errors: [], sql: `BEGIN;\n${sql1}\n${sql2}\nCOMMIT;` };
    } catch (error) {
        // TODO: 失敗時に取り消し: ROLLBACK
        db.exec('____6____');
        return { errors: [{ msg: error.message }], sql: `BEGIN;\n${sql1}\n-- エラー\nROLLBACK;` };
    }
};

// ⚠️ SQL インジェクションのデモ用 (文字列連結 + 複数文の実行)
export const insertInjection = ({ user_id, content }) => {
    const sql = `INSERT INTO feeds (user_id, content) VALUES (${user_id}, '${content}');`;
    try {
        db.exec(sql); // exec() は複数のSQL文を実行できてしまう
        return { errors: [], sql };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};

export const destroy = (id) => {
    // TODO: 削除対象の絞り込み列: id
    const sql = "DELETE FROM feeds WHERE ____7____ = ?;";
    try {
        // TODO: DELETE の実行: run()
        const statement = db.prepare(sql);
        const result = statement.____8____(Number(id));
        const changes = result.changes;
        return { id, changes, errors: [], sql: format(sql, [Number(id)]) };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};
