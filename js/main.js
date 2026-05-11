document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. ニュース読み込み (JSON方式)
    // ----------------------------------------------------
    // main.js の loadNews 関数内
    async function loadNews() {
        const container = document.getElementById('news-container');
        if (!container) {
            console.error("news-container が見つかりません");
            return;
        }

        try {
            // パスが正しいか確認（index.htmlと同じ階層にnews.jsonがある場合）
            const response = await fetch('./news.json');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('news.json は配列である必要があります');

            const toTime = (dateStr) => {
                const m = String(dateStr).match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
                if (!m) return 0;
                return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime();
            };

            data.sort((a, b) => toTime(b.date) - toTime(a.date));

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
    // 5. 「トップに戻る」ボタン制御
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
    // 6. ニュースポップアップ（モーダル）制御
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
    // 7. スライダー制御
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

    loadNews();
});