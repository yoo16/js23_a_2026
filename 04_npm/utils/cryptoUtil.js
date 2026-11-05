// TODO: cryptoモジュールをインポート
// const crypto = require("crypto");

// 鍵生成用関数（共通）
function generateKey(secret = "mySecretKey") {
    // TODO: SHA-256でハッシュ化し、base64エンコード後、先頭32文字を抽出
    return crypto.createHash("sha256").update(secret).digest("base64").substr(0, 32);
}

// 🔐 暗号化関数
function encrypt(text, key) {
    // 初期化ベクトル
    const iv = crypto.randomBytes(16); 
    // 暗号化オブジェクト生成
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    // データの暗号化
    let encrypted = cipher.update(text, "utf8", "base64");
    // base64形式で出力
    encrypted += cipher.final("base64");
    // IVと暗号文を結合して返す
    return iv.toString("base64") + ":" + encrypted;
}

// 🔓 復号化関数
function decrypt(encryptedData, key) {
    // IVと暗号文を分割
    const [ivBase64, encryptedText] = encryptedData.split(":");
    // 復号化オブジェクト生成
    const iv = Buffer.from(ivBase64, "base64");
    // 復号化処理
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    // データの復号化
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// TODO: エクスポート: module.exports で各メソッドを公開