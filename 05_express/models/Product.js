// fs, path モジュールのインポート
import fs from 'fs';
import path from 'path';
// 現在のディレクトリパスを取得
const __dirname = path.resolve();
// データファイルのパス
const filePath = path.join(__dirname, 'data', 'products.json');

// ------------------------
// 商品データを読み込む
// ------------------------
export function fetchProducts() {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

// ------------------------
// 商品IDで商品を検索
// ------------------------
export function findProductById(id) {
    const products = fetchProducts();
    return products.find(product => product.id === Number(id));
}

// ------------------------
// 商品をキーワード検索
// ------------------------
export function searchProducts(keyword) {
    keyword = keyword.toLowerCase();
    const products = fetchProducts();
    const filtered = products.filter(product => 
        product.name?.toLowerCase().includes(keyword) ||
        product.note?.toLowerCase().includes(keyword)
    );
    return filtered;
}

// エクスポート（一括エクスポートの場合）
// export { fetchProducts, findProductById, searchProducts };