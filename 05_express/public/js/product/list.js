(() => {
    const list = document.getElementById("product-list");
    const keywordElement = document.getElementById("keyword");
    const resultCount = document.getElementById("result-count");

    let cartItems = [];

    // ============================
    // 商品 API 取得
    // ============================
    async function fetchProducts() {
        try {
            // 現在のURLから GETパラメータを読み取る
            const params = new URLSearchParams(location.search);
            const keyword = params.get("keyword");

            let res;

            if (keyword) {
                // keyword がある → 検索API
                res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);

                // 検索ボックスにキーワードをセット
                keywordElement.value = keyword;
            } else {
                // keyword がない → 商品一覧API
                res = await fetch("/api/product/list");

                // 検索ボックスをクリア
                keywordElement.value = "";
            }

            // JSON データを取得
            const data = await res.json();

            // 商品一覧をレンダリング
            renderProducts(data.products, keyword);

        } catch (e) {
            console.error("商品API取得エラー:", e);
            list.innerHTML = `
                <p class="col-span-full rounded-2xl bg-red-50 p-6 text-center text-sm font-medium text-red-700">
                    商品情報を取得できませんでした
                </p>
            `;
        }
    }

    async function addCart(productId) {
        console.log("カート追加:", productId);
        try {
            const res = await fetch(`/api/cart/add/${productId}`, {
                method: "POST",
            });
            const data = await res.json();
            console.log("カート追加結果:", data);

            // カート内商品数を更新
            cartItems = data.cartItems;

            // カート個数表示を更新
            document.getElementById("cart-count").classList.remove("hidden");
            document.getElementById("cart-count").innerText = cartItems.length;
        } catch (e) {
            console.error("カート追加エラー:", e);
            alert("カートの追加に失敗しました。");
        }
    }

    // ============================
    // 商品カード生成
    // ============================
    function renderProducts(products, keyword) {
        list.innerHTML = "";
        let html = "";

        // 件数表示
        if (resultCount) {
            resultCount.textContent = keyword
                ? `"${keyword}" の検索結果: ${products.length} items`
                : `${products.length} items`;
        }

        // 商品が見つからない場合
        if (products.length === 0) {
            list.innerHTML = `
                <div class="col-span-full rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                    <p class="text-lg font-medium text-stone-700">該当する商品が見つかりませんでした</p>
                    <a href="/" class="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline">
                        すべての商品を見る
                    </a>
                </div>
            `;
            productElements = [];
            return;
        }

        products.forEach((p) => {
            // カテゴリバッジの色
            const badgeClass = p.category === "men"
                ? "bg-sky-50 text-sky-700 ring-sky-200"
                : "bg-rose-50 text-rose-700 ring-rose-200";

            // SALE / NEW などのタグ
            const tagHtml = p.tag
                ? `<span class="absolute left-3 top-3 z-10 rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">${p.tag}</span>`
                : "";

            html += `
            <article class="product ${p.category} group fade-in flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/70">
                <div class="relative cursor-pointer overflow-hidden bg-stone-100" onclick="location.href='/product/${p.id}'">
                    ${tagHtml}
                    <img src="/${p.image}" alt="${p.name}"
                        class="aspect-square w-full object-cover transition duration-500 group-hover:scale-105">
                </div>
                <div class="info flex flex-1 flex-col p-4">
                    <span class="mb-2 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ${badgeClass}">${p.category}</span>
                    <h3 class="name font-semibold text-stone-900">
                        <a href="/product/${p.id}" class="hover:text-emerald-700">${p.name}</a>
                    </h3>
                    <p class="note mt-1 line-clamp-2 text-sm text-stone-500">${p.note}</p>
                    <div class="mt-auto flex items-center justify-between gap-2 pt-4">
                        <p class="price text-lg font-semibold text-stone-900">¥${p.price.toLocaleString()}</p>
                        <button
                            class="add-cart-btn rounded-full bg-stone-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 active:scale-95"
                            data-id="${p.id}"
                            >
                            Add to cart
                        </button>
                    </div>
                </div>
            </article>
        `;
        });

        list.innerHTML = html;

        // NodeList 再取得
        productElements = document.querySelectorAll(".product");

        // class=add-cart-btn は動的に生成されるため、ここで登録する
        document.querySelectorAll(".add-cart-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                // 親要素の .product を辿る
                const productId = event.target.dataset.id;
                addCart(productId);
            });
        });
    }

    // ============================
    // フィルター処理
    // ============================
    let productElements = [];

    // 選択中のフィルターボタンを強調
    function setActiveFilter(activeId) {
        document.querySelectorAll(".filter-btn").forEach(button => {
            button.classList.toggle("is-active", button.id === activeId);
        });
    }

    // All
    document.getElementById("all-filter-btn").addEventListener("click", () => {
        setActiveFilter("all-filter-btn");
        productElements.forEach(product => {
            product.classList.remove("hidden");
        });
    });

    // Men
    document.getElementById("men-filter-btn").addEventListener("click", () => {
        setActiveFilter("men-filter-btn");
        productElements.forEach(product => {
            product.classList.remove("hidden");
            if (!product.classList.contains('men')) {
                product.classList.add("hidden");
            }
        });
    });

    // Women
    document.getElementById("women-filter-btn").addEventListener("click", () => {
        setActiveFilter("women-filter-btn");
        productElements.forEach(product => {
            product.classList.remove("hidden");
            if (!product.classList.contains('women')) {
                product.classList.add("hidden");
            }
        });
    });

    // 初期表示（CSR: クライアントサイドレンダリング）
    document.addEventListener("DOMContentLoaded", fetchProducts);
})();
