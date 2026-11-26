import fs from 'node:fs';
import path from 'node:path';
import { faker } from '@faker-js/faker';
import { db, dbFile, migrate } from '../lib/db.js';

// DB に接続できているか確認: SQLite のバージョンを取得できれば接続成功
export const status = () => {
    const sql = "SELECT sqlite_version() AS version";
    try {
        // SQL を準備
        const statement = db.prepare(sql);
        // TODO: クエリを実行して1行取得: get()
        const row = statement.____1____();
        const file = path.relative(process.cwd(), dbFile);
        return { connected: true, version: row.version, file, errors: [], sql };
    } catch (error) {
        return { connected: false, errors: [{ msg: error.message }], sql };
    }
};

// テーブル一覧 (名前・件数・カラム)
export const tables = () => {
    const sql = "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name";
    try {
        const statement = db.prepare(sql);
        const rows = statement.all();
        const list = [];
        for (const { name } of rows) {
            // name は sqlite_master から取得した値 (ユーザー入力ではない)
            const columnsStatement = db.prepare(`PRAGMA table_info(${name})`);
            const columns = columnsStatement.all();
            const countStatement = db.prepare(`SELECT COUNT(*) AS count FROM ${name}`);
            const countRow = countStatement.get();
            list.push({ name, count: countRow.count, columns });
        }
        return { tables: list, errors: [], sql: `${sql};\nPRAGMA table_info(テーブル名);\nSELECT COUNT(*) AS count FROM テーブル名;` };
    } catch (error) {
        return { tables: [], errors: [{ msg: error.message }], sql };
    }
};

// テーブル作成: schema.sql を実行
export const create = () => {
    const schema = path.resolve('database/schema.sql');
    let sql = '';
    try {
        const text = fs.readFileSync(schema, 'utf-8');
        sql = text.trim();
        migrate();
        return { errors: [], sql };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};

// テーブル削除 (feeds は users を参照しているので、先に削除)
export const drop = () => {
    const sql = "DROP TABLE IF EXISTS feeds;\nDROP TABLE IF EXISTS users;";
    try {
        db.exec(sql);
        return { errors: [], sql };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};

// テストデータ投入 (何度押しても追加できるよう、email の番号は続きから採番)
export const seed = ({ users = 10, feeds = 30 } = {}) => {
    const userSQL = "INSERT INTO users (name, email) VALUES (?, ?)";
    const feedSQL = "INSERT INTO feeds (user_id, content, created_at) VALUES (?, ?, ?)";
    const sql = `BEGIN;\n${userSQL};  -- × ${users}\n${feedSQL};  -- × ${feeds}\nCOMMIT;`;
    try {
        migrate();
        const countStatement = db.prepare("SELECT COUNT(*) AS count FROM users");
        const countRow = countStatement.get();
        const insertUser = db.prepare(userSQL);
        const insertFeed = db.prepare(feedSQL);

        db.exec('BEGIN');
        try {
            for (let i = 1; i <= users; i++) {
                insertUser.run(faker.person.fullName(), `user${countRow.count + i}@test.com`);
            }
            const idStatement = db.prepare("SELECT id FROM users");
            const userIds = idStatement.all().map((row) => row.id);
            for (let i = 0; i < feeds; i++) {
                const createdAt = faker.date.recent({ days: 14 }).toISOString().replace('T', ' ').slice(0, 19);
                insertFeed.run(faker.helpers.arrayElement(userIds), faker.lorem.sentence(), createdAt);
            }
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
        return { errors: [], users, feeds, sql };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};

// 全データ削除 (SQLite に TRUNCATE はないので DELETE + AUTOINCREMENT のリセット)
export const truncate = () => {
    const sql = "DELETE FROM feeds;\nDELETE FROM users;\nDELETE FROM sqlite_sequence WHERE name IN ('feeds', 'users');";
    try {
        db.exec(sql);
        return { errors: [], sql };
    } catch (error) {
        return { errors: [{ msg: error.message }], sql };
    }
};
