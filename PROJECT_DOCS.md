# CITECH Website V3 - Projektdokumentation

> Letzte Aktualisierung: 2026-03-16
> Status: Entwicklung – Startseite Grundgerüst steht

---

## 1. Unternehmensprofil

### CITECH AI GmbH
- **Rechtsform:** GmbH
- **Sitz:** Katernberger Str. 107, 45327 Essen, Deutschland
- **Handelsregister:** HRB 37447, AG Essen
- **USt-ID:** DE458959833
- **Gegründet:** 2025
- **Website:** www.citech-ai.de
- **E-Mail:** info@citech-ai.de
- **Telefon:** +49 201 89096817

### Geschäftsführung
- **Marcel Batur** – GF, Dozent, Tool-Entwicklung, Regeltreue
  - Zertifizierter Werkstoffprüfer Metalltechnik (IHK)
  - Skills: Entwicklung, Automatisierung, EU AI Act, QM-Systeme, Python & ML
  - E-Mail: m.batur@citech-ai.de
- **Dr. Ingo Poschmann** – GF, Dozent, Regeltreue-Berater, QM-Systeme
  - Promovierter Naturwissenschaftler, IHK-Sachverständiger
  - Skills: Strategie, QM-Systeme, Compliance, Auditing
  - E-Mail: i.poschmann@citech-ai.de

### Zertifizierungen
- **AZAV-zertifiziert** (TÜV NORD CERT, Nr. 44 727 251914, gültig bis 28.12.2030)
- EU AI Act konform

### Kerngeschäft (4 Säulen)
1. **Schulungen** – Praxisnahe KI-Weiterbildung (4 Module, AZAV-gefördert)
2. **Technische Beratung** – Strategische KI-Konzepte
3. **Regeltreue-Analyse** – EU AI Act Konformität
4. **KI-Implementierung** – Custom, offline, on-premise, DSGVO-konform

### Schulungsmodule
| Modul | Name | UE | Dauer |
|-------|------|----|-------|
| 1 | KI-Anwender | 121 | 13 Tage |
| 2 | KI-Spezialist | 187 | 20 Tage |
| 3 | KI-Projektleiter | 121 | 13 Tage |
| 4 | KI-Manager | 429 | 46 Tage (Komplett) |

### Kursblöcke 2026
- **Block 1:** 14.04. – 22.06.2026
- **Block 2:** 15.07. – 16.09.2026
- **Block 3:** 14.10. – 16.12.2026
- Formate: Vollzeit (Mo-Fr 08:00-16:35), Berufsbegleitend (in Planung), Inhouse

### Newsletter
- **Name:** KI-Radar
- **Frequenz:** Wöchentlich (Sonntag)
- **Rubriken:** High-End, Basics, Recht, Praxis-Tipps, Ausblick
- **Versand:** Brevo (ehemals Sendinblue), Double-Opt-In

### Hosting & Technik
- **Hoster:** Strato
- **KI-Chatbot CIRA:** Claude API (Anthropic) mit RAG (aktuell deaktiviert)
- **Design-Partner:** B_Line Graphix

---

## 2. Analyse der aktuellen Website (V1)

### Stärken (beibehalten)
- Seriöses, tech-orientiertes Design
- Starke DSGVO-Konformität (kein Tracking, lokale Fonts)
- Schema.org Markup (Organization + EducationalOrganization)
- Gute SEO-Basis (Open Graph, hreflang, Canonical, Sitemap)
- Skip-Links & ARIA für Accessibility
- KI-Transparenz-Seite als Differenzierungsmerkmal
- Professionelle .htaccess Sicherheitskonfiguration
- CSS-Variablen-System (28 Variablen)
- i18n DE/EN Struktur

### Schwächen (beheben in V3)
| Problem | Details |
|---------|---------|
| **Nicht sofort ersichtlich was CITECH tut** | Hero-Section zu abstrakt, USP nicht klar |
| **Kein funktionierender Light Mode** | Theme-Naming quirky, Light Mode unbrauchbar |
| **Separate Mobile-HTML** | UA-Detection statt echtem Responsive CSS |
| **17 JS-Dateien ohne Bundling** | 17 HTTP-Requests, kein Minifying |
| **10 CSS-Dateien mit Override-Patches** | legal-footer-fix.css, tabs-footer-override.css etc. |
| **Inline onclick-Handler** | Überall im HTML statt Event Listeners |
| **Globaler JS-Namespace** | window.aiSystem, window.expandPanel etc. |
| **1.113 Zeilen Dead Code** | Chatbot auskommentiert aber geladen |
| **CSS-Duplikate** | ~530 Zeilen redundant über mehrere Dateien |
| **Hardcoded rgba-Werte** | Statt CSS-Variablen |
| **Cookie-Banner 10s Delay** | Ungewöhnlich |
| **Font-display: swap fehlt** | FOIT-Problem |
| **Keine CSP-Header** | Sicherheitslücke |
| **localStorage ohne Expiration** | Alte Daten bleiben ewig |

### Seitenstruktur V1
```
Startseite (index.html)
├── Schulung (Modal)
├── Regeltreue (Modal)
├── Tools (Modal)
├── Methodik (Modal)
├── Förderung (Modal)
├── Über uns / Team (pages/team.html)
├── Schulungstermine (pages/termine.html)
├── Newsletter / KI-Radar (pages/newsletter.html)
├── Kontakt (pages/kontakt.html)
├── Impressum (pages/impressum.html)
├── Datenschutz (pages/datenschutz.html)
├── AGB (pages/agb.html)
└── KI-Transparenz (pages/ki-transparenz.html)
+ Englische Version (/en/...)
```

---

## 3. Analyse der Referenz-Website (Wegweiser Digital)

### Was wir als Inspiration übernehmen

#### Design-Patterns
- **Glassmorphism-Cards** – Mehrstufig mit ::before Highlight, Backdrop-Filter, Multi-Layer Shadows
- **Ambient Background** – Nova-Glows, Floating Orbs, Noise-Textur (dezent)
- **Logo-Reveal als Hintergrund-Element** – Logo subtil im Background sichtbar
- **Clean Whitespace** – Ruhige, nicht überladene Seiten
- **Fluid Typography** – clamp() für responsive Schriftgrößen

#### Technische Architektur
- **2 CSS-Dateien** statt 10 (main.css + mobile.css)
- **1 JS-Datei** statt 17 (main.js im IIFE-Pattern)
- **50+ CSS-Variablen** – 9-stufige Farbpalette, 12-stufiges Spacing
- **Echtes Responsive** – 4 Breakpoints (1024/768/480/360px)
- **Clean URLs** – .htaccess Rewrite (kein .html sichtbar)
- **CSP-Header** in .htaccess
- **Asset-Versionierung** – ?v=XX für Cache-Busting
- **data-theme auf <html>** für Theme-Switching

#### JavaScript-Patterns
- **IIFE-Wrapper** – Kein globaler Namespace
- **Objekt-Module** – IntroAnimation, MainSite, ThemeManager etc.
- **Gecachte DOM-Referenzen** – elements{} Objekt
- **IntersectionObserver** – Für Scroll-Reveal statt scroll-Event
- **sessionStorage** – Intro nur einmal zeigen

#### SEO/Performance
- **Structured Data** – Organization, Course, FAQPage
- **Immutable Cache** für Assets (max-age=31536000)
- **Bot-Blocking** in .htaccess (ahrefs, semrush)
- **Mobile Performance** – Animationen deaktiviert, Blur reduziert

### Was wir NICHT übernehmen
- Google Analytics / Meta Pixel (CITECH bleibt trackingfrei)
- Cookiebot (nicht nötig ohne Tracking-Cookies)
- Calendly-Integration (CITECH hat eigenes Kontaktformular)
- Intro-Animation mit Warp-Effekt (zu aufwendig, nicht zum Branding passend)

---

## 4. Design-Entscheidungen V3

### Farbschema
- **Dark Mode (Standard):** Dunkler Hintergrund + Neon-Cyan (#00d4ff) Akzente
- **Light Mode (NEU, funktionierend):** Heller Hintergrund mit angepasster Cyan-Palette
- Beide Modi müssen vollständig nutzbar sein
- Theme-Toggle via `data-theme="dark|light"` auf `<html>`

### Design-Elemente
| Element | Entscheidung | Quelle | Status |
|---------|-------------|--------|--------|
| **Glass-Cards** | Glassmorphism + animierter Border-Glow (conic-gradient) | Wegweiser Digital (erweitert) | Fertig |
| **Living Network** | Canvas Neural Network als roter Faden (siehe 4.1) | Eigenentwicklung | Fertig |
| **Farbpalette** | Cyan-basiert, 9 Abstufungen + Teal-Akzent | CITECH V1 (erweitert) | Fertig |
| **Typography** | Inter (lokal, TTF), Fluid mit clamp() | Beide | Fertig |
| **Spacing** | 12-stufiges System (--space-1 bis --space-24) | Wegweiser Digital | Fertig |
| **Animationen** | Dezent, reduced-motion Support | Wegweiser Digital | Fertig |
| **Navigation** | Klassisch + Dropdown + Mobile Hamburger | Wegweiser Digital | Fertig |
| **Cards** | Card-basiertes Layout für Services | Wegweiser Digital | Fertig |
| **CTA-Stil** | Klar aber nicht aggressiv | Anforderung | Fertig |
| **Ambient BG** | 3 Mesh-Gradients + Noise-Textur-Overlay | Eigenentwicklung | Fertig |
| **Theme** | Dark/Light via data-theme, inkl. Logo-Switch | Wegweiser Digital | Fertig |

### 4.1 "Living Network" – Signature Feature

**Konzept:** Ein Canvas-basiertes neuronales Netz begleitet den Nutzer durch die gesamte Seite. Die Nodes formen sich passend zur aktuellen Sektion und morphen beim Scrollen organisch von Form zu Form.

**Startseite – Formationen:**

| Sektion | Formation | Symbolik | Position |
|---------|-----------|----------|----------|
| Hero | CITECH S-Symbol | "Das sind wir" | Rechts, prominent |
| Services | Gehirn/Ellipse | "KI-Intelligenz" | Zentriert |
| Warum CITECH | Schild | "Sicherheit & Vertrauen" | Zentriert |
| Module | 4 aufsteigende Stufen | "Lernfortschritt" | Zentriert |
| Förderung | Euro € Zeichen | "Investition die sich lohnt" | Zentriert |

**Schulungen-Seite – Formationen ("The Learning Journey"):**

| Sektion | Formation | Symbolik |
|---------|-----------|----------|
| Hero | CITECH S-Symbol (rechts) | Branding, wiedererkennung |
| Modul 1 | Glühbirne (SVG Path2D) + Digit "1" | Konstante Form |
| Modul 2 | Glühbirne + Digit "2" | Zahl wechselt |
| Modul 3 | Glühbirne + Digit "3" | Zahl wechselt |
| Modul 4 | Glühbirne + Digit "4" | Zahl wechselt |
| Leitbild | CITECH S-Symbol (zentriert) | Branding-Abschluss |

**Technische Details:**
- 450 Nodes mit vorberechneten Positionen (eine pro Formation, pro Seite)
- **Multi-Page System**: `detectPage()` erkennt die Seite anhand vorhandener DOM-Sektionen
- Scroll-Position trackt Viewport-Mitte → ermittelt aktuelle + nächste Formation
- Per-Node staggered Easing (morphOffset) für organisches Gefühl
- Visuelle Properties interpolieren mit: Alpha, Flash-Rate, Connection-Distance, Node-Radius, Line-Width
- "Gedankenblitze" (Flashes) lassen zufällig Bereiche aufleuchten
- **Digit-Overlay**: Modulnummer wird als dezenter Canvas-Text (`fillText`) ins Zentrum der Glühbirne gezeichnet
- Performance: O(n²) Connection-Check pro Frame (~100k Ops), läuft flüssig bei 60fps
- Mobile: Komplett deaktiviert (canvas hidden, kein RAF)

**Erkenntnisse / Design-Regeln für Formationen:**
- Geometrische Approximationen (Dreiecke, Rechtecke) funktionieren NICHT gut als Node-Muster → zu unscharf, nicht erkennbar
- **SVG Path2D + `isPointInPath()`** ist der einzig zuverlässige Weg für erkennbare Formen
- Für Text/Zahlen: Canvas `fillText()` statt Nodes-Dichtung verwenden
- Glühbirnen: Konstante Intensität pro Seite wirkt ruhiger als progressive Steigerung
- Modulkarten sollten transparent sein (opacity ~0.15, blur 6px) damit Hintergrund-Formation sichtbar bleibt
- Hero-Formation immer CITECH S-Symbol rechts → wiedererkennbar, bewährt

**Geplant für weitere Unterseiten:**
- Jede Unterseite: CITECH Symbol oben rechts → seitenspezifische Formation beim Scrollen
- Beratung, Tools, Förderung, Team, Termine, Kontakt – Formationen bei Seitenentwicklung definieren
- **Regel**: Neue Formen immer als SVG Path2D, nie als geometrische Approximation

**Mobile-Strategie:**
- Desktop: Volles Multi-Formation-System
- Mobile: Komplett deaktiviert (noch zu entscheiden: abgespeckte Version oder statisch)
- Wegweiser Digital zeigt: abgespeckte Canvas auf Mobile funktioniert

### Hero-Section (Hauptproblem V1 gelöst)
- Badge: "AZAV-zertifiziert · TÜV NORD" (sofort Vertrauen)
- H1: "KI-Weiterbildung & Beratung **für Unternehmen**" (sofort klar)
- Subtitle: DSGVO-konform, förderfähig, praxisnah
- 2 CTAs: "Schulungen entdecken" + "Kostenlose Beratung"
- Stats-Leiste: 4 Module / 100% Förderfähig / DSGVO
- Living Network rechts daneben als visuelles Element

### Logo-Assets (aus V1 kopiert)
```
assets/images/logo/
├── citech-logo-white.svg          (Header Dark Mode)
├── citech-logo-white1.svg
├── citech-logo-white3.svg
├── citech-logo-white_Claude.svg
├── citech-logo.svg
├── Citech blauer Verlauf und Tech Welle.jpg
├── Citech klassisch schwarzer Hintergrund Tech Welle.jpg
├── Citech Logo klassisch weißer Hintergrund mit Schatten.jpg  (Header Light Mode)
├── Citech Symbol klassisch schwarzer Hintergrund Tech Welle.jpg
├── Citech Symbol klassisch weißer Hintergrund .jpg
├── Ingo Poschmann.jpg
├── Lorenz Gerke.jpg
├── Marcel Batur.jpg
└── triple-z-essen.jpg
```

---

## 5. Technische Architektur V3

### Dateistruktur (Ziel)
```
CITECH_Website_V3/
├── index.html                    (Startseite)
├── .htaccess                     (Security, Caching, Rewrites)
├── robots.txt
├── sitemap.xml
├── contact-handler.php           (Kontaktformular-Backend)
│
├── css/
│   ├── main.css                  (Alle Styles: Variablen, Base, Components, Pages)
│   └── mobile.css                (Responsive Overrides)
│
├── js/
│   └── main.js                   (IIFE, Objekt-Module)
│
├── assets/
│   ├── images/
│   │   └── logo/                 (SVG + Fallback)
│   ├── certificates/             (AZAV, Zertifikate)
│   ├── icons/                    (SVG Icons)
│   └── fonts/                    (Inter WOFF2 + Lizenz)
│
├── pages/
│   ├── schulungen.html           (Modulübersicht)
│   ├── beratung.html             (Technische Beratung + Regeltreue)
│   ├── tools.html                (KI-Implementierung)
│   ├── foerderung.html           (Förderungsmöglichkeiten)
│   ├── team.html                 (Über uns)
│   ├── termine.html              (Schulungstermine)
│   ├── kontakt.html              (Kontaktformular)
│   ├── newsletter.html           (KI-Radar)
│   ├── impressum.html
│   ├── datenschutz.html
│   ├── agb.html
│   └── ki-transparenz.html
│
├── en/                           (Englische Version)
│   ├── index.html
│   └── pages/...
│
└── PROJECT_DOCS.md               (Diese Datei)
```

### CSS-Architektur
```css
/* main.css Aufbau: */

/* 1. CSS Custom Properties (:root) */
/*    - Farben (9-stufig + Dark/Light) */
/*    - Spacing (12-stufig) */
/*    - Typography */
/*    - Borders, Shadows, Transitions */
/*    - Z-Index Layer System */

/* 2. Reset & Base Styles */
/*    - Box-sizing, Margin-Reset */
/*    - Typography Base */
/*    - Link Styles */

/* 3. Layout */
/*    - Container */
/*    - Grid System */
/*    - Section Spacing */

/* 4. Components */
/*    - Header & Navigation */
/*    - Glass Cards */
/*    - Buttons & CTAs */
/*    - Footer */
/*    - Cookie Banner */
/*    - Forms */

/* 5. Page-Specific Styles */
/*    - Hero Section */
/*    - Service Cards */
/*    - Team Section */
/*    - Termine */
/*    - etc. */

/* 6. Ambient Background & Animations */
/*    - Nova Glows */
/*    - Logo Background */
/*    - Keyframes */

/* 7. Light Mode Overrides */
/*    [data-theme="light"] { ... } */

/* 8. Accessibility */
/*    - Focus Styles */
/*    - Reduced Motion */
/*    - High Contrast */

/* mobile.css: */
/* Breakpoints: 1024px, 768px, 480px, 360px */
/* Mobile Performance: Animationen deaktivieren */
```

### JavaScript-Architektur (IMPLEMENTIERT)
```javascript
/* main.js – IIFE + 7 Module (~550 Zeilen) */

(function() {
    'use strict';

    /* 1. ThemeManager       – Dark/Light Toggle, localStorage, Logo-Switch, NeuralBG-Update */
    /* 2. Navigation         – Desktop Dropdown, Mobile Hamburger, Scroll-Header, ESC-Close */
    /* 3. ScrollAnimations   – IntersectionObserver für .reveal Elemente */
    /* 4. CookieBanner       – Consent mit localStorage + Timestamp, 2s Delay */
    /* 5. NeuralBackground   – Multi-Formation Canvas System (Signature Feature) */
    /*    - 5 Shape-Generatoren: genHeroSymbol, genBrain, genShield, genSteps, genEuro */
    /*    - Scroll-Tracking: Viewport-Mitte → Formation-Pair + Interpolation */
    /*    - Per-Node morphOffset für organisches Easing */
    /*    - Flashes (Gedankenblitze) mit dynamic Rate */
    /*    - Dynamische Connections (Distanz ändert sich mit Scroll) */
    /* 6. SmoothScroll       – Anchor-Links mit 80px Header-Offset */
    /* 7. Init               – Reihenfolge: Theme → Nav → Neural → Scroll → Cookie → Smooth */
})();
```

### .htaccess (Ziel-Features)
- HTTPS + WWW Redirect
- Security Headers (CSP, HSTS, X-Frame-Options, etc.)
- Clean URLs (kein .html sichtbar)
- Caching mit Versionierung (?v=XX)
- GZIP Kompression
- Bot-Blocking
- Error Pages (404)
- Sensitive Files Protection

---

## 6. Content-Strategie V3

### Navigation (Hauptmenü)
```
Schulungen | Beratung | Tools | Förderung | Über uns | Kontakt
```
Optional Dropdown unter "Schulungen": Module 1-4, Termine

### Startseite – Sektionen
1. **Hero** – "KI-Weiterbildung & Beratung" + USPs + 2 CTAs
2. **Services** – 4 Glass-Cards (Schulung, Beratung, Regeltreue, Tools)
3. **Warum CITECH** – AZAV, Offline, DSGVO, Praxis (Trust-Elemente)
4. **Module-Überblick** – 4 Stufen kurz angerissen
5. **Förderung-Teaser** – "Bis zu 100% gefördert" + Link
6. **CTA-Section** – "Kostenloses Beratungsgespräch"

### Ton & Sprache
- Professionell, sachlich, vertrauensvoll
- Keine Marketing-Superlative
- Fokus auf Nutzen und Klarheit
- Gendern: Neutral oder mit Sternchen (konsistent)

---

## 7. Anforderungen (Priorisiert)

### Fertiggestellt
- [x] Alle 13 Seiten inkl. Inhalte (Startseite + 12 Unterseiten)
- [x] Living Network auf allen Seiten (seitenspezifische Formationen)
- [x] Funktionierender Dark/Light Mode
- [x] Echtes Responsive CSS (4 Breakpoints)
- [x] Saubere Architektur (2 CSS + 1 JS, IIFE, 9 Module)
- [x] Glassmorphism, Accent-Cards, Process-Timelines, Tab-System
- [x] Schema.org JSON-LD auf allen relevanten Seiten
- [x] Kontaktformular + Google Maps (DSGVO 2-Klick)
- [x] Schulungsplan-Modals + Zertifikat-Links
- [x] Scroll-Reveal Animationen (IntersectionObserver)
- [x] Accessibility (Skip-Links, ARIA, Reduced Motion, High Contrast)

### Offene Punkte (Priorisiert)

#### P0 – Kritisch (vor Launch)
- [ ] **Startseite überarbeiten** – Hero-Bereich klarer strukturieren: Schulung, Beratung, Tools sofort erkennbar. DSGVO-konform, On-Premise, Niederschwellige KI-Lösungen hervorheben
- [ ] **Kontakt-Slide auf allen Seiten** – Wie im V1-Original: Fester Kontakt-Tab am Seitenrand (auf alle Seiten übertragen)
- [ ] **Leitbild bei Schulungen prüfen** – Sicherstellen dass Leitbild-Sektion auf Schulungen-Seite vollständig ist
- [ ] **.htaccess Sicherheitskonzept** – Mindestens so stark wie V1: CSP, HSTS, X-Frame-Options, X-Content-Type, Referrer-Policy, Permissions-Policy, Bot-Blocking, Clean URLs, Caching, GZIP, Sensitive Files Protection
- [ ] **robots.txt** – Korrekte Syntax (kein Regex wie in V1)
- [ ] **sitemap.xml** – Alle 13 Seiten mit Priorität und hreflang
- [ ] **Font DSGVO-Sicherheit** – TTF → WOFF2 konvertieren, sicherstellen keine externen Font-Requests
- [ ] **Kontaktformular Backend** – contact-handler.php aus V1 übernehmen/anpassen (CORS, CSRF, Rate Limiting)

#### P1 – Wichtig (zeitnah nach Launch)
- [ ] **Englische Version** – Komplette EN-Übersetzung aller Seiten (Toggle existiert, aber nicht funktional)
- [ ] **Mobile Ansicht testen** – Erst mit allen Features (Living Network) probieren, dann ggf. abspecken
- [ ] **Light Mode** auf allen Seiten durchgehen und visuell prüfen
- [ ] **SEO Feinschliff** – Title Tags Länge prüfen, Meta Descriptions optimieren, Alt-Texte auf allen Bildern
- [ ] **Google Analytics / Tracking** – Entscheidung: Kein Tracking (wie V1) ODER Cookiebot + GA (wie Wegweiser). Falls GA: Cookiebot einbinden, Datenschutzerklärung anpassen
- [ ] **Indexierung vorbereiten** – Google Search Console, sitemap einreichen, Canonical URLs prüfen
- [ ] **Bild Ingo Poschmann** – Auf Team-Seite zentrieren (aktuell zu weit rechts)
- [ ] **404-Seite** – Custom Error Page erstellen
- [ ] **Danke-Seite** nach Kontaktformular-Absendung

#### P2 – Nice-to-Have
- [ ] Chatbot CIRA (später aktivierbar)
- [ ] Testimonials/Referenzen-Bereich
- [ ] FAQ-Section mit Schema.org
- [ ] Breadcrumb-Navigation
- [ ] Cookiebot evaluieren (Pro: Rechtssicherheit bei Tracking / Contra: Overhead wenn kein Tracking)

---

## 8. DSGVO-Checkliste

- [x] Impressum vollständig (Pflichtangaben)
- [x] Datenschutzerklärung (alle Dienste dokumentiert)
- [x] AGB vorhanden
- [x] KI-Transparenz-Erklärung
- [x] Fonts lokal gehostet (kein Google Fonts) – ⚠️ TTF → WOFF2 noch ausstehend
- [ ] Tracking-Entscheidung: Kein GA (wie V1) ODER Cookiebot + GA (wie Wegweiser)
- [x] Cookie-Banner vorhanden (für funktionale Cookies)
- [x] Kontaktformular mit Datenschutz-Checkbox
- [x] Newsletter mit Datenschutz-Checkbox (Double-Opt-In bei Brevo)
- [ ] localStorage mit Löschfunktion – TODO
- [x] Keine externen CDNs für CSS/JS
- [ ] Fonts WOFF2 konvertieren (Abmahnsicherheit)
- [ ] contact-handler.php Backend (CORS, CSRF, Rate Limiting)

---

## 9. SEO-Checkliste

- [x] Title Tags auf allen Seiten
- [x] Meta Descriptions auf allen Seiten
- [x] Canonical URLs auf allen Seiten
- [x] hreflang Tags (de/en) auf allen Seiten – ⚠️ EN-Seiten existieren noch nicht
- [x] Open Graph Tags auf allen Seiten
- [x] Schema.org JSON-LD: Organization, EducationalOrganization, Course (Schulungen), CourseInstance (Termine), LocalBusiness (Kontakt), ItemList
- [ ] Sitemap.xml erstellen (alle 13+ Seiten mit Priorität)
- [ ] robots.txt erstellen
- [ ] Clean URLs via .htaccess (kein .html sichtbar)
- [x] H1-H6 Hierarchie auf allen Seiten
- [ ] Alt-Texte auf allen Bildern prüfen
- [x] Interne Verlinkung (Footer, CTAs, Navigation)
- [ ] Google Search Console einrichten
- [ ] Tracking-Entscheidung (GA oder nicht)

---

## 10. Performance-Ziele

| Metrik | Ziel |
|--------|------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| CSS-Dateien | Max. 2 |
| JS-Dateien | Max. 1 |
| HTTP-Requests | < 15 |
| Fonts | WOFF2 + font-display: swap |
| Images | WebP/AVIF + lazy loading |

---

## 11. Aktueller Entwicklungsstand

### Fertige Dateien
| Datei | Beschreibung | Living Network |
|-------|-------------|----------------|
| `index.html` | Startseite (Hero, Services, Trust, Module, Förderung) | Symbol → Brain → Shield → Steps → Euro |
| `pages/schulungen.html` | 4 Module, Schulungspläne (Modals), Zertifikate, Leitbild | Symbol → Glühbirne 1-4 → Symbol |
| `pages/kontakt.html` | Formular, Kontaktdaten, Ansprechpartner, Google Maps (2-Klick) | Symbol → Symbol (zentriert) |
| `pages/termine.html` | 3 Kursblöcke, Kursformate, Schulungsort | Symbol → Q2 → Q3 → Q4 → Symbol |
| `pages/team.html` | Marcel Batur + Dr. Poschmann, Skill-Pills, Bios | Symbol → MB → IP → Symbol |
| `pages/beratung.html` | Tab-System (Beratung/Leitbild), Risikoklassen, Timeline, Pakete-Vergleich, Checkliste | Symbol → § → ✓ |
| `pages/foerderung.html` | AZAV-Details, QCG, Ehrlicher Förder-Hinweis, 5-Schritte-Timeline | Symbol → AZAV → QCG → 1→5 → Symbol |
| `css/main.css` | Design-System: Variablen, Glass-Cards, Accent-Cards, Tabs, Timeline, Modals, Promise-Grid |
| `css/mobile.css` | 4 Breakpoints + alle Subpage-Responsive |
| `js/main.js` | 9 Module: Theme, Nav, Scroll, Cookie, Neural (Multi-Page + Text-Shapes), Modals, Tabs, Smooth |

### Seitenübersicht (alle 13 Seiten fertig)

| Datei | Beschreibung | Living Network | Inhalts-Check |
|-------|-------------|----------------|---------------|
| `index.html` | Startseite | Symbol → Brain → Shield → Steps → Euro | ⚠️ Hero überarbeiten |
| `pages/schulungen.html` | 4 Module, Schulungspläne, Zertifikate | Symbol → Glühbirne 1-4 → Symbol | ⚠️ Leitbild prüfen |
| `pages/kontakt.html` | Formular, Google Maps, Ansprechpartner | Symbol → Symbol (zentriert) | ✅ |
| `pages/termine.html` | 3 Kursblöcke, Formate, Schulungsort | Symbol → Q2 → Q3 → Q4 → Symbol | ✅ |
| `pages/team.html` | Marcel Batur + Dr. Poschmann | Symbol → MB → IP → Symbol | ⚠️ Bild IP zentrieren |
| `pages/beratung.html` | Tab-System, Risikoklassen, Pakete, Leitbild | Symbol → § → ✓ | ✅ |
| `pages/foerderung.html` | AZAV, QCG, 5-Schritte-Timeline | Symbol → AZAV → QCG → 1→5 → Symbol | ✅ |
| `pages/tools.html` | RAG-Fokus, CITECH-Box, Tech-Stack | Symbol → RAG → Symbol | ✅ |
| `pages/newsletter.html` | KI-Radar, 5 Rubriken, Anmeldeformular | Symbol → @ | ✅ |
| `pages/ki-transparenz.html` | VERIFY-Prozess, Risikoklassen, Beauftragter | Symbol → ✓ → Symbol | ✅ |
| `pages/impressum.html` | Pflichtangaben 1:1 aus V1 | § (rechtsbündig) | ✅ |
| `pages/datenschutz.html` | DSGVO komplett 1:1 aus V1 | 🔒 (rechtsbündig) | ✅ |
| `pages/agb.html` | §1–§11 1:1 aus V1 | ⚖ (rechtsbündig) | ✅ |

### Nächste Schritte (priorisiert)

**Phase 1 – Inhaltliche Korrekturen:**
1. Startseite Hero überarbeiten (Schulung/Beratung/Tools sofort klar)
2. Kontakt-Slide auf allen Seiten einbauen (wie V1)
3. Leitbild bei Schulungen prüfen/vervollständigen
4. Bild Ingo Poschmann auf Team-Seite zentrieren

**Phase 2 – Technische Infrastruktur:**
5. .htaccess (Security mindestens V1-Level + Clean URLs)
6. robots.txt + sitemap.xml
7. Font TTF → WOFF2 (DSGVO-sicher, keine externen Requests)
8. contact-handler.php Backend

**Phase 3 – SEO & Indexierung:**
9. SEO-Audit (Title Tags, Meta, Alt-Texte, Schema.org)
10. Google Search Console vorbereiten
11. Tracking-Entscheidung (kein GA oder Cookiebot + GA)

**Phase 4 – Mehrsprachigkeit & Mobile:**
12. Englische Version aller Seiten
13. Mobile Ansicht testen (erst mit Living Network, dann ggf. abspecken)
14. Light Mode auf allen Seiten prüfen

**Phase 5 – Feinschliff:**
15. 404-Seite + Danke-Seite
16. Cross-Browser-Test
17. Lighthouse Performance > 90

---

## 12. Changelog

| Datum | Änderung |
|-------|----------|
| 2026-03-16 | Initiale Projektdokumentation erstellt |
| | Analyse CITECH V1 abgeschlossen |
| | Analyse Wegweiser Digital abgeschlossen |
| | Design-Entscheidungen dokumentiert |
| | Technische Architektur definiert |
| | **index.html** – Startseite komplett aufgebaut |
| | **main.css** – Design-System mit 50+ Variablen, Glass-Cards, Ambient BG |
| | **mobile.css** – 4 Responsive Breakpoints |
| | **main.js** – 7 Module inkl. Living Network |
| | Living Network V1: Hero ↔ CITECH Symbol (2 Formationen) |
| | Living Network V2: 5 Formationen (Symbol, Brain, Shield, Steps, Euro) |
| | Hintergrund aufgehellt, Logo-Opacity erhöht |
| | Logos + Fonts aus V1 kopiert |
| | Memory-Einträge für zukünftige Sessions angelegt |
| | **Schulungen-Seite** komplett: 4 Module, Schulungspläne (Modals), Zertifikat-Links, Leitbild |
| | V1-Wording 1:1 übernommen, "100% förderfähig" → ehrliches Förder-Wording |
| | Modal-System (JS + CSS) für Schulungspläne implementiert |
| | Listen-Darstellung statt Skill-Tags (ruhiger), Footer-Buttons einheitlich + zentriert |
| | Logo-Theme-Switch global gemacht (Header + Footer) |
| | Living Network Multi-Page: `detectPage()` erkennt Seite automatisch |
| | Schulungen-Formationen: CITECH Symbol → Glühbirne (SVG Path2D) mit Digit-Overlay → CITECH Symbol |
| | **Erkenntnis**: Geometrische Shapes funktionieren nicht → nur SVG Path2D verwenden |
| | **Erkenntnis**: Konstante Glühbirnen-Intensität wirkt ruhiger als progressive Steigerung |
| | Modulkarten transparent (0.15 opacity, 6px blur) für Hintergrund-Sichtbarkeit |
| | Zertifikate aus V1 kopiert (AZAV, KI-Anwender, KI-Spezialist, KI-Projektleiter) |
| | **Kontakt-Seite**: Formular, Kontaktdaten, Google Maps (DSGVO 2-Klick), Living Network Symbol→Mitte |
| | **Termine-Seite**: 3 Kursblöcke als Tabellen, Kursformate, Timeline Q2→Q3→Q4 |
| | **Team-Seite**: Bios mit Fotos, Skill-Pills statt Listen, Living Network MB→IP |
| | **Beratung-Seite**: Tab-System (Beratung/Leitbild), Accent-Cards, Process-Timeline, Risikoklassen aufsteigend, Pakete-Vergleichstabelle, Checkliste, Versprechen, Living Network §→✓ |
| | **Förderung-Seite**: AZAV als Accent-Cards, Euro-Icon, 5-Schritte als Timeline, Living Network AZAV→QCG→1→5 |
| | **Global**: Scheinwerfer-Hover entfernt → Cyan-Border als Standard |
| | **Erkenntnis**: Text-Shape-Größe skaliert nach Zeichenlänge (≤2: 52%, 3-4: 30%, 5+: 22%) |
| | **Erkenntnis**: Accent-Cards (Cyan-Linker-Rand) wirken lebendiger als flache Glass-Card-Listen |
| | **Erkenntnis**: Process-Timeline (nummerierte Kreise + Verbindungslinie) für Schritte statt Grid |
| | **Erkenntnis**: Tab-System für umfangreiche Seiten (Beratung/Leitbild) statt endloses Scrollen |
| | **Tools-Seite**: RAG als Hauptakt, CITECH-Box Hardware, 4-Schritte-Prozess, Tech-Stack, Living Network RAG |
| | **Legal-Seiten**: Impressum, Datenschutz, AGB – Inhalte 1:1 aus V1, schlichtes Legal-Layout |
| | **Legal Living Network**: § (Impressum), 🔒 (Datenschutz), ⚖ (AGB) – rechtsbündig, einzelne Symbole |
| | **KI-Transparenz**: VERIFY-Prozess, alle 10 Sektionen aus V1, Living Network Symbol→✓→Symbol |
| | **Newsletter**: KI-Radar, 5 Rubriken, Anmeldeformular, Promise-Grid, Living Network Symbol→@ |
| | **Alle 13 Seiten inhaltlich komplett** – Content-Audit bestätigt 100% Übernahme aus V1 |
| | Offene Punkte dokumentiert: Startseite Hero, Kontakt-Slide, EN-Version, .htaccess, Fonts, Mobile, SEO |
