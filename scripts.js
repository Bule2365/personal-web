/**
 * ============================================================
 *  scripts.js — Portfolio CV Daffa Aria
 *  Fungsi: navigasi, mobile menu, scroll spy, scroll reveal
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

    // ============================================================
    //  2. SET FOOTER YEAR
    // ============================================================
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ============================================================
    //  3. MOBILE MENU TOGGLE
    // ============================================================
    if (navbarToggle && navbarMenu) {
        const toggleMenu = (open) => {
            const isOpen = open ?? navbarToggle.getAttribute('aria-expanded') === 'false';
            navbarToggle.setAttribute('aria-expanded', isOpen);
            navbarMenu.classList.toggle('open', isOpen);
            navbarToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
        };

        navbarToggle.addEventListener('click', () => {
            const isOpen = navbarToggle.getAttribute('aria-expanded') === 'false';
            toggleMenu(isOpen);
        });

        // Tutup menu saat link diklik (mobile)
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (navbarToggle.getAttribute('aria-expanded') === 'true') {
                    toggleMenu(false);
                }
            });
        });

        // Tutup menu saat klik di luar
        document.addEventListener('click', (e) => {
            if (navbarToggle.getAttribute('aria-expanded') === 'true') {
                const target = e.target;
                if (!navbar.contains(target)) {
                    toggleMenu(false);
                }
            }
        });

        // Tutup menu saat escape ditekan
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbarToggle.getAttribute('aria-expanded') === 'true') {
                toggleMenu(false);
                navbarToggle.focus();
            }
        });
    }

    // ============================================================
    //  4. SCROLL SPY — aktifkan link nav sesuai section
    // ============================================================
    const updateActiveLink = () => {
        const scrollY = window.scrollY;
        const offset = 120;

        let activeId = null;
        sections.forEach((section) => {
            const top = section.offsetTop - offset;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                activeId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${activeId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'section');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveLink, { passive: true });
    window.addEventListener('load', updateActiveLink);

    // ============================================================
    //  5. SMOOTH SCROLL UNTUK NAV LINK
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
    //  6. KEYBOARD NAVIGATION — trap focus di mobile menu
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
    //  7. INTERSECTION OBSERVER — animasi skill bar saat masuk viewport
    // ============================================================
    if ('IntersectionObserver' in window) {
        const skillBars = document.querySelectorAll('.skill-bar__fill');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.style.width;
                        bar.style.transition = 'width 0.8s ease';
                        bar.style.width = '0%';
                        void bar.offsetWidth;
                        bar.style.width = width;
                        observer.unobserve(bar);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );

        skillBars.forEach((bar) => observer.observe(bar));
    }

    // ============================================================
    //  8. SCROLL REVEAL — Fade In/Out dengan Intersection Observer
    // ============================================================
    (function scrollReveal() {
        'use strict';

        function initReveal() {
            const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');

            if (revealElements.length === 0) {
                console.log('Scroll Reveal: Tidak ada elemen dengan kelas reveal');
                return;
            }

            console.log(`Scroll Reveal: ${revealElements.length} elemen ditemukan`);

            if (!('IntersectionObserver' in window)) {
                revealElements.forEach(el => {
                    el.classList.add('visible');
                    el.classList.remove('hidden');
                });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const element = entry.target;
                    if (entry.isIntersecting) {
                        element.classList.remove('hidden');
                        element.classList.add('visible');
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            });

            revealElements.forEach(element => {
                element.classList.add('hidden');
                element.classList.remove('visible');
                observer.observe(element);
            });

            // Tampilkan elemen yang sudah terlihat di awal
            setTimeout(() => {
                revealElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        element.classList.remove('hidden');
                        element.classList.add('visible');
                    }
                });
            }, 300);

            // Hero selalu tampil
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.classList.remove('hidden');
                hero.classList.add('visible');
            }

            document.querySelectorAll('.initial-visible').forEach(el => {
                el.classList.remove('hidden');
                el.classList.add('visible');
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initReveal);
        } else {
            initReveal();
        }
    })();

    // ============================================================
    //  9. DARK MODE TOGGLE
    // ============================================================
    (function darkMode() {
        const toggle = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');
        if (!toggle) return;

        // Cek preferensi tersimpan
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

    console.log('Portfolio CV — siap digunakan!');
})();