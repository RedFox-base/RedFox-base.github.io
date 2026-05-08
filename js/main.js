document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ハンバーガーメニュー制御
    // ----------------------------------------------------
    const hamburger = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            nav.classList.toggle('is-open');
        });

        // リンククリック時にメニューを閉じる
        const navLinks = document.querySelectorAll('.c-nav__item a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-active');
                nav.classList.remove('is-open');
            });
        });
    }

    // ----------------------------------------------------
    // 「トップに戻る」ボタン制御
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------
    // ニュースポップアップ（モーダル）制御
    // ----------------------------------------------------
    const newsTrigger = document.getElementById('js-news-trigger');
    const newsModal = document.getElementById('js-news-modal');
    const modalClose = document.getElementById('js-modal-close');
    const modalBackdrop = document.getElementById('js-modal-backdrop');

    if (newsTrigger && newsModal && modalClose && modalBackdrop) {
        // 開く
        newsTrigger.addEventListener('click', () => {
            newsModal.classList.add('is-active');
            document.body.classList.add('is-modal-open');
            newsModal.setAttribute('aria-hidden', 'false');
        });

        // 閉じる関数
        const closeModal = () => {
            newsModal.classList.remove('is-active');
            document.body.classList.remove('is-modal-open');
            newsModal.setAttribute('aria-hidden', 'true');
        };

        modalClose.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
    }

    // ----------------------------------------------------
    // 商品スライダー (c-scroller) 制御
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
            // フォーム入力中はスクロールさせない
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            if (e.key === 'ArrowLeft') {
                track.scrollBy({ left: -getStep(), behavior: 'smooth' });
            }
            if (e.key === 'ArrowRight') {
                track.scrollBy({ left: getStep(), behavior: 'smooth' });
            }
        });
    }
});
