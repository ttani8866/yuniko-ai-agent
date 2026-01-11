// ========================================
// ヘッダーのスクロール効果
// ========================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// モバイルメニューの開閉
// ========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// メニューリンクをクリックしたら閉じる
const navLinks = document.querySelectorAll('.nav-list a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ========================================
// スムーススクロール
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 受講生の声スライダー
// ========================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.dot');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
let currentTestimonial = 0;

function showTestimonial(index) {
    // すべてのカードを非表示
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    // 現在のカードを表示
    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
    }
    if (testimonialDots[index]) {
        testimonialDots[index].classList.add('active');
    }
    
    currentTestimonial = index;
}

function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    const prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(prevIndex);
}

// ボタンイベント
if (testimonialNext) {
    testimonialNext.addEventListener('click', nextTestimonial);
}

if (testimonialPrev) {
    testimonialPrev.addEventListener('click', prevTestimonial);
}

// ドットクリックイベント
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// 自動スライド（5秒間隔）
let testimonialInterval = setInterval(nextTestimonial, 5000);

// ホバー時に自動スライドを停止
const testimonialsSlider = document.querySelector('.testimonials-slider');
if (testimonialsSlider) {
    testimonialsSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialsSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    });
}

// ========================================
// FAQアコーディオン
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // すべてのFAQを閉じる
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqQuestion = faqItem.querySelector('.faq-question');
                if (faqQuestion) {
                    faqQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // クリックしたFAQを開く（閉じていた場合）
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    }
});

// ========================================
// スクロールアニメーション（フェードイン）
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
const animateElements = document.querySelectorAll('.problem-card, .feature-card, .timeline-item, .pricing-card');

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ========================================
// フォーム送信（プレースホルダー）
// ========================================
const ctaButtons = document.querySelectorAll('a[href="#cta"], a[href="#contact"]');

ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // 実際のフォーム送信処理はここに実装
        console.log('CTA clicked');
        // 例: モーダルを開く、フォームページに遷移するなど
    });
});

// ========================================
// パフォーマンス最適化: 画像の遅延読み込み
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    // ブラウザがネイティブのlazy loadingをサポートしている場合
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // フォールバック: Intersection Observerを使用
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// ページ読み込み完了時の処理
// ========================================
window.addEventListener('load', () => {
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
    
    console.log('VibeCoding LP loaded successfully');
});

// ========================================
// エラーハンドリング
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

// ========================================
// アクセシビリティ: キーボードナビゲーション
// ========================================
document.addEventListener('keydown', (e) => {
    // ESCキーでモバイルメニューを閉じる
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
    
    // 矢印キーでスライダーを操作
    if (e.key === 'ArrowLeft' && document.querySelector('.testimonials-slider:hover')) {
        prevTestimonial();
    }
    if (e.key === 'ArrowRight' && document.querySelector('.testimonials-slider:hover')) {
        nextTestimonial();
    }
});

