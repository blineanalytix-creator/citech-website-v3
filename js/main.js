/* ============================================
   CITECH AI - Main JavaScript
   Version: 3.0
   Pattern: IIFE + Object Modules
   ============================================ */

(function () {
    'use strict';

    /* ========================================
       1. THEME MANAGER
       ======================================== */

    const ThemeManager = {
        theme: 'dark',
        elements: {},

        init() {
            this.elements = {
                html: document.documentElement,
                toggle: document.getElementById('theme-toggle'),
                toggleMobile: document.getElementById('theme-toggle-mobile')
            };

            const saved = localStorage.getItem('citech_theme');
            if (saved === 'light' || saved === 'dark') {
                this.theme = saved;
            }
            // Default bleibt 'dark' – kein OS-Override

            this.apply();
            this.attachEvents();
        },

        apply() {
            this.elements.html.setAttribute('data-theme', this.theme);
        },

        toggle() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.apply();
            localStorage.setItem('citech_theme', this.theme);
            if (NeuralBackground.canvas) {
                NeuralBackground.updateColors();
            }
        },

        attachEvents() {
            const handler = (e) => {
                e.preventDefault();
                this.toggle();
            };

            if (this.elements.toggle) {
                this.elements.toggle.addEventListener('click', handler);
            }
            if (this.elements.toggleMobile) {
                this.elements.toggleMobile.addEventListener('click', handler);
            }
        }
    };

    /* ========================================
       2. NAVIGATION
       ======================================== */

    const Navigation = {
        elements: {},

        init() {
            this.elements = {
                header: document.querySelector('.header'),
                mobileToggle: document.querySelector('.mobile-menu-toggle'),
                mobileMenu: document.querySelector('.mobile-menu'),
                dropdowns: document.querySelectorAll('.nav-dropdown'),
                mobileDropdowns: document.querySelectorAll('.mobile-dropdown')
            };

            this.setupScroll();
            this.setupMobileMenu();
            this.setupDropdowns();
            this.setupMobileDropdowns();
        },

        setupScroll() {
            let lastScroll = 0;

            const onScroll = () => {
                const scrollY = window.scrollY;
                if (this.elements.header) {
                    this.elements.header.classList.toggle('scrolled', scrollY > 50);
                }
                lastScroll = scrollY;
            };

            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        },

        setupMobileMenu() {
            if (!this.elements.mobileToggle || !this.elements.mobileMenu) return;

            this.elements.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = this.elements.mobileMenu.classList.toggle('open');
                this.elements.mobileToggle.classList.toggle('active', isOpen);
                this.elements.mobileMenu.setAttribute('aria-hidden', !isOpen);
                this.elements.header.classList.toggle('menu-open', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });

            this.elements.mobileMenu.querySelectorAll('a:not(.mobile-dropdown-toggle)').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.mobileMenu.classList.contains('open')) {
                    this.closeMobileMenu();
                }
            });
        },

        closeMobileMenu() {
            this.elements.mobileMenu.classList.remove('open');
            this.elements.mobileToggle.classList.remove('active');
            this.elements.mobileMenu.setAttribute('aria-hidden', 'true');
            this.elements.header.classList.remove('menu-open');
            document.body.style.overflow = '';
        },

        setupDropdowns() {
            this.elements.dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                if (!toggle) return;

                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isOpen = dropdown.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', isOpen);

                    this.elements.dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('open');
                            other.querySelector('.nav-dropdown-toggle')
                                ?.setAttribute('aria-expanded', 'false');
                        }
                    });
                });
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-dropdown')) {
                    this.elements.dropdowns.forEach(d => {
                        d.classList.remove('open');
                        d.querySelector('.nav-dropdown-toggle')
                            ?.setAttribute('aria-expanded', 'false');
                    });
                }
            });
        },

        setupMobileDropdowns() {
            this.elements.mobileDropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
                if (!toggle) return;

                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', dropdown.classList.contains('open'));
                });
            });
        }
    };

    /* ========================================
       3. SCROLL ANIMATIONS
       ======================================== */

    const ScrollAnimations = {
        init() {
            const elements = document.querySelectorAll('.reveal');
            if (!elements.length) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
            );

            elements.forEach(el => observer.observe(el));
        }
    };

    /* ========================================
       4. COOKIE BANNER
       ======================================== */

    const CookieBanner = {
        elements: {},

        init() {
            if (localStorage.getItem('citech_cookie_consent')) return;

            this.elements = {
                banner: document.querySelector('.cookie-banner'),
                acceptBtn: document.getElementById('cookie-accept'),
                settingsBtn: document.getElementById('cookie-settings')
            };

            if (!this.elements.banner) return;

            setTimeout(() => {
                this.elements.banner.classList.add('visible');
            }, 2000);

            this.attachEvents();
        },

        attachEvents() {
            if (this.elements.acceptBtn) {
                this.elements.acceptBtn.addEventListener('click', () => {
                    this.accept('all');
                });
            }

            if (this.elements.settingsBtn) {
                this.elements.settingsBtn.addEventListener('click', () => {
                    this.accept('necessary');
                });
            }
        },

        accept(level) {
            localStorage.setItem('citech_cookie_consent', JSON.stringify({
                level: level,
                timestamp: new Date().toISOString()
            }));
            this.elements.banner.classList.remove('visible');
        }
    };

    /* ========================================
       5. NEURAL BACKGROUND
       Multi-Page Formation Morph System
       ======================================== */

    const NeuralBackground = {
        canvas: null, ctx: null, nodes: [], flashes: [],
        animationId: null, width: 0, height: 0,
        fromIdx: 0, toIdx: 0, morphProgress: 0,
        formations: [],

        config: {
            nodeCount: 450,
            colors:      { node: {r:0,g:212,b:255}, connection: {r:0,g:180,b:220}, flash: {r:100,g:230,b:255} },
            lightColors: { node: {r:0,g:140,b:180}, connection: {r:0,g:120,b:160}, flash: {r:0,g:180,b:210} }
        },

        // CITECH Symbol SVG
        symbolPathData: "M60.38,83.55c-7.62-0.01-10.47-0.47-16.03-6.1-2.89-2.97-6.31-5.74-8.07-9.57-1.22-2.7-1.15-5.81-1.12-8.74,0.08-3.86-0.12-7.83,1.85-11.1,1.41-2.39,3.48-4.3,5.44-6.23,2.8-2.66,5.69-5.61,9.58-6.49,4.3-0.93,9.1,0.28,13.4-1.2,14.28-4.02,16.96-23.87,4.22-31.45-3.68-2.26-8.28-3.18-12.49-2.37-7.55,1.27-13.57,7.83-14.29,15.45-0.43,3.45-0.12,7.07-1.6,10.24-1.34,2.98-3.95,5.41-6.32,7.73-2.84,2.73-5.83,5.72-9.75,6.56-2.01,0.47-4.17,0.41-6.31,0.43-3.99-0.02-7.94,0.8-11.25,3.1-11.19,7.27-9.8,24.87,2.41,30.23,1.26,0.58,2.58,1.01,3.92,1.29,4,0.9,8.35,0.02,12.2,1.5,4.38,1.74,7.52,5.7,10.88,8.93,4.8,4.77,5.71,7.9,5.67,14.55-0.08,9.53,6.92,17.59,16.56,18.15,8.38,0.61,16.36-5.21,18.15-13.38,2.73-10.9-5.94-21.48-16.99-21.53h-0.05Z",
        svgW: 95, svgH: 118, logoPath: null,

        /* ---------- INIT ---------- */
        init() {
            this.canvas = document.getElementById('neural-bg-canvas');
            if (!this.canvas) return;
            this.isMobile = window.innerWidth <= 768;
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (this.reducedMotion) {
                this.canvas.style.display = 'none';
                return;
            }
            this.ctx = this.canvas.getContext('2d');
            this.updateColors();
            this.resize();
            this.logoPath = new Path2D(this.symbolPathData);
            this.formations = this.detectPage();
            this.createNodes();
            this.setupScroll();
            this.animate();
            window.addEventListener('resize', () => this.handleResize());
        },

        updateColors() {
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            this.activeColors = isDark ? this.config.colors : this.config.lightColors;
            this.darkMode = isDark;
        },

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.width = window.innerWidth;
            // Mobile: Höhe beim ersten Laden fixieren (Adressleiste ändert innerHeight)
            if (!this._initialHeight) this._initialHeight = window.innerHeight;
            this.height = this.isMobile ? this._initialHeight : window.innerHeight;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        },

        handleResize() {
            // Mobile: nur bei Breitenänderung resizen (Adressleiste ändert Höhe beim Scroll)
            const newWidth = window.innerWidth;
            if (this.isMobile && Math.abs(newWidth - this.width) < 2) return;

            this.isMobile = newWidth <= 768;
            this.resize();
            this.nodes = [];
            this.flashes = [];
            this.formations = this.detectPage();
            this.createNodes();
        },

        /* ---------- PAGE DETECTION ---------- */
        detectPage() {
            // KI-Transparenz page – Symbol → ✓ → Symbol
            if (document.querySelector('#verify-process')) {
                return [
                    { section: '.page-hero',       gen: 'genHeroSymbol',  alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#website',         gen: 'genTextCheck',   alpha: 0.32, flashRate: 0.006, connDist: 58, nodeR: 1.6, lineW: 0.42, digit: null },
                    { section: '#transparenz-cta', gen: 'genSymbolCenter',alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null }
                ];
            }
            // Newsletter page – Symbol → @
            if (document.querySelector('#newsletter-form')) {
                return [
                    { section: '.page-hero',       gen: 'genHeroSymbol',  alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#newsletter-form', gen: 'genTextAt',      alpha: 0.32, flashRate: 0.006, connDist: 58, nodeR: 1.6, lineW: 0.42, digit: null }
                ];
            }
            // Legal pages – single character, right-aligned like hero
            if (document.querySelector('.legal-content')) {
                const h1 = document.querySelector('.legal-content h1');
                const text = h1 ? h1.textContent.trim() : '';
                let gen = 'genHeroChar_para';
                if (text.includes('Datenschutz')) gen = 'genHeroChar_lock';
                else if (text.includes('Geschäftsbedingungen') || text.includes('AGB')) gen = 'genHeroChar_scale';
                return [
                    { section: '.legal-content', gen: gen, alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null }
                ];
            }
            // Tools page – Symbol → RAG → Symbol
            if (document.querySelector('#rag-section')) {
                return [
                    { section: '.page-hero',     gen: 'genHeroSymbol',   alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#rag-section',   gen: 'genTextRAG',      alpha: 0.35, flashRate: 0.008, connDist: 62, nodeR: 1.7, lineW: 0.45, digit: null },
                    { section: '#tools-cta',     gen: 'genSymbolCenter', alpha: 0.28, flashRate: 0.004, connDist: 58, nodeR: 1.5, lineW: 0.4, digit: null }
                ];
            }
            // Förderung page – AZAV → QCG → 1→5 → Symbol
            if (document.querySelector('#azav')) {
                return [
                    { section: '.page-hero',  gen: 'genHeroSymbol',    alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#azav',       gen: 'genTextAZAV',      alpha: 0.32, flashRate: 0.006, connDist: 58, nodeR: 1.6, lineW: 0.42, digit: null },
                    { section: '#qualifizierung', gen: 'genTextQCG',   alpha: 0.32, flashRate: 0.006, connDist: 58, nodeR: 1.6, lineW: 0.42, digit: null },
                    { section: '#prozess',    gen: 'genTextSteps',     alpha: 0.35, flashRate: 0.008, connDist: 62, nodeR: 1.7, lineW: 0.45, digit: null },
                    { section: '#foerder-cta', gen: 'genSymbolCenter', alpha: 0.28, flashRate: 0.004, connDist: 58, nodeR: 1.5, lineW: 0.4, digit: null }
                ];
            }
            // Beratung page – § → AI → ✓
            if (document.querySelector('.tab-wrapper')) {
                return [
                    { section: '.page-hero',    gen: 'genHeroSymbol',   alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#leistungen',   gen: 'genTextParagraph',alpha: 0.32, flashRate: 0.006, connDist: 58, nodeR: 1.6, lineW: 0.42, digit: null },
                    { section: '#beratung-cta',  gen: 'genTextCheck',   alpha: 0.35, flashRate: 0.010, connDist: 62, nodeR: 1.8, lineW: 0.45, digit: null }
                ];
            }
            // Termine page – Symbol → Q2 → Q3 → Q4 → Symbol
            if (document.querySelector('#block-1')) {
                return [
                    { section: '.page-hero', gen: 'genHeroSymbol',   alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#block-1',   gen: 'genTextQ2',       alpha: 0.32, flashRate: 0.006, connDist: 55, nodeR: 1.6, lineW: 0.4, digit: null },
                    { section: '#block-2',   gen: 'genTextQ3',       alpha: 0.32, flashRate: 0.006, connDist: 55, nodeR: 1.6, lineW: 0.4, digit: null },
                    { section: '#block-3',   gen: 'genTextQ4',       alpha: 0.32, flashRate: 0.006, connDist: 55, nodeR: 1.6, lineW: 0.4, digit: null },
                    { section: '#formate',   gen: 'genSymbolCenter', alpha: 0.28, flashRate: 0.004, connDist: 58, nodeR: 1.5, lineW: 0.4, digit: null }
                ];
            }
            // Team page – Symbol → MB → IP → Symbol
            if (document.querySelector('#marcel-batur')) {
                return [
                    { section: '.page-hero',       gen: 'genHeroSymbol',    alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#marcel-batur',    gen: 'genTextMB',        alpha: 0.50, flashRate: 0.014, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#ingo-poschmann',  gen: 'genTextIP',        alpha: 0.35, flashRate: 0.008, connDist: 62, nodeR: 1.7, lineW: 0.45, digit: null },
                    { section: '#team-cta',        gen: 'genSymbolCenter',  alpha: 0.28, flashRate: 0.004, connDist: 58, nodeR: 1.5, lineW: 0.4, digit: null }
                ];
            }
            // Kontakt page – Symbol stays, just moves to center
            if (document.querySelector('#contact-form')) {
                return [
                    { section: '.page-hero',    gen: 'genHeroSymbol',   alpha: 0.50, flashRate: 0.012, connDist: 72, nodeR: 2.0, lineW: 0.6, digit: null },
                    { section: '#contact-section', gen: 'genSymbolCenter', alpha: 0.30, flashRate: 0.004, connDist: 58, nodeR: 1.5, lineW: 0.4, digit: null }
                ];
            }
            // Schulungen page
            if (document.querySelector('#modul-1')) {
                return [
                    { section: '.page-hero', gen: 'genHeroSymbol', alpha: 0.50, flashRate: 0.014, connDist: 75, nodeR: 2.1, lineW: 0.65, digit: null },
                    { section: '#modul-1',   gen: 'genBulb',       alpha: 0.30, flashRate: 0.006, connDist: 52, nodeR: 1.5, lineW: 0.38, digit: '1' },
                    { section: '#modul-2',   gen: 'genBulb',       alpha: 0.30, flashRate: 0.006, connDist: 52, nodeR: 1.5, lineW: 0.38, digit: '2' },
                    { section: '#modul-3',   gen: 'genBulb',       alpha: 0.30, flashRate: 0.006, connDist: 52, nodeR: 1.5, lineW: 0.38, digit: '3' },
                    { section: '#modul-4',   gen: 'genBulb',       alpha: 0.30, flashRate: 0.006, connDist: 52, nodeR: 1.5, lineW: 0.38, digit: '4' },
                    { section: '#leitbild',  gen: 'genSymbolCenter', alpha: 0.28, flashRate: 0.004, connDist: 58, nodeR: 1.5, lineW: 0.4, digit: null }
                ];
            }
            // Startpage (default)
            return [
                { section: '.hero',       gen: 'genHeroSymbol', alpha: 0.55, flashRate: 0.018, connDist: 80, nodeR: 2.2, lineW: 0.7, digit: null },
                { section: '#services',   gen: 'genBrain',      alpha: 0.55, flashRate: 0.016, connDist: 78, nodeR: 2.2, lineW: 0.7, digit: null },
                { section: '#trust',      gen: 'genShield',     alpha: 0.35, flashRate: 0.006, connDist: 65, nodeR: 1.8, lineW: 0.5, digit: null },
                { section: '#modules',    gen: 'genSteps',      alpha: 0.35, flashRate: 0.007, connDist: 65, nodeR: 1.8, lineW: 0.5, digit: null },
                { section: '#foerderung', gen: 'genEuro',       alpha: 0.30, flashRate: 0.004, connDist: 60, nodeR: 1.6, lineW: 0.4, digit: null }
            ];
        },

        /* ---------- SCROLL TRACKING ---------- */
        setupScroll() {
            const update = () => {
                const sectionEls = this.formations.map(f => document.querySelector(f.section)).filter(Boolean);
                if (sectionEls.length < 2) return;
                const viewY = window.scrollY + this.height * 0.4;
                const anchors = sectionEls.map(el => el.offsetTop + el.offsetHeight * 0.35);

                if (viewY <= anchors[0]) { this.fromIdx = 0; this.toIdx = 0; this.morphProgress = 0; return; }
                if (viewY >= anchors[anchors.length - 1]) { this.fromIdx = anchors.length - 1; this.toIdx = this.fromIdx; this.morphProgress = 0; return; }

                for (let i = 0; i < anchors.length - 1; i++) {
                    if (viewY >= anchors[i] && viewY < anchors[i + 1]) {
                        this.fromIdx = i; this.toIdx = i + 1;
                        this.morphProgress = (viewY - anchors[i]) / (anchors[i + 1] - anchors[i]);
                        return;
                    }
                }
            };
            window.addEventListener('scroll', update, { passive: true });
            update();
        },

        /* ========== SHAPE GENERATORS: STARTPAGE ========== */

        genHeroSymbol(n) {
            const mobile = this.isMobile;
            const s = (this.height * (mobile ? 0.4 : 0.55)) / this.svgH;
            const oX = mobile ? (this.width - this.svgW * s) / 2 : this.width * 0.62;
            return this._pathPts(n, s, oX, (this.height - this.svgH * s) / 2);
        },
        genBrain(n) {
            const m = this.isMobile;
            const cx = this.width * 0.5, cy = this.height * 0.5;
            const rx = this.width * (m ? 0.3 : 0.22), ry = this.height * (m ? 0.18 : 0.26), p = [];
            while (p.length < n) { const a = Math.random()*Math.PI*2, r = Math.sqrt(Math.random()); p.push({x: cx+Math.cos(a)*rx*r, y: cy+Math.sin(a)*ry*r}); }
            return p;
        },
        genShield(n) {
            const m = this.isMobile;
            const cx = this.width*0.5, cy = this.height*0.46, w = this.height*(m ? 0.22 : 0.32), h = this.height*(m ? 0.3 : 0.42), p = [];
            while (p.length < n) {
                const x = cx+(Math.random()-0.5)*w, y = cy+(Math.random()-0.5)*h;
                const nx = (x-cx)/(w*0.5), ny = (y-cy)/(h*0.5);
                if (ny < -0.95) continue;
                const mx = ny < 0.2 ? 1-Math.abs(ny+0.95)*0.02 : Math.max(0, 1-(ny-0.2)/0.8);
                if (Math.abs(nx) <= mx) p.push({x, y});
            }
            return p;
        },
        genSteps(n) {
            const m = this.isMobile;
            const tw = this.width*(m ? 0.7 : 0.38), th = this.height*(m ? 0.25 : 0.4), cx = this.width*0.5, by = this.height*0.5+th*0.4;
            const sw = tw/4, g = sw*0.14, sx = cx-tw/2, p = [];
            while (p.length < n) {
                const s = Math.floor(Math.random()*4), sH = th*(0.35+s*0.2);
                p.push({x: sx+s*sw+g+Math.random()*(sw-g*2), y: by-sH+Math.random()*sH});
            }
            return p;
        },
        genEuro(n) {
            const m = this.isMobile;
            const cx = this.width*0.5, cy = this.height*0.5, r = this.height*(m ? 0.15 : 0.22), p = [];
            while (p.length < n) {
                const x = cx+(Math.random()-0.5)*r*2.6, y = cy+(Math.random()-0.5)*r*2.6;
                const dx = x-(cx+r*0.05), dy = y-cy, d = Math.sqrt(dx*dx+dy*dy), a = Math.atan2(dy, dx);
                const isArc = d >= r*0.72 && d <= r && (a > 0.55 || a < -0.55);
                const bW = r*0.75, bH = r*0.065;
                const isBar = (Math.abs(y-(cy-r*0.17))<bH || Math.abs(y-(cy+r*0.17))<bH) && x>=cx-bW*0.55 && x<=cx+bW*0.35;
                if (isArc || isBar) p.push({x, y});
            }
            return p;
        },

        /* ========== SHAPE GENERATORS: SCHULUNGEN ========== */

        // Lightbulb (SVG Path2D) – centered, used for all 4 modules
        bulbPath: null,
        genBulb(n) {
            if (!this.bulbPath) {
                // Classic lightbulb: glass dome + narrow base + screw lines
                this.bulbPath = new Path2D(
                    'M50,5 C22,5 5,26 5,54 C5,74 20,86 30,92 L28,106 L34,106 L34,112 L66,112 L66,106 L72,106 L70,92 C80,86 95,74 95,54 C95,26 78,5 50,5 Z' +
                    ' M32,106 L68,106 L68,112 L32,112 Z' +
                    ' M34,116 L66,116 L64,120 L36,120 Z'
                );
            }
            const targetH = this.height * (this.isMobile ? 0.35 : 0.55);
            const scale = targetH / 125; // path viewbox ~100x125
            const oX = (this.width - 100 * scale) / 2;
            const oY = (this.height - 125 * scale) / 2;
            return this._genInsideBulb(n, scale, oX, oY);
        },

        _genInsideBulb(n, scale, oX, oY) {
            const bW = 100 * scale, bH = 125 * scale, p = [];
            let att = 0;
            while (p.length < n && att < n * 30) {
                att++;
                const px = oX + Math.random() * bW, py = oY + Math.random() * bH;
                this.ctx.save(); this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                const inside = this.ctx.isPointInPath(this.bulbPath, (px - oX) / scale, (py - oY) / scale);
                this.ctx.restore();
                const dpr = window.devicePixelRatio || 1;
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                if (inside) p.push({ x: px, y: py });
            }
            return p;
        },

        // Text shape via offscreen canvas sampling
        _genTextPts(n, text) {
            const off = document.createElement('canvas');
            const octx = off.getContext('2d');
            off.width = this.width;
            off.height = this.height;

            const m = this.isMobile;
            const fontSize = text.length <= 2 ? this.height * (m ? 0.35 : 0.52)
                           : text.length <= 4 ? this.height * (m ? 0.2 : 0.30)
                           : this.height * (m ? 0.15 : 0.22);
            octx.font = '700 ' + fontSize + 'px Inter, sans-serif';
            octx.textAlign = 'center';
            octx.textBaseline = 'middle';
            octx.fillStyle = '#fff';
            octx.fillText(text, this.width * 0.5, this.height * (this.isMobile ? 0.35 : 0.47));

            const imgData = octx.getImageData(0, 0, off.width, off.height).data;
            const pts = [];
            let att = 0;
            while (pts.length < n && att < n * 40) {
                att++;
                const x = Math.random() * this.width;
                const y = Math.random() * this.height;
                const idx = (Math.floor(y) * off.width + Math.floor(x)) * 4;
                if (imgData[idx + 3] > 128) {
                    pts.push({ x, y });
                }
            }
            return pts;
        },

        genTextMB(n) { return this._genTextPts(n, 'MB'); },
        genTextIP(n) { return this._genTextPts(n, 'IP'); },
        genTextParagraph(n) { return this._genTextPts(n, '§'); },
        genTextCheck(n) { return this._genTextPts(n, '✓'); },
        genTextRAG(n) { return this._genTextPts(n, 'RAG'); },
        genTextAt(n) { return this._genTextPts(n, '@'); },

        // Right-aligned single characters for legal pages
        _genHeroChar(n, char) {
            const off = document.createElement('canvas');
            const octx = off.getContext('2d');
            off.width = this.width;
            off.height = this.height;
            const fontSize = this.height * 0.52;
            octx.font = '700 ' + fontSize + 'px Inter, sans-serif';
            octx.textAlign = 'center';
            octx.textBaseline = 'middle';
            octx.fillStyle = '#fff';
            octx.fillText(char, this.width * (this.isMobile ? 0.5 : 0.72), this.height * (this.isMobile ? 0.35 : 0.47));
            const imgData = octx.getImageData(0, 0, off.width, off.height).data;
            const pts = [];
            let att = 0;
            while (pts.length < n && att < n * 40) {
                att++;
                const x = Math.random() * this.width;
                const y = Math.random() * this.height;
                const idx = (Math.floor(y) * off.width + Math.floor(x)) * 4;
                if (imgData[idx + 3] > 128) pts.push({ x, y });
            }
            return pts;
        },
        genHeroChar_para(n) { return this._genHeroChar(n, '§'); },
        genHeroChar_lock(n) { return this._genHeroChar(n, '🔒'); },
        genHeroChar_scale(n) { return this._genHeroChar(n, '⚖'); },
        genTextAZAV(n) { return this._genTextPts(n, 'AZAV'); },
        genTextQCG(n) { return this._genTextPts(n, 'QCG'); },
        genTextSteps(n) { return this._genTextPts(n, '1→5'); },
        genTextQ2(n) { return this._genTextPts(n, 'Q2'); },
        genTextQ3(n) { return this._genTextPts(n, 'Q3'); },
        genTextQ4(n) { return this._genTextPts(n, 'Q4'); },

        // CITECH Symbol centered (for leitbild etc.)
        genSymbolCenter(n) {
            const s = (this.height * (this.isMobile ? 0.35 : 0.55)) / this.svgH;
            const oX = (this.width - this.svgW * s) / 2;
            const oY = (this.height - this.svgH * s) / 2;
            return this._pathPts(n, s, oX, oY);
        },

        /* ========== HELPERS ========== */

        _pathPts(n, scale, oX, oY) {
            const bW = this.svgW * scale, bH = this.svgH * scale, p = [];
            let att = 0;
            while (p.length < n && att < n * 30) {
                att++;
                const px = oX + Math.random() * bW, py = oY + Math.random() * bH;
                this.ctx.save(); this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                const inside = this.ctx.isPointInPath(this.logoPath, (px - oX) / scale, (py - oY) / scale);
                this.ctx.restore();
                const dpr = window.devicePixelRatio || 1;
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                if (inside) p.push({ x: px, y: py });
            }
            return p;
        },

        /* ---------- NODE CREATION ---------- */
        createNodes() {
            const n = this.isMobile ? 200 : this.config.nodeCount;
            const posArrays = this.formations.map(f => this[f.gen](n));
            const count = Math.min(...posArrays.map(a => a.length));

            for (let i = 0; i < count; i++) {
                this.nodes.push({
                    pos: posArrays.map(arr => arr[i]),
                    x: posArrays[0][i].x, y: posArrays[0][i].y,
                    brightness: 0, morphOffset: Math.random() * 0.12
                });
            }
        },

        /* ---------- EASING & LERP ---------- */
        easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; },
        lerp(a, b, t) { return a + (b - a) * t; },

        /* ---------- ANIMATION LOOP ---------- */
        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            const fi = this.fromIdx, ti = this.toIdx, rawP = this.morphProgress, c = this.activeColors;
            const fA = this.formations[fi], fB = this.formations[ti];
            const p = this.easeInOutCubic(rawP);
            const dm = this.darkMode ? 1 : 1.1;
            const alpha = this.lerp(fA.alpha, fB.alpha, p) * dm;
            const connDist = this.lerp(fA.connDist, fB.connDist, p);
            const flashRate = this.lerp(fA.flashRate, fB.flashRate, p);
            const nodeR = this.lerp(fA.nodeR, fB.nodeR, p);
            const lineW = this.lerp(fA.lineW, fB.lineW, p);

            // Interpolate positions
            this.nodes.forEach(node => {
                const from = node.pos[fi], to = node.pos[ti];
                const np = Math.max(0, Math.min(1, (rawP - node.morphOffset) / (1 - node.morphOffset * 0.8)));
                const ep = this.easeInOutCubic(np);
                node.x = from.x + (to.x - from.x) * ep;
                node.y = from.y + (to.y - from.y) * ep;
            });

            // Flashes
            if (Math.random() < flashRate && this.nodes.length > 0) {
                this.flashes.push({ idx: Math.floor(Math.random() * this.nodes.length),
                    radius: 70 + Math.random() * 60, intensity: 0.4 + Math.random() * 0.6,
                    age: 0, maxAge: 90 + Math.random() * 70 });
            }
            for (let i = this.flashes.length - 1; i >= 0; i--) {
                if (++this.flashes[i].age >= this.flashes[i].maxAge) this.flashes.splice(i, 1);
            }
            this.nodes.forEach(n => { n.brightness = 0; });
            this.flashes.forEach(f => {
                const o = this.nodes[f.idx]; if (!o) return;
                const fade = 1 - f.age / f.maxAge;
                this.nodes.forEach(n => {
                    const dx = n.x - o.x, dy = n.y - o.y, d = Math.sqrt(dx*dx+dy*dy);
                    if (d < f.radius) n.brightness = Math.max(n.brightness, (1-d/f.radius)*fade*f.intensity);
                });
            });

            // Connections
            const cd2 = connDist * connDist;
            this.ctx.lineWidth = lineW;
            for (let i = 0; i < this.nodes.length; i++) {
                const a = this.nodes[i];
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const b = this.nodes[j], dx = a.x-b.x, dy = a.y-b.y, d2 = dx*dx+dy*dy;
                    if (d2 >= cd2) continue;
                    const d = Math.sqrt(d2), fade = 1-d/connDist;
                    const la = (alpha*0.5 + Math.max(a.brightness, b.brightness)*0.6) * fade;
                    this.ctx.beginPath(); this.ctx.moveTo(a.x, a.y); this.ctx.lineTo(b.x, b.y);
                    this.ctx.strokeStyle = `rgba(${c.connection.r},${c.connection.g},${c.connection.b},${la})`;
                    this.ctx.stroke();
                }
            }

            // Nodes
            this.nodes.forEach(n => {
                const na = alpha + n.brightness * 0.7, r = nodeR + n.brightness * 2;
                this.ctx.beginPath(); this.ctx.arc(n.x, n.y, r, 0, Math.PI*2);
                this.ctx.fillStyle = `rgba(${c.node.r},${c.node.g},${c.node.b},${na})`;
                this.ctx.fill();
                if (n.brightness > 0.25) {
                    this.ctx.beginPath(); this.ctx.arc(n.x, n.y, r*4, 0, Math.PI*2);
                    this.ctx.fillStyle = `rgba(${c.flash.r},${c.flash.g},${c.flash.b},${n.brightness*0.12})`;
                    this.ctx.fill();
                }
            });

            // --- Digit overlay (Schulungen page: module number in bulb center) ---
            const fDigit = fA.digit, tDigit = fB.digit;
            const activeDigit = p < 0.5 ? fDigit : tDigit;
            if (activeDigit) {
                const digitAlpha = alpha * 0.25;
                this.ctx.save();
                this.ctx.font = `700 ${this.height * 0.18}px Inter, sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = `rgba(${c.node.r},${c.node.g},${c.node.b},${digitAlpha})`;
                this.ctx.fillText(activeDigit, this.width * 0.5, this.height * 0.44);
                this.ctx.restore();
            }

            this.animationId = requestAnimationFrame(() => this.animate());
        }
    };

    /* ========================================
       6. MODALS
       ======================================== */

    const Modals = {
        init() {
            document.querySelectorAll('[data-modal]').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = trigger.getAttribute('data-modal');
                    const modal = document.getElementById(id);
                    if (modal) {
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            document.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', () => this.closeAll());
            });

            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) this.closeAll();
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAll();
            });
        },

        closeAll() {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                m.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    };

    /* ========================================
       7. TABS
       ======================================== */

    const Tabs = {
        init() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const group = btn.closest('.tab-wrapper');
                    if (!group) return;
                    const target = btn.getAttribute('data-tab');

                    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    const panel = group.querySelector('#' + target);
                    if (panel) panel.classList.add('active');
                });
            });
        }
    };

    /* ========================================
       8. CONTACT SLIDE TAB (global)
       ======================================== */

    const ContactTab = {
        init() {
            const isEN = window.location.pathname.includes('/en/');
            const isSubpage = window.location.pathname.includes('/pages/');
            const contactPath = isSubpage ? 'kontakt.html' : 'pages/kontakt.html';

            const L = isEN
                ? { contact: 'Contact', phone: 'Phone', email: 'Email', form: 'Form', send: 'Send message', aria: 'Quick contact access' }
                : { contact: 'Kontakt', phone: 'Telefon', email: 'E-Mail', form: 'Formular', send: 'Nachricht senden', aria: 'Kontakt-Schnellzugriff' };

            const html = `
                <div class="contact-tab" id="contactTab" role="complementary" aria-label="${L.aria}">
                    <button class="contact-tab-trigger" aria-expanded="false">${L.contact}</button>
                    <div class="contact-tab-content">
                        <div class="contact-tab-title">${L.contact}</div>
                        <a href="tel:+4920189096817" class="contact-tab-item">
                            <span class="contact-tab-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                            <span class="contact-tab-text"><span class="contact-tab-label">${L.phone}</span><span class="contact-tab-value">0201 89096817</span></span>
                        </a>
                        <a href="mailto:info@citech-ai.de" class="contact-tab-item">
                            <span class="contact-tab-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                            <span class="contact-tab-text"><span class="contact-tab-label">${L.email}</span><span class="contact-tab-value">info@citech-ai.de</span></span>
                        </a>
                        <a href="${contactPath}" class="contact-tab-item">
                            <span class="contact-tab-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
                            <span class="contact-tab-text"><span class="contact-tab-label">${L.form}</span><span class="contact-tab-value">${L.send}</span></span>
                        </a>
                    </div>
                </div>`;

            document.body.insertAdjacentHTML('beforeend', html);

            const tab = document.getElementById('contactTab');
            const trigger = tab.querySelector('.contact-tab-trigger');

            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                tab.classList.toggle('active');
                trigger.setAttribute('aria-expanded', tab.classList.contains('active'));
            });

            document.addEventListener('click', (e) => {
                if (!tab.contains(e.target) && tab.classList.contains('active')) {
                    tab.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    };

    /* ========================================
       9. INTRO ANIMATION
       Cinematic Logo Reveal Overlay
       seed -> drawing -> awakening -> brand-visible -> burst -> fade-out
       ======================================== */

    const IntroAnimation = {
        overlay: null,
        timers: [],

        init() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            if (sessionStorage.getItem('citech_intro_seen')) return;

            this.isEN = window.location.pathname.includes('/en/');
            this.createOverlay();
            this.startAnimation();
        },

        createOverlay() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'intro-overlay';
            this.overlay.setAttribute('aria-hidden', 'true');

            const brandSub = this.isEN ? 'AI Training & Consulting' : 'KI-Weiterbildung & Beratung';
            const tagline = this.isEN
                ? '<span style="color:var(--color-primary-400)">Accessible</span>, offline & <span style="color:var(--color-primary-400)">low-code</span> AI'
                : '<span style="color:var(--color-primary-400)">Niederschwellig</span>, offline & <span style="color:var(--color-primary-400)">Low-Code</span> KI';
            const skipLabel = this.isEN ? 'Skip' : '\u00dcberspringen';

            // Use the actual CITECH logo SVG (symbol + wordmark + AI)
            const logoSvg = '<svg viewBox="0 0 560 118" xmlns="http://www.w3.org/2000/svg" style="width: clamp(280px, 50vw, 480px); height: auto;">' +
                '<defs><style>.cls-1{fill:#00d4ff;}.cls-2{fill:#f4f1f1;}</style></defs>' +
                '<g>' +
                '<g>' +
                '<path class="cls-2" d="M144.63,34.97c5.46,4.43,8.82,10.36,10.08,17.79h-11.39c-0.79-4.66-2.95-8.32-6.47-10.97-3.52-2.65-7.89-3.98-13.11-3.98-3.8,0-7.26,0.87-10.38,2.61-3.13,1.74-5.63,4.41-7.53,8.01-1.9,3.6-2.85,8.05-2.85,13.35s0.95,9.75,2.85,13.35c1.9,3.6,4.41,6.27,7.53,8.01,3.12,1.74,6.58,2.61,10.38,2.61,5.22,0,9.59-1.34,13.11-4.03,3.52-2.69,5.67-6.36,6.47-11.03h11.39c-1.27,7.51-4.63,13.46-10.08,17.85-5.46,4.39-12.34,6.58-20.64,6.58-6.25,0-11.79-1.34-16.61-4.03-4.82-2.69-8.6-6.54-11.33-11.57-2.73-5.02-4.09-10.93-4.09-17.74s1.36-12.73,4.09-17.79c2.73-5.06,6.5-8.94,11.33-11.62,4.82-2.69,10.36-4.03,16.61-4.03,8.31,0,15.19,2.22,20.64,6.64Z"/>' +
                '<path class="cls-2" d="M365.21,34.97c5.46,4.43,8.82,10.36,10.08,17.79h-11.39c-0.79-4.66-2.95-8.32-6.47-10.97-3.52-2.65-7.89-3.98-13.11-3.98-3.8,0-7.26,0.87-10.38,2.61-3.13,1.74-5.63,4.41-7.53,8.01-1.9,3.6-2.85,8.05-2.85,13.35s0.95,9.75,2.85,13.35c1.9,3.6,4.41,6.27,7.53,8.01,3.12,1.74,6.58,2.61,10.38,2.61,5.22,0,9.59-1.34,13.11-4.03,3.52-2.69,5.67-6.36,6.47-11.03h11.39c-1.27,7.51-4.63,13.46-10.08,17.85-5.46,4.39-12.34,6.58-20.64,6.58-6.25,0-11.79-1.34-16.61-4.03-4.82-2.69-8.6-6.54-11.33-11.57-2.73-5.02-4.09-10.93-4.09-17.74s1.36-12.73,4.09-17.79c2.73-5.06,6.5-8.94,11.33-11.62,4.82-2.69,10.36-4.03,16.61-4.03,8.31,0,15.19,2.22,20.64,6.64Z"/>' +
                '<path class="cls-2" d="M227.71,85.26c0.02,0.02,0.03,0.04,0.05,0.07,0.17,0.25,0.17,0.57,0.17,0.86-0.01,2.34-0.02,4.68-0.03,7.02,0,0.31-0.02,0.65-0.25,0.86-0.18,0.16-0.44,0.18-0.68,0.19-3.37,0.17-6.75,0.08-10.11-0.19-3.11-0.25-6.31-0.69-9.01-2.26-3.6-2.09-5.87-5.96-6.93-9.98-1.05-4.02-1.03-8.24-1.01-12.39,0-3.95,0.05-7.91,0.08-11.87s0.05-7.95,0.08-11.93c0.03-3.98,0.05-7.95,0.08-11.93,0.03-3.98,0.05-7.95,0.08-11.93,0.01-0.99,0.01-1.99,0.02-2.98,0-0.5,0-0.99,0.01-1.49,0-0.29-0.01-0.6,0.11-0.87,0.25-0.57,1.06-0.69,1.58-0.86,0.93-0.3,1.86-0.6,2.79-0.89,1.76-0.55,3.52-1.07,5.29-1.56,0.88-0.05,0.93,0.61,0.93,1.15-0.01,4.39-0.03,8.78-0.04,13.17,0,0.58,0.06,1.26,0.57,1.54,0.23,0.13,0.51,0.13,0.78,0.13,4.81-0,9.63-0.01,14.44-0.01,0.29,0,0.61,0.01,0.82,0.21,0.23,0.22,0.25,0.57,0.25,0.89,0,2.31,0.01,4.63,0.02,6.94,0,0.4-0.02,0.85-0.32,1.12-0.26,0.22-0.63,0.24-0.97,0.24-4.81,0-9.62,0-14.44-0.01-0.34,0-0.74,0.02-0.95,0.3-0.15,0.19-0.15,0.45-0.16,0.69-0.05,11.38-0.05,22.76,0,34.14,0.02,3.11,0.17,6.55,2.33,8.77,1.62,1.66,4.05,2.27,6.36,2.39s4.65-0.17,6.96,0.06c0.4,0.04,0.84,0.12,1.09,0.42Z"/>' +
                '<path class="cls-2" d="M300.62,64.04h-52.08c0.24,7.43,2.35,13.01,6.35,16.73,3.99,3.72,8.88,5.58,14.65,5.58,5.22,0,9.59-1.32,13.11-3.98,3.52-2.65,5.67-6.18,6.47-10.61,0,0,0,0,0.01,0h11.5c-0.79,4.51-2.55,8.54-5.28,12.1-2.73,3.56-6.27,6.33-10.62,8.31-4.35,1.98-9.25,2.96-14.71,2.96-6.25,0-11.79-1.34-16.61-4.03-4.82-2.69-8.6-6.54-11.33-11.57-2.73-5.02-4.09-10.93-4.09-17.74s1.36-12.73,4.09-17.79c2.73-5.06,6.5-8.94,11.33-11.62,4.82-2.69,10.36-4.03,16.61-4.03s11.84,1.34,16.55,4.03c4.7,2.69,8.3,6.29,10.8,10.8,2.49,4.51,3.74,9.49,3.74,14.95,0,2.3-0.16,4.27-0.47,5.93ZM287.81,46.72c-1.82-3.24-4.31-5.65-7.47-7.24-3.16-1.58-6.61-2.37-10.32-2.37-5.93,0-10.91,1.84-14.95,5.52-4.03,3.68-6.21,9.07-6.52,16.19h41.64c0.24-4.82-0.55-8.86-2.37-12.1Z"/>' +
                '<path class="cls-2" d="M441.55,35.39c4.66,4.86,7,11.88,7,21.06v37.84h-10.8v-36.89c0-6.48-1.66-11.47-4.98-14.95-3.32-3.48-7.83-5.22-13.52-5.22s-10.68,1.92-14.23,5.75c-3.56,3.84-5.34,9.43-5.34,16.79v34.52h-10.8V7.13c0-0.35,0.28-0.63,0.63-0.63h10.17v38.08c1.66-5.3,4.61-9.37,8.84-12.22,4.23-2.85,9.11-4.27,14.65-4.27,7.59,0,13.72,2.43,18.39,7.29Z"/>' +
                '</g>' +
                '<polygon class="cls-2" points="179.59,94.2 168.71,94.2 169.46,40.05 179.59,36.92"/>' +
                '<g>' +
                '<path class="cls-1" d="M516.62,77.04h-34.47l-6.25,17.7h-14.11l30.08-80.4h15.16l29.96,80.4h-14.11l-6.25-17.7ZM512.92,66.86l-13.54-38.18-13.54,38.18h27.07Z"/>' +
                '<path class="cls-1" d="M560,13.07v81.67h-13.19V13.07h13.19Z"/>' +
                '</g>' +
                '<path class="cls-1" d="M60.38,83.55c-7.62-0.01-10.47-0.47-16.03-6.1-2.89-2.97-6.31-5.74-8.07-9.57-1.22-2.7-1.15-5.81-1.12-8.74,0.08-3.86-0.12-7.83,1.85-11.1,1.41-2.39,3.48-4.3,5.44-6.23,2.8-2.66,5.69-5.61,9.58-6.49,4.3-0.93,9.1,0.28,13.4-1.2,14.28-4.02,16.96-23.87,4.22-31.45-3.68-2.26-8.28-3.18-12.49-2.37-7.55,1.27-13.57,7.83-14.29,15.45-0.43,3.45-0.12,7.07-1.6,10.24-1.34,2.98-3.95,5.41-6.32,7.73-2.84,2.73-5.83,5.72-9.75,6.56-2.01,0.47-4.17,0.41-6.31,0.43-3.99-0.02-7.94,0.8-11.25,3.1-11.19,7.27-9.8,24.87,2.41,30.23,1.26,0.58,2.58,1.01,3.92,1.29,4,0.9,8.35,0.02,12.2,1.5,4.38,1.74,7.52,5.7,10.88,8.93,4.8,4.77,5.71,7.9,5.67,14.55-0.08,9.53,6.92,17.59,16.56,18.15,8.38,0.61,16.36-5.21,18.15-13.38,2.73-10.9-5.94-21.48-16.99-21.53h-0.05Z"/>' +
                '<circle class="cls-1" cx="173.98" cy="19" r="7.33"/>' +
                '</g></svg>';

            this.overlay.innerHTML =
                '<div class="intro-logo-container">' +
                    '<div class="intro-symbol" id="intro-symbol">' + logoSvg + '</div>' +
                    '<div class="intro-brand" id="intro-brand">' +
                        '<span class="intro-brand-sub">' + brandSub + '</span>' +
                        '<span class="intro-brand-tagline">' + tagline + '</span>' +
                    '</div>' +
                '</div>' +
                '<button class="intro-skip" id="intro-skip">' + skipLabel + '</button>';

            document.body.appendChild(this.overlay);

            // Event listeners
            document.getElementById('intro-skip').addEventListener('click', () => this.skipIntro());
            this._escHandler = (e) => { if (e.key === 'Escape') this.skipIntro(); };
            document.addEventListener('keydown', this._escHandler);
        },

        _t(fn, ms) { const id = setTimeout(fn, ms); this.timers.push(id); },

        startAnimation() {
            const sym = document.getElementById('intro-symbol');
            const brand = document.getElementById('intro-brand');

            // Phase 1: Symbol fades in (200ms)
            this._t(() => { sym.classList.add('visible'); }, 200);

            // Phase 2: Brand text slides up (600ms)
            this._t(() => { brand.classList.add('visible'); }, 600);

            // Phase 3: Hold, then text fades out up (2400ms)
            this._t(() => { brand.classList.add('fade-out'); }, 2400);

            // Phase 4: Symbol morphs out (2800ms)
            this._t(() => { sym.classList.add('morph-out'); }, 2800);

            // Phase 5: Overlay fades, reveal page (3200ms)
            this._t(() => {
                sessionStorage.setItem('citech_intro_seen', 'true');
                this.overlay.classList.add('fade-out');
            }, 3200);

            // Cleanup (4500ms)
            this._t(() => { this.cleanup(); }, 4500);
        },

        skipIntro() {
            sessionStorage.setItem('citech_intro_seen', 'true');
            this.timers.forEach(id => clearTimeout(id));
            this.timers = [];
            if (this.overlay) { this.overlay.classList.add('hidden'); this.cleanup(); }
        },

        cleanup() {
            if (this._escHandler) { document.removeEventListener('keydown', this._escHandler); this._escHandler = null; }
            if (this.overlay && this.overlay.parentNode) this.overlay.remove();
            this.overlay = null;
        }
    };

    /* ========================================
       10. SMOOTH ANCHOR LINKS
       ======================================== */

    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const offset = 80;
                        const y = target.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                });
            });
        }
    };

    /* ========================================
       6. INITIALIZATION
       ======================================== */

    const init = () => {
        IntroAnimation.init();
        ThemeManager.init();
        Navigation.init();
        NeuralBackground.init();
        ScrollAnimations.init();
        Modals.init();
        Tabs.init();
        ContactTab.init();
        CookieBanner.init();
        SmoothScroll.init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
