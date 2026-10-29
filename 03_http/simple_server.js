// TODO: httpモジュールをインポート: import
import http from 'http'

// TODO: HTTPサーバ作成: http.createServer()
const server = http.createServer((req, res) => {
    // ---- ここから記述 ----
    // TODO: ヘッダー
    res.writeHead(200, { 'Content-Type': 'text/plain' })

    // データ作成
    const data = {
        message: "Hello, Node Server!",
        time: new Date().toISOString(),
    }
    // JSONに変換
    const json = JSON.stringify(data, null, 2);

    // TODO: JSONレスポンス
    res.write(json)

    // TODO: レスポンス終了
    res.end()
    // ---- ここまで記述 ----
})

// TODO: サーバホスト: localhost
const HOST = "localhost";
// TODO: サーバポート: 3000
const PORT = 3000;

// TODO: サーバ起動
console.log(`🚀 Server running at http://${HOST}:${PORT}`);

// ターミナル： node server.js で起動
// サーバ停止： Ctrl + C