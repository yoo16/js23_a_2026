const stack = document.getElementById("stack");
const macroQueue = document.getElementById("macroQueue");
const microQueue = document.getElementById("microQueue");
const addMacroBtn = document.getElementById("addMacro");
const addMicroBtn = document.getElementById("addMicro");
const log = document.getElementById("log");

let taskId = 1;

// お客さん（マクロタスク）
const macroTasks = [
    { name: "お弁当を買う人", code: "btn.onclick = buy" },
    { name: "コーヒーを買う人", code: "setTimeout(order, 0)" },
    { name: "公共料金を払う人", code: "form.onsubmit = pay" },
    { name: "荷物を受け取る人", code: "img.onload = show" },
    { name: "ネット予約の人", code: "setInterval(check, 1000)" }
];

// 追加作業（マイクロタスク）
const microTasks = [
    { name: "お弁当を温める", code: "promise.then(warm)" },
    { name: "袋に詰める", code: "await pack()" },
    { name: "ポイントカード確認", code: "queueMicrotask(point)" },
    { name: "レシートを渡す", code: "fetch(url).then(receipt)" },
    { name: "お箸をつける", code: "promise.finally(addChopsticks)" }
];

// ログ出力
function logMsg(msg) {
    log.innerHTML += msg + "<br>";
    log.scrollTop = log.scrollHeight;
}

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// タスク要素を作成
function createTask(type, { name, code }) {
    const task = document.createElement("div");
    task.className = `task ${type}`;
    task.innerHTML = `#${taskId++} ${name}<code>${code}</code>`;
    task.dataset.name = name;
    return task;
}

function addMicro() {
    const task = createTask("micro", pick(microTasks));
    microQueue.appendChild(task);
    logMsg(`🍱 追加作業 → ${task.dataset.name}`);
}

// 🚶 お客さんが並ぶ（マクロタスク追加）
addMacroBtn.addEventListener("click", () => {
    const task = createTask("macro", pick(macroTasks));
    macroQueue.appendChild(task);
    logMsg(`🚶 列に並んだ → ${task.dataset.name}`);
});

// 🍱 追加作業が発生（マイクロタスク追加）
addMicroBtn.addEventListener("click", addMicro);

// 🔁 店員さんの確認ループ（イベントループ）
setInterval(() => {
    if (stack.children.length > 0) return;

    let task = null;
    let type = "";

    // 追加作業（マイクロタスク）を優先。どちらも先に来た順に処理
    if (microQueue.children.length > 0) {
        task = microQueue.children[0];
        type = "micro";
    } else if (macroQueue.children.length > 0) {
        task = macroQueue.children[0];
        type = "macro";
    }

    if (!task) return;

    stack.appendChild(task);
    const name = task.dataset.name;
    logMsg(`🧑‍💼 対応開始 → ${name}`);

    // 擬似的な処理時間
    setTimeout(() => {
        logMsg(`✅ 完了 → ${name}`);
        task.remove();

        // お客さんの対応中に、追加作業が 0〜2 個発生する
        if (type === "macro") {
            const count = Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) addMicro();
        }
    }, 1500);
}, 1200);
