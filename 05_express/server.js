// dotenv インポート(ESM)
import dotenv from 'dotenv';
// path モジュールのインポート
import path from 'path';
// TODO: express インポート(ESM)
import express from 'express';

// Dotenvの設定をロード
dotenv.config();
// モデルのインポート
import { fetchProducts, findProductById, searchProducts } from './models/Product.js';

// 環境変数の取得（デフォルト値も設定）
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://${HOST}:${PORT}/`

// 現在のディレクトリパスを取得
const __dirname = path.resolve();

// サーバーステータスの表示
const status = { HOST, PORT, BASE_URL, __dirname };
console.log(status);

// TODO: Expressアプリケーションの初期化
const app = express();

// ミドルウェア設定
// カスタムミドルウェア: すべてのリクエストでログ出力
// TODO: app.use() で登録
// app.use((req, res, next) => {
//     console.log(`ミドルウェア: ${req.method} ${req.url}`);
//     next();
// });

// TODO: JSONボディパーサー
// app.use(express.json());

// TODO: URLエンコード: www-form-urlencoded ボディパーサー
// app.use(express.urlencoded({ extended: true }));

// TODO: 静的ファイルの公開: /public
// app.use(express.static(__dirname + '/public'));

// カート情報
let cartItems = [];

// ------------------------
// ルーティング
// ------------------------
// TODO: GET /test
app.get('/test', (req, res) => {
    console.log("ルーティング: /test");
    const message = 'Hello, Express!';
    res.send(message);
});

// Flaskの場合
// @app.route('/test', methods=['GET'])
// def test():
//     print("ルーティング: /test")
//     message = 'Hello, Express!'
//     return message

// TODO: GET /
// /public/home.html
app.get('/', (req, res) => {
    console.log("ルーティング: /");
    res.sendFile(__dirname + '/public/home.html');
});

// TODO: GET /info
app.get('/info', (req, res) => {
    console.log("ルーティング: /info");
    const message = 'ここは情報ページです';
    res.send(message);
});


// TODO: GET /about
// /public/about.html
app.get('/about', (req, res) => {
    console.log("ルーティング: /about");
    res.sendFile(__dirname + '/public/about.html');
});

// TODO: GET /search  => keyword クエリパラメータ対応
// /public/home.html
app.get('/search', (req, res) => {
    console.log("ルーティング: /search");
    if (req.query.keyword) {
        const keyword = req.query.keyword;
        console.log("検索キーワード: " + keyword);
    }
    res.sendFile(__dirname + '/public/home.html');
});

// TODO GET /product/:id  => id パスパラメータ対応
// /public/product.html
app.get('/product/:id', (req, res) => {
    // 商品IDを取得
    const id = req.params.id;
    console.log("ルーティング: /product/" + id);
    res.sendFile(__dirname + '/public/product.html');
});

// TODO: POST /save
app.post('/save', (req, res) => {
    console.log("ルーティング: /save");
    const message = 'POSTリクエストを受け取りました';
    res.send(message);
});

// ------------------------
// API
// ------------------------
// GET: エンドポイント: /api/product/list
app.get('/api/product/list', (req, res) => {
    console.log("ルーティング: api/product/list");

    // TODO: 商品データを読み込む
    const products = {};
    const data = { products };
    // 商品データを返す
    res.json(data);
});

// GET: エンドポイント: /api/product/show/:id
app.get('/api/product/show/:id', (req, res) => {
    // TODO: 商品IDを取得して数値に変換
    const productId = 0;
    console.log(`ルーティング: /api/product/show/${productId}`);

    // 商品データを取得
    const product = findProductById(productId);
    if (!product) {
        // 商品が見つからない場合のエラーハンドリング
        return res.status(404).json({ error: "Product not found" });
    }
    // 商品データを返す
    res.json(product);
});

// GET: エンドポイント: /api/search : keyword クエリパラメータ対応
app.get('/api/search', (req, res) => {
    console.log("ルーティング: api/search");

    // TODO: 検索キーワードを取得
    const keyword = '';
    console.log("検索キーワード: " + keyword);

    const products = searchProducts(keyword);
    const data = { products }
    // JSON データを返す
    res.json(data);
});

// GET: エンドポイント: /api/product/csv_download
app.get('/api/product/csv_download', (req, res) => {
    console.log("ルーティング: /api/product/csv_download");
    // CSV ファイルのパスを指定
    const csvFilePath = __dirname + '/data/products.csv';
    // TODO: CSV ファイルをダウンロード: download()
});

// POST: エンドポイント: /api/cart/add/:id : id パスパラメータ対応
app.post('/api/cart/add/:id', (req, res) => {
    const id = req.params.id;
    console.log(`ルーティング: api/cart/add/${id}`);

    const product = findProductById(id);

    if (product) {
        // TODO: カートに追加: スプレッド構文で cartItems に product 追加
        cartItems = [];
    }

    const data = { cartItems };

    // JSON データを返す
    res.json(data);
});

// TODO: Express 起動
app.listen(PORT, HOST, () => {
    console.log(`Server running: ${BASE_URL}`);
});
