/**
 * ============================================================
 *  scripts.js — Portfolio CV Daffa Aria
 *  Modern | Modular | Performant
 * ============================================================
 */

(function () {
    'use strict';

    // ============================================================
    //  1. DOM REFS
    // ============================================================
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const footerYear = document.getElementById('footer-year');
    const backToTop = document.getElementById('backToTop');
    const scrollProgress = document.getElementById('scrollProgress');

    // ============================================================
    //  2. FOOTER YEAR
    // ============================================================
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ============================================================
    //  3. MOBILE MENU
    // ============================================================
    if (navbarToggle && navbarMenu) {
        const toggleMenu = (open) => {
            const isOpen = open ?? navbarToggle.getAttribute('aria-expanded') === 'false';
            navbarToggle.setAttribute('aria-expanded', isOpen);
            navbarMenu.classList.toggle('open', isOpen);
            navbarToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
        };

        navbarToggle.addEventListener('click', () => {
            toggleMenu();
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (navbarToggle.getAttribute('aria-expanded') === 'true') {
                    toggleMenu(false);
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (navbarToggle.getAttribute('aria-expanded') === 'true') {
                if (!navbar.contains(e.target)) {
                    toggleMenu(false);
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbarToggle.getAttribute('aria-expanded') === 'true') {
                toggleMenu(false);
                navbarToggle.focus();
            }
        });
    }

    // ============================================================
    //  4. SCROLL SPY
    // ============================================================
    const updateActiveLink = () => {
        const scrollY = window.scrollY + 100;
        let activeId = null;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                activeId = section.id;
            }
        });

        if (!activeId && sections.length > 0) {
            activeId = sections[0].id;
        }

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${activeId}`;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'section' : '');
        });
    };

    let scrollTick = false;
    const onScroll = () => {
        if (!scrollTick) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                scrollTick = false;
            });
            scrollTick = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveLink, { passive: true });
    window.addEventListener('load', updateActiveLink);

    // ============================================================
    //  5. SMOOTH SCROLL
    // ============================================================
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 64;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // ============================================================
    //  6. KEYBOARD TRAP
    // ============================================================
    if (navbarToggle && navbarMenu) {
        navbarMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = navbarMenu.querySelectorAll('a[href], button:not([disabled])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // ============================================================
    //  7. SKILL BARS — Intersection Observer
    // ============================================================
    if ('IntersectionObserver' in window) {
        const skillBars = document.querySelectorAll('.skill-bar__fill');
        const skillObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.style.width;
                        bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        bar.style.width = '0%';
                        void bar.offsetWidth;
                        bar.style.width = width;
                        skillObserver.unobserve(bar);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );
        skillBars.forEach((bar) => skillObserver.observe(bar));
    }

    // ============================================================
    //  8. DARK MODE TOGGLE
    // ============================================================
    (function darkMode() {
        const toggle = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');
        if (!toggle) return;

        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored === 'dark' || (!stored && prefersDark);

        if (isDark) {
            document.body.classList.add('dark-mode');
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const dark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    })();

    // ============================================================
    //  9. SCROLL PROGRESS
    // ============================================================
    const updateProgress = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
            scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
        }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    // ============================================================
    //  10. BACK TO TOP
    // ============================================================
    const toggleBackToTop = () => {
        if (backToTop) {
            const visible = window.scrollY > 400;
            backToTop.classList.toggle('visible', visible);
        }
    };

    if (backToTop) {
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    //  11. AOS
    // ============================================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 50,
        });
    }

    // ============================================================
    //  12. TYPED.JS
    // ============================================================
    if (typeof Typed !== 'undefined') {
        const typedElement = document.getElementById('typed-text');
        if (typedElement) {
            new Typed('#typed-text', {
                strings: [
                    'Full-Stack Developer',
                    'Data Analyst',
                    'React Enthusiast',
                    'Problem Solver',
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 1800,
                startDelay: 600,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: false,
            });
        }
    }

    // ============================================================
    //  13. BOOTSTRAP TOOLTIP
    // ============================================================
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((el) => new bootstrap.Tooltip(el));
    }

    // ============================================================
    //  14. TOAST NOTIFICATION
    // ============================================================
    if (typeof bootstrap !== 'undefined') {
        const toastEl = document.getElementById('liveToast');
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl, {
                delay: 5000,
                animation: true,
            });
            setTimeout(() => {
                toast.show();
            }, 1500);
        }
    }

    // ============================================================
    //  15. COUNTER ANIMATION
    // ============================================================
    (function counterAnimation() {
        const counterEl = document.getElementById('experienceCounter');
        if (!counterEl) return;

        const target = 3;
        let current = 0;
        const increment = target / 30;
        const duration = 800;
        const stepTime = Math.floor(duration / 30);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && current === 0) {
                        const interval = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(interval);
                            }
                            counterEl.textContent = Math.floor(current);
                        }, stepTime);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(counterEl);
    })();

    // ============================================================
    //  16. INITIALIZATION
    // ============================================================
    updateProgress();
    toggleBackToTop();
    updateActiveLink();

    console.log('✨ Portfolio Daffa Aria — siap digunakan!');
})();