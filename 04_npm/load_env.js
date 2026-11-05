// TODO: dotenvインポート
const dotenv = require('dotenv');

// TODO: dotenvの設定をロード: config()
dotenv.config()

// TODO: 環境変数の取得
const HOST = process.env.HOST
const PORT = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET

// 結果表示
let result = { HOST, PORT, SESSION_SECRET };
console.table(result);