/* ============================================
   AI Final Revision — Application Engine
   ============================================ */

// ── Topic Registry ──────────────────────────────
const TOPICS = [
    { id: 'k-means', file: 'K-Means Clustering.md', title: 'K-Means Clustering', icon: '🔵', desc: 'Unsupervised clustering algorithm partitioning data into K groups' },
    { id: 'hierarchical', file: 'Hierarchical Clustering (Agglomerative).md', title: 'Hierarchical Clustering', icon: '🌳', desc: 'Bottom-up agglomerative clustering with dendrograms' },
    { id: 'knn', file: 'K-Nearest Neighbours (KNN).md', title: 'K-Nearest Neighbours (KNN)', icon: '📍', desc: 'Instance-based lazy learning classifier using distance voting' },
    { id: 'svm', file: 'Support Vector Machines (SVM).md', title: 'Support Vector Machines (SVM)', icon: '⚔️', desc: 'Maximum margin classifier finding the optimal hyperplane' },
    { id: 'linear-regression', file: 'Linear Regression (Ordinary Least Squares).md', title: 'Linear Regression (OLS)', icon: '📈', desc: 'Ordinary Least Squares regression for continuous prediction' },
    { id: 'q-learning', file: 'Q-Learning.md', title: 'Q-Learning', icon: '🎮', desc: 'Reinforcement learning with Bellman equation and reward matrices' },
    { id: 'anomaly', file: 'Anomaly Detection.md', title: 'Anomaly Detection', icon: '🔍', desc: 'Z-Score, IQR, and Modified Z-Score outlier detection methods' },
    { id: 'ann', file: 'Artificial Neural Networks (ANN).md', title: 'Neural Networks (ANN)', icon: '🧠', desc: 'Feedforward networks, activation functions, and backpropagation' },
    { id: 'validation', file: 'Model Validation Strategies (Resampling).md', title: 'Model Validation', icon: '✅', desc: 'K-Fold, LOOCV, Holdout, and cross-validation strategies' },
    { id: 'confusion', file: 'Confusion Matrix & Performance Metrics.md', title: 'Confusion Matrix & Metrics', icon: '📊', desc: 'TP, FP, Precision, Recall, F1-Score, and multi-class analysis' },
    { id: 'ga', file: 'Genetic Algorithms (GA) & Meta-Heuristics.md', title: 'Genetic Algorithms (GA)', icon: '🧬', desc: 'Evolutionary meta-heuristics with selection, crossover, and mutation' },
];

// ── State ───────────────────────────────────────
let currentTopic = null;
let contentCache = {};
let tocObserver = null;

// ── DOM Elements ────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const sidebar = $('#sidebar');
const sidebarNav = $('#sidebar-nav');
const sidebarOverlay = $('#sidebar-overlay');
const sidebarClose = $('#sidebar-close');
const menuToggle = $('#menu-toggle');
const searchInput = $('#search-input');
const themeToggle = $('#theme-toggle');

const mainContent = $('#main-content');
const welcomeScreen = $('#welcome-screen');
const articleContent = $('#article-content');
const articleBody = $('#article-body');
const articleNav = $('#article-nav');
const breadcrumbCurrent = $('#breadcrumb-current');
const topicGrid = $('#topic-grid');

const tocToggle = $('#toc-toggle');
const tocPanel = $('#toc-panel');
const tocClose = $('#toc-close');
const tocNav = $('#toc-nav');

const scrollTopBtn = $('#scroll-top');
const loadingScreen = $('#loading-screen');

// ── Initialize ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupMarked();
    buildSidebar();
    buildTopicGrid();
    bindEvents();
    handleHashRoute();

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 400);
});

// ── Theme Management ────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('ai-revision-theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ai-revision-theme', next);
}

// ── Configure Marked.js once ────────────────────
function setupMarked() {
    const renderer = new marked.Renderer();

    // Wrap tables in scrollable containers
    renderer.table = function(header, body) {
        if (typeof header === 'object' && header.header !== undefined) {
            return `<div class="table-wrapper"><table><thead>${header.header}</thead><tbody>${header.body}</tbody></table></div>`;
        }
        return `<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    };

    // Custom image renderer
    renderer.image = function(href, title, text) {
        if (typeof href === 'object') {
            text = href.text || '';
            title = href.title || '';
            href = href.href || '';
        }
        const alt = text || '';
        const titleAttr = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${alt}"${titleAttr} loading="lazy">`;
    };

    // Code blocks with Mermaid support
    renderer.code = function(code, lang) {
        if (typeof code === 'object') {
            lang = code.lang || '';
            code = code.text || '';
        }
        if (lang === 'mermaid') {
            return `<div class="mermaid">${code}</div>`;
        }
        const escaped = escapeHtml(code);
        const langClass = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${langClass}>${escaped}</code></pre>`;
    };

    marked.use({
        renderer,
        gfm: true,
        breaks: false,
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Build Sidebar Nav ───────────────────────────
function buildSidebar() {
    sidebarNav.innerHTML = TOPICS.map(t => `
        <a class="nav-item" href="#${t.id}" data-topic="${t.id}">
            <span class="nav-icon">${t.icon}</span>
            <span class="nav-label">${t.title}</span>
        </a>
    `).join('');
}

// ── Build Welcome Topic Grid ────────────────────
function buildTopicGrid() {
    topicGrid.innerHTML = TOPICS.map(t => `
        <div class="topic-card" data-topic="${t.id}">
            <div class="topic-card-icon">${t.icon}</div>
            <div class="topic-card-title">${t.title}</div>
            <div class="topic-card-desc">${t.desc}</div>
        </div>
    `).join('');
}

// ── Event Binding ───────────────────────────────
function bindEvents() {
    sidebarNav.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (item) {
            e.preventDefault();
            navigateToTopic(item.dataset.topic);
        }
    });

    topicGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.topic-card');
        if (card) navigateToTopic(card.dataset.topic);
    });

    menuToggle.addEventListener('click', () => openSidebar());
    sidebarClose.addEventListener('click', () => closeSidebar());
    sidebarOverlay.addEventListener('click', () => closeSidebar());
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    tocToggle.addEventListener('click', toggleToc);
    tocClose.addEventListener('click', () => closeToc());

    scrollTopBtn.addEventListener('click', () => {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
    mainContent.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', mainContent.scrollTop > 300);
    });

    window.addEventListener('hashchange', handleHashRoute);
}

// ── Sidebar Mobile ──────────────────────────────
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

// ── Search ──────────────────────────────────────
function handleSearch() {
    const q = searchInput.value.toLowerCase().trim();
    $$('.nav-item').forEach(item => {
        const label = item.querySelector('.nav-label').textContent.toLowerCase();
        item.style.display = label.includes(q) ? '' : 'none';
    });
}

// ── TOC Panel ───────────────────────────────────
function toggleToc() {
    const isOpen = tocPanel.classList.toggle('open');
    tocToggle.classList.toggle('active', isOpen);
}

function closeToc() {
    tocPanel.classList.remove('open');
    tocToggle.classList.remove('active');
}

// ── Navigation ──────────────────────────────────
function handleHashRoute() {
    const hash = window.location.hash.slice(1);
    if (hash && TOPICS.find(t => t.id === hash)) {
        navigateToTopic(hash, false);
    }
}

async function navigateToTopic(topicId, pushHash = true) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    currentTopic = topic;

    if (pushHash) {
        history.pushState(null, '', `#${topicId}`);
    }

    $$('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.topic === topicId);
    });

    breadcrumbCurrent.textContent = topic.title;
    document.title = `${topic.title} — AI Final Revision`;

    welcomeScreen.style.display = 'none';
    articleContent.style.display = '';
    articleContent.style.animation = 'none';
    articleContent.offsetHeight;
    articleContent.style.animation = '';

    await loadAndRender(topic);

    mainContent.scrollTo({ top: 0, behavior: 'instant' });
    closeSidebar();
    buildArticleNav(topicId);
}

// ── Content Loading & Rendering ─────────────────
async function loadAndRender(topic) {
    if (contentCache[topic.id]) {
        articleBody.innerHTML = contentCache[topic.id];
        postRender();
        return;
    }

    articleBody.innerHTML = '<div class="loading-text" style="text-align:center; padding: 3rem;">Loading content…</div>';

    try {
        const encodedFile = encodeURIComponent(topic.file);
        const res = await fetch(`content/${encodedFile}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let md = await res.text();

        // Full rendering pipeline
        const finalHtml = renderPipeline(md);

        contentCache[topic.id] = finalHtml;
        articleBody.innerHTML = finalHtml;
        postRender();

    } catch (err) {
        console.error('Failed to load:', err);
        articleBody.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-tertiary);">
            <p>⚠️ Failed to load content.</p>
            <p style="font-size: 0.82rem; margin-top: 0.5rem;">Error: ${err.message}</p>
        </div>`;
    }
}

// ═══════════════════════════════════════════════
//  RENDERING PIPELINE
//  1. Normalize → 2. Fix Images → 3. Extract Callouts
//  → 4. Protect Math → 5. Marked parse → 6. Restore Math
//  → 7. Insert Callouts → 8. Add heading IDs
// ═══════════════════════════════════════════════

let mathStore = [];
let calloutStore = [];

function renderPipeline(md) {
    // Step 1: Normalize line endings
    md = md.replace(/\r\n/g, '\n');

    // Step 2: Fix image paths
    md = md.replace(/!\[([^\]]*)\]\(\.\.\/(99_Assets|Assets)\//g, '![$1](assets/');

    // Step 3: Extract callouts and replace with placeholders
    const { text: mdNoCallouts, callouts } = extractCallouts(md);

    // Step 4: Protect math blocks from marked.js
    const { text: mdProtected, mathItems } = protectMath(mdNoCallouts);

    // Step 5: Parse with marked
    let html = marked.parse(mdProtected);

    // Step 6: Restore math
    html = restoreMath(html, mathItems);

    // Step 7: Insert rendered callouts
    html = insertCallouts(html, callouts);

    // Step 8: Clean up & add heading IDs
    html = finalizeHtml(html);

    return html;
}

function extractCallouts(md) {
    const lines = md.split('\n');
    const result = [];
    const callouts = [];
    let i = 0;
    let calloutId = 0;

    while (i < lines.length) {
        const calloutMatch = lines[i].match(/^>\s*\[!(\w+)\]\s*(.*)/);
        if (calloutMatch) {
            const type = calloutMatch[1].toLowerCase();
            const title = calloutMatch[2] || type.charAt(0).toUpperCase() + type.slice(1);
            const bodyLines = [];

            i++;
            while (i < lines.length && /^>/.test(lines[i])) {
                bodyLines.push(lines[i].replace(/^>\s?/, ''));
                i++;
            }

            const placeholder = `\n%%CALLOUT_${calloutId}%%\n`;
            callouts.push({ id: calloutId, type, title, body: bodyLines.join('\n') });
            calloutId++;
            result.push(placeholder);
        } else {
            result.push(lines[i]);
            i++;
        }
    }

    return { text: result.join('\n'), callouts };
}

function protectMath(md) {
    const items = [];
    let counter = 0;

    // Display math ($$...$$) — multi-line
    md = md.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
        const id = `%%MATH_${counter++}%%`;
        items.push({ id, content: match });
        return id;
    });

    // Inline math ($...$) — single line, avoid false positives
    md = md.replace(/(?<![\\$])\$(?!\$)([^\$\n]+?)\$(?!\$)/g, (match) => {
        const id = `%%MATH_${counter++}%%`;
        items.push({ id, content: match });
        return id;
    });

    return { text: md, mathItems: items };
}

function restoreMath(html, items) {
    for (const item of items) {
        // The placeholder might have been wrapped in <p> tags by marked
        html = html.split(item.id).join(item.content);
    }
    return html;
}

function insertCallouts(html, callouts) {
    const iconMap = {
        tip: '💡', info: 'ℹ️', warning: '⚠️', caution: '⚠️',
        danger: '🔴', important: '❗', success: '✅', note: '📝',
        example: '📋'
    };

    for (const c of callouts) {
        const icon = iconMap[c.type] || '📌';

        // Protect math inside callout body too
        const { text: protectedBody, mathItems: bodyMath } = protectMath(c.body);
        let bodyHtml = marked.parse(protectedBody);
        bodyHtml = restoreMath(bodyHtml, bodyMath);

        const calloutHtml = `<div class="callout callout-${c.type}">
            <div class="callout-title"><span class="callout-title-icon">${icon}</span> ${c.title}</div>
            <div class="callout-body">${bodyHtml}</div>
        </div>`;

        // Replace the placeholder (might be wrapped in <p> tags)
        const placeholderPattern = new RegExp(`(<p>)?\\s*%%CALLOUT_${c.id}%%\\s*(</p>)?`, 'g');
        html = html.replace(placeholderPattern, calloutHtml);
    }

    return html;
}

function finalizeHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Add IDs to headings for TOC
    let counter = 0;
    temp.querySelectorAll('h2, h3, h4').forEach(h => {
        const slug = h.textContent.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        h.id = `${slug}-${counter++}`;
    });

    return temp.innerHTML;
}

// ── Post-render: KaTeX, Mermaid, TOC ────────────
function postRender() {
    renderMath();
    renderMermaidDiagrams();
    buildToc();
    setupTocObserver();
}

function renderMath() {
    const tryRender = () => {
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(articleBody, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                ],
                throwOnError: false,
                trust: true,
                strict: false,
            });
            return true;
        }
        return false;
    };

    if (!tryRender()) {
        let attempts = 0;
        const interval = setInterval(() => {
            if (tryRender() || ++attempts > 20) {
                clearInterval(interval);
            }
        }, 200);
    }
}

function renderMermaidDiagrams() {
    const mermaidDivs = articleBody.querySelectorAll('.mermaid');
    if (mermaidDivs.length === 0) return;

    loadMermaid().then(() => {
        if (window.mermaid) {
            mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
                securityLevel: 'loose',
            });
            mermaid.run({ nodes: mermaidDivs });
        }
    });
}

let mermaidLoaded = false;
function loadMermaid() {
    if (mermaidLoaded) return Promise.resolve();
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js';
        script.onload = () => { mermaidLoaded = true; resolve(); };
        script.onerror = () => resolve();
        document.head.appendChild(script);
    });
}

// ── Table of Contents ───────────────────────────
function buildToc() {
    const headings = articleBody.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        tocNav.innerHTML = '<p style="font-size:0.8rem; color: var(--text-tertiary);">No headings found.</p>';
        return;
    }

    tocNav.innerHTML = Array.from(headings).map(h => {
        const level = h.tagName === 'H3' ? 'toc-h3' : '';
        return `<a href="#${h.id}" class="${level}" data-toc-target="${h.id}">${h.textContent}</a>`;
    }).join('');

    tocNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.tocTarget);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupTocObserver() {
    if (tocObserver) tocObserver.disconnect();

    const headings = articleBody.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    tocObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                const link = tocNav.querySelector(`[data-toc-target="${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, {
        root: mainContent,
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
    });

    headings.forEach(h => tocObserver.observe(h));
}

// ── Article Navigation (Prev/Next) ──────────────
function buildArticleNav(topicId) {
    const idx = TOPICS.findIndex(t => t.id === topicId);
    const prev = idx > 0 ? TOPICS[idx - 1] : null;
    const next = idx < TOPICS.length - 1 ? TOPICS[idx + 1] : null;

    let html = '';

    if (prev) {
        html += `<a class="article-nav-btn prev" href="#${prev.id}" data-topic="${prev.id}">
            <span class="article-nav-label">← Previous</span>
            <span class="article-nav-title">${prev.title}</span>
        </a>`;
    } else {
        html += '<div></div>';
    }

    if (next) {
        html += `<a class="article-nav-btn next" href="#${next.id}" data-topic="${next.id}">
            <span class="article-nav-label">Next →</span>
            <span class="article-nav-title">${next.title}</span>
        </a>`;
    }

    articleNav.innerHTML = html;

    articleNav.querySelectorAll('.article-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToTopic(btn.dataset.topic);
        });
    });
}
