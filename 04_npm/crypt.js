// TODO: カスタム暗号化モジュールのインポート: ./utils/cryptoUtil.js
// メソッド: encrypt, decrypt, generateKey

// 鍵（32文字＝256bit）、初期化ベクトル（16文字＝128bit）
const message = "Hello";
const key = generateKey("mySecretKey");
// TODO: メッセージを暗号化
const encrypted = "";
// TODO: 暗号文を復号化
const decrypted = "";

// 結果表示
let result = { message, encrypted, decrypted };
console.table(result);