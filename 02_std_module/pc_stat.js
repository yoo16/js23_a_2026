// TODO: osモジュールインポート

// OS情報取得
const type = os.type();
const platform = os.platform();
const architecture = os.arch();
const core = os.cpus().length;
const memory = (os.totalmem() / 1024 ** 3).toFixed(2);
const freeMemory = (os.freemem() / 1024 ** 3).toFixed(2);
const userInfo = os.userInfo();
const home = userInfo.homedir;
const userName = userInfo.username;
const uid = userInfo.uid;
const gid = userInfo.gid;
const shell = userInfo.shell;

// データをオブジェクト形式でまとめる
const systemInfo = {
    "OS Type": type,
    "Platform": platform,
    "User Name": userName,
    "Home Directory": home,
    "Shell": shell || "N/A",
    "Architecture": architecture,
    "CPU Cores": core,
    "Total Memory (GB)": memory,
    "Free Memory (GB)": freeMemory,
    "UID": uid || "N/A",
    "GID": gid || "N/A",
};

// 表形式で出力
console.table(systemInfo);