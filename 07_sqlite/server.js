import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { migrate } from './lib/db.js';
import routes from './routes/routes.js';

dotenv.config({ quiet: true });
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// テーブルがなければ作成
// DB 接続が未完成 (穴埋め中) でも、サーバーと HTML 画面は起動できるようにする
try {
    migrate();
} catch (error) {
    console.error(`migrate() に失敗しました: ${error.message}`);
}

// Express アプリを作成
const app = express();
// リクエストのログを出力するミドルウェア
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// JSON ボディを解析
app.use(express.json());
// URL エンコードされたフォームデータを解析
app.use(express.urlencoded({ extended: true }));
// public フォルダを静的ファイルとして提供
app.use(express.static(path.resolve('public')));
// ルーティングを設定
app.use('/', routes);
// エラー処理 (テーブルがないときなど): エラーを JSON で返す
app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: error.message }], message: 'Error' });
});

// サーバーを起動
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
