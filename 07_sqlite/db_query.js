import { db } from './lib/db.js';

// 使い方: node db_query.js "SELECT * FROM users LIMIT 3"
const sql = process.argv[2] || 'SELECT * FROM users LIMIT 5';
console.log(sql);
try {
    const statement = db.prepare(sql);
    console.table(statement.all());
} catch (error) {
    console.error(error.message);
}
db.close();
