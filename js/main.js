function parseNewsDateKey(dateStr) {
    const m = String(dateStr).match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (!m) return 0;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. ニュース読み込み (JSON方式)
    // ----------------------------------------------------
    async function loadNews() {
        const container = document.getElementById('news-container');
        if (!container) {
            console.error("news-container が見つかりません");
            return;
        }

        try {
            const response = await fetch('./news.json');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('news.json は配列である必要があります');

            data.sort((a, b) => parseNewsDateKey(b.date) - parseNewsDateKey(a.date));

            const latestNews = data.slice(0, 3);
            container.innerHTML = '';

            latestNews.forEach(item => {
                const card = document.createElement('a');
                // パスを news.json のデータに合わせて調整
                card.href = `./history/news-2026/${item.file}`;
                card.className = 'news-card';
                card.innerHTML = `
                <div class="news-card-body">
                    <span class="news-card-date">${item.date}</span>
                    <p class="news-card-text">${item.title}</p>
                </div>
            `;
                container.appendChild(card);
            });
            console.log("ニュースの読み込みに成功しました");
        } catch (error) {
            console.error("ニュースの読み込みに失敗しました:", error);
            container.innerHTML = '<p>お知らせはありません。</p>';
        }
    }

    // ----------------------------------------------------
    // 2. ヘッダー背景制御 (IntersectionObserver)
    // ----------------------------------------------------
    const header = document.querySelector('#header-js');
    const heroSection = document.querySelector('#hero-section');

    if (header && heroSection) {
        const observerOptions = {
            root: null,
            rootMargin: "-80px 0px 0px 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    header.classList.add('is-hero');
                } else {
                    header.classList.remove('is-hero');
                }
            });
        }, observerOptions);

        observer.observe(heroSection);
    }

    // ----------------------------------------------------
    // 3. 検索バーアニメーション
    // ----------------------------------------------------
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');

    if (searchBar && searchInput) {
        searchBar.addEventListener('click', function () {
            if (!this.classList.contains('is-open')) {
                this.classList.add('is-open');
                searchInput.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!searchBar.contains(e.target)) {
                searchBar.classList.remove('is-open');
                searchInput.value = "";
            }
        });
    }

    // ----------------------------------------------------
    // 4. ハンバーガーメニュー制御
    // ----------------------------------------------------
    const hamburger = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            nav.classList.toggle('is-open');
        });

        const navLinks = document.querySelectorAll('.c-nav__item a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-active');
                nav.classList.remove('is-open');
            });
        });
    }

    // ----------------------------------------------------
    // 5. 「前のページに戻る」（.js-history-back）
    // 履歴が効かない場合（直リンク・新しいタブなど）は data-fallback-href または ../index.html へ
    // ----------------------------------------------------
    document.querySelectorAll('.js-history-back').forEach((btn) => {
        btn.type = 'button';
        btn.addEventListener('click', () => {
            const fallback = btn.getAttribute('data-fallback-href') || '../index.html';
            const ref = document.referrer;
            let useHistoryBack = false;
            if (ref && window.history.length > 1) {
                try {
                    const refUrl = new URL(ref);
                    const here = new URL(location.href);
                    const sameOrigin = refUrl.origin === here.origin;
                    const differentDoc =
                        refUrl.pathname !== here.pathname || refUrl.search !== here.search;
                    useHistoryBack = sameOrigin && differentDoc;
                } catch (_) {
                    useHistoryBack = false;
                }
            }
            if (useHistoryBack) {
                history.back();
            } else {
                location.assign(fallback);
            }
        });
    });

    // ----------------------------------------------------
    // 6. 「トップに戻る」ボタン制御
    // ----------------------------------------------------
    const backToTop = document.getElementById('js-back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('is-visible');
            } else {
                backToTop.classList.remove('is-visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----------------------------------------------------
    // 7. ニュースポップアップ（モーダル）制御
    // ----------------------------------------------------
    const newsTrigger = document.getElementById('js-news-trigger');
    const newsModal = document.getElementById('js-news-modal');
    const modalClose = document.getElementById('js-modal-close');
    const modalBackdrop = document.getElementById('js-modal-backdrop');

    if (newsTrigger && newsModal && modalClose && modalBackdrop) {
        const closeModal = () => {
            newsModal.classList.remove('is-active');
            document.body.classList.remove('is-modal-open');
            newsModal.setAttribute('aria-hidden', 'true');
        };

        newsTrigger.addEventListener('click', () => {
            newsModal.classList.add('is-active');
            document.body.classList.add('is-modal-open');
            newsModal.setAttribute('aria-hidden', 'false');
        });

        modalClose.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
    }

    // ----------------------------------------------------
    // 8. スライダー制御
    // ----------------------------------------------------
    const track = document.getElementById('track');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    if (track && prev && next) {
        const getStep = () => Math.max(160, Math.floor(track.clientWidth * 0.6));

        prev.addEventListener('click', () => {
            track.scrollBy({ left: -getStep(), behavior: 'smooth' });
        });

        next.addEventListener('click', () => {
            track.scrollBy({ left: getStep(), behavior: 'smooth' });
        });

        window.addEventListener('keydown', e => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            if (e.key === 'ArrowLeft') {
                track.scrollBy({ left: -getStep(), behavior: 'smooth' });
            }
            if (e.key === 'ArrowRight') {
                track.scrollBy({ left: getStep(), behavior: 'smooth' });
            }
        });
    }

    // ----------------------------------------------------
    // 9. 記録ページ News一覧（history/index.html）
    // ----------------------------------------------------
    async function loadHistoryNewsList() {
        const listEl = document.getElementById('history-news-list');
        const pagerEl = document.getElementById('history-news-pager');
        const prevBtn = document.getElementById('history-news-pager-prev');
        const nextBtn = document.getElementById('history-news-pager-next');
        const labelEl = document.getElementById('history-news-pager-label');
        if (!listEl || !pagerEl || !prevBtn || !nextBtn || !labelEl) return;

        // ニュース一覧の最大保有可能数
        const perPage = 7;
        let items = [];
        let page = 1;

        const render = () => {
            const total = items.length;
            const totalPages = Math.max(1, Math.ceil(total / perPage));
            page = Math.min(Math.max(1, page), totalPages);
            const start = (page - 1) * perPage;
            const slice = items.slice(start, start + perPage);

            listEl.innerHTML = '';
            slice.forEach((item) => {
                const li = document.createElement('li');
                li.className = 'history-news__item';
                const a = document.createElement('a');
                a.className = 'history-news__card';
                a.href = `./news-2026/${item.file}`;
                a.innerHTML = `<span class="history-news__card-date">${escapeHtml(item.date)}</span><span class="history-news__card-title">${escapeHtml(item.title)}</span>`;
                li.appendChild(a);
                listEl.appendChild(li);
            });

            labelEl.textContent = `${page} / ${totalPages}`;
            prevBtn.disabled = page <= 1;
            nextBtn.disabled = page >= totalPages;
            pagerEl.hidden = totalPages <= 1;
        };

        prevBtn.addEventListener('click', () => {
            page -= 1;
            render();
        });
        nextBtn.addEventListener('click', () => {
            page += 1;
            render();
        });

        try {
            const response = await fetch('../news.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('news.json は配列である必要があります');
            items = [...data].sort((a, b) => parseNewsDateKey(b.date) - parseNewsDateKey(a.date));
            if (items.length === 0) {
                listEl.innerHTML = '<li class="history-news__item history-news__item--empty"><p class="history-news__empty-msg">お知らせはありません。</p></li>';
                pagerEl.hidden = true;
                return;
            }
            page = 1;
            render();
        } catch (error) {
            console.error('記録ページニュースの読み込みに失敗しました:', error);
            listEl.innerHTML = '<li class="history-news__item history-news__item--empty"><p class="history-news__empty-msg">一覧を読み込めませんでした。</p></li>';
            pagerEl.hidden = true;
        }
    }

    loadNews();
    loadHistoryNewsList();
});