// URL解析
const url = new URL(location.href);
const pathParts = url.pathname.split("/");
// 最後の部分が 商品ID
const productId = pathParts.pop();
console.log("Product ID:", productId);

try {
    // ✅ 商品データを API から取得
    const res = await fetch(`/api/product/show/${productId}`);
    // 商品が見つからない場合（404）はエラー表示
    if (!res.ok) throw new Error(`Product not found: ${productId}`);
    const product = await res.json();
    // 商品詳細レンダリング
    renderProductDetail(product);
} catch (err) {
    console.error("API Fetch Error:", err);

    const detail = document.getElementById("product-detail");
    detail.innerHTML = `
            <div class="rounded-2xl bg-red-50 p-10 text-center">
                <p class="font-medium text-red-700">商品情報を取得できませんでした</p>
                <a href="/" class="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline">
                    商品一覧に戻る
                </a>
            </div>
        `;
}

// ✅ 商品詳細を描画（テンプレートHTML）
function renderProductDetail(p) {
    const detail = document.getElementById("product-detail");

    // パンくずリストに商品名を表示
    document.getElementById("breadcrumb-name").textContent = p.name;
    document.title = `${p.name} - Spring Apparel`;

    // カテゴリバッジの色
    const badgeClass = p.category === "men"
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : "bg-rose-50 text-rose-700 ring-rose-200";

    // SALE / NEW などのタグ
    let tagHtml = "";
    if (p.tag) {
        tagHtml = `
                <span class="absolute left-4 top-4 z-10 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold tracking-wide text-white">${p.tag}</span>
            `;
    }

    detail.innerHTML = `
            <div class="fade-in grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div class="relative overflow-hidden rounded-3xl bg-stone-100 ring-1 ring-stone-200">
                    ${tagHtml}
                    <img src="/${p.image}" alt="${p.name}" class="aspect-square w-full object-cover">
                </div>

                <div>
                    <span class="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ring-1 ${badgeClass}">${p.category}</span>
                    <h2 class="mt-5 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">${p.name}</h2>
                    <p class="mt-4 text-lg leading-relaxed text-stone-600">${p.note}</p>
                    <p class="mt-8 text-3xl font-semibold text-stone-900">¥${p.price.toLocaleString()}</p>

                    <div class="mt-8 flex flex-wrap gap-3">
                        <button id="add-cart-btn"
                            class="rounded-full bg-stone-900 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-emerald-600 active:scale-95">
                            Add to cart
                        </button>
                        <a href="/"
                            class="rounded-full border border-stone-300 bg-white px-8 py-3.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900">
                            Continue shopping
                        </a>
                    </div>
                </div>
            </div>
        `;

    // カート追加ボタン
    document.getElementById("add-cart-btn").addEventListener("click", () => addCart(p.id));
}

// ✅ カートに追加
async function addCart(id) {
    try {
        const res = await fetch(`/api/cart/add/${id}`, { method: "POST" });
        const data = await res.json();

        // カート個数表示を更新
        const count = document.getElementById("cart-count");
        count.classList.remove("hidden");
        count.innerText = data.cartItems.length;
    } catch (err) {
        console.error("カート追加エラー:", err);
        alert("カートの追加に失敗しました。");
    }
}
