// TODO: httpモジュールをインポート: import

// TODO: HTTPサーバ作成: http.createServer()
    // ---- ここから記述 ----
    // TODO: ヘッダー

    // データ作成
    const data = {
        message: "Hello, Node Server!",
        time: new Date().toISOString(),
    }
    // JSONに変換
    const json = JSON.stringify(data, null, 2);

    // TODO: JSONレスポンス

    // TODO: レスポンス終了
    // ---- ここまで記述 ----

// TODO: サーバホスト: localhost
const HOST = "";
// TODO: サーバポート: 3000
const PORT = 0;

// TODO: サーバ起動
console.log(`🚀 Server running at http://${HOST}:${PORT}`);

// ターミナル： node server.js で起動
// サーバ停止： Ctrl + C