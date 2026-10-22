import fs from "fs";
import path from "path";

// カレントディレクトリ
const __dirname = process.cwd();
// data フォルダ
const dataDir = path.join(__dirname, "data");
// メモファイルパス
const memoFile = path.join(dataDir, "memo.json");

// コマンドマップ
const commandMap = {
    "/list": handleList,
    "/save": handleSave,
    "/clear": handleClear,
};

// dataフォルダがなければ作成
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// メモ読み込み
let memos = loadFile(memoFile);

// TODO: コンソール表示（標準出力）
// process.stdout.write("メモを入力してください（空Enterで保存 / Ctrl+Cで終了）\n");
// process.stdout.write("コマンド: /list → 一覧表示, /save → 保存 /clear → 全削除\n> ");

// ===============================
// 通常入力処理（dataイベント）
// ===============================
// TODO: コンソール入力（標準入力）: Enterで data イベント発火
process.stdin.on("", (input) => {
    // 入力テキスト取得
    const text = input.toString().trim();

    // 空Enterで終了
    if (!text) {
        // メモ保存
        saveFile(memoFile, memos);
        // プロセス終了
        process.exit(0);
    }

    // 先頭が「/」入力コマンドなら無視（readable 側で処理）
    if (text.startsWith("/")) {
        process.stdout.write("> ");
        return;
    }

    // メモ追加
    const memo = {
        id: Date.now(),
        text,
        createdAt: new Date().toLocaleString(),
    };
    memos.push(memo);

    console.log(`✅ 追加: ${text}`);
    process.stdout.write("> ");
});

// ===============================
// readableイベント（コマンド検出）
// ===============================
// TODO: コマンド入力検出：readable イベントで処理
process.stdin.on("", () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        // コマンド取得
        const cmd = chunk.toString().trim();

        // コマンドテーブルに存在する場合だけ実行
        const action = commandMap[cmd];
        if (action) action();
    }
});


// ===============================
// コマンド関数群
// ===============================
// /list コマンド処理
function handleList() {
    console.log("\n📜 現在のメモ一覧:");
    if (memos.length === 0) {
        console.log("(メモなし)");
    } else {
        memos.forEach((m) => {
            console.log(`🕒 ${m.createdAt} - ${m.text}`);
        });
    }
    // プロンプト表示
    process.stdout.write("\n> ");
}

// /save コマンド処理
function handleSave() {
    saveFile(memoFile, memos);
    // プロンプト表示
    process.stdout.write("> ");
}

// /clear コマンド処理
function handleClear() {
    // メモメモリ削除
    memos = [];
    console.log("\n🧹 すべてのメモを削除しました。（Enterで保存）");
    // プロンプト表示
    process.stdout.write("> ");
}


// ===============================
// JSON読み込み関数
// ===============================
function loadFile(file) {
    let data = [];
    if (fs.existsSync(file)) {
        try {
            // ファイル読み込み
            const content = fs.readFileSync(file, "utf-8");
            // JSONパース
            data = JSON.parse(content);
        } catch {
            console.error("⚠️ JSONの読み込みに失敗しました。ファイルをリセットします。");
            data = [];
        }
    }
    return data;
}

// ===============================
// メモ保存
// ===============================
function saveFile(file, data) {
    // JSONに変換
    const json = JSON.stringify(data, null, 2);
    // ファイル保存
    fs.writeFileSync(file, json, "utf-8");
    // コンソール表示
    console.log("\n📁 保存完了:", file);
}