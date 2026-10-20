const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const avatarCvPath = path.join(rootDir, 'public', 'assets', 'avatar_cv.jpg');
const avatarOriginalPath = path.join(rootDir, 'public', 'assets', 'avatar.jpg');

let avatarBase64 = '';
if (fs.existsSync(avatarCvPath)) {
  avatarBase64 = `data:image/jpeg;base64,${fs.readFileSync(avatarCvPath).toString('base64')}`;
} else if (fs.existsSync(avatarOriginalPath)) {
  avatarBase64 = `data:image/jpeg;base64,${fs.readFileSync(avatarOriginalPath).toString('base64')}`;
}

const cvHtml = `<!DOCTYPE html>
<html lang="en" data-cv-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abdellah BELMAARIS — Executive Curriculum Vitae</title>
  <meta name="description" content="Official Curriculum Vitae of Abdellah BELMAARIS — Full-Stack Developer & Backend Systems Specialist at BIMPulse.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* ─── Visual Theme Design System ────────────────────────────────────────── */
    :root {
      /* Screen Theme: Cyber Obsidian Pro (Default) */
      --bg-canvas: #070b14;
      --bg-page: #0c1222;
      --bg-card: rgba(18, 27, 47, 0.75);
      --bg-card-subtle: rgba(23, 34, 59, 0.6);
      --bg-pill: rgba(2, 132, 199, 0.15);
      --border: rgba(255, 255, 255, 0.1);
      --border-accent: rgba(56, 189, 248, 0.35);
      --border-emerald: rgba(16, 185, 129, 0.35);
      --text: #f8fafc;
      --text-muted: #cbd5e1;
      --text-sub: #94a3b8;
      --accent: #38bdf8;
      --accent-dark: #0284c7;
      --accent-gradient: linear-gradient(135deg, #00e5ff 0%, #0284c7 100%);
      --emerald: #10b981;
      --emerald-gradient: linear-gradient(135deg, #34d399 0%, #059669 100%);
      --purple: #a855f7;
      --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    }

    [data-cv-theme="light"] {
      --bg-canvas: #eef2f6;
      --bg-page: #ffffff;
      --bg-card: #f8fafc;
      --bg-card-subtle: #f1f5f9;
      --bg-pill: rgba(2, 132, 199, 0.08);
      --border: #e2e8f0;
      --border-accent: #bae6fd;
      --border-emerald: #a7f3d0;
      --text: #0f172a;
      --text-muted: #334155;
      --text-sub: #64748b;
      --accent: #0284c7;
      --accent-dark: #0369a1;
      --accent-gradient: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      --emerald: #059669;
      --emerald-gradient: linear-gradient(135deg, #059669 0%, #047857 100%);
      --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.06), 0 0 0 1px #e2e8f0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background: var(--bg-canvas);
      color: var(--text);
      line-height: 1.44;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 60px;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    /* ─── Screen Header Toolbar ────────────────────────────────────────────── */
    .screen-action-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(12, 18, 34, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }
    .action-bar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      font-weight: 700;
      font-size: 13.5px;
      white-space: nowrap;
    }
    .action-bar-brand .logo-badge {
      background: var(--accent-gradient);
      color: #000;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 11.5px;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
    }
    .doc-spec-pill {
      font-family: var(--font-mono);
      font-size: 10.5px;
      background: rgba(2, 132, 199, 0.2);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .action-bar-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 7px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .btn-action.btn-accent {
      background: #0284c7;
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(2, 132, 199, 0.4);
    }
    .btn-action.btn-accent:hover {
      background: #0369a1;
      transform: translateY(-1px);
    }
    .btn-action.btn-ghost {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.16);
      color: #e2e8f0;
    }
    .btn-action.btn-ghost:hover {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
    }
    .theme-toggle-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 7px;
    }

    /* ─── Document Container (A4 Pro Layout) ─────────────────────────────────── */
    .cv-pages-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      margin: 24px auto;
      max-width: 100%;
      padding: 0 12px;
    }

    .cv-page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      box-sizing: border-box;
      background: var(--bg-page);
      border-radius: 10px;
      box-shadow: var(--card-shadow);
      border: 1px solid var(--border);
      padding: 10mm 12mm 8mm 12mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      transition: background-color 0.25s, border-color 0.25s;
    }

    .cv-page-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ─── Visual Header Card ───────────────────────────────────────────────── */
    .cv-header-pro {
      display: grid;
      grid-template-columns: 82px 1fr;
      gap: 18px;
      align-items: center;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      border-left: 4px solid var(--accent);
      margin-bottom: 8px;
      position: relative;
    }
    .cv-avatar-wrap {
      position: relative;
      width: 80px;
      height: 80px;
    }
    .cv-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      border: 2.5px solid var(--accent);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }
    .cv-avatar-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: var(--emerald);
      border: 2.5px solid var(--bg-page);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--emerald);
    }
    .cv-identity-block {
      display: flex;
      flex-direction: column;
    }
    .cv-role-kicker {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-family: var(--font-mono);
      font-size: 9.2px;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 1px;
    }
    .cv-full-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.6px;
      line-height: 1.1;
      color: var(--text);
    }
    .cv-headline {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--accent);
      margin-top: 1px;
    }
    .cv-headline-company {
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Visual Contact Badges */
    .cv-contacts-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      margin-top: 6px;
      font-size: 10.5px;
      color: var(--text-muted);
    }
    .cv-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 500;
      padding: 1.5px 6px;
      border-radius: 4px;
      background: var(--bg-pill);
      border: 1px solid var(--border-accent);
      transition: all 0.2s;
    }
    .cv-contact-item:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
    .cv-contact-item i {
      color: var(--accent);
      font-size: 10px;
    }

    /* ─── Visual Metrics Grid ──────────────────────────────────────────────── */
    .cv-metrics-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
      margin-bottom: 8px;
    }
    .cv-metric-box {
      text-align: center;
      padding: 6px 4px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 7px;
      position: relative;
      overflow: hidden;
      border-top: 2px solid var(--accent);
    }
    .cv-metric-box:nth-child(2) { border-top-color: var(--emerald); }
    .cv-metric-box:nth-child(3) { border-top-color: #818cf8; }
    .cv-metric-box:nth-child(4) { border-top-color: #f59e0b; }
    .cv-metric-val {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.2;
    }
    .cv-metric-lbl {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-sub);
    }

    /* ─── Visual Section Titles ────────────────────────────────────────────── */
    .section-title-visual {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--text);
      margin: 8px 0 5px;
      padding-bottom: 3px;
      border-bottom: 1.5px solid var(--border);
    }
    .title-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .title-left i {
      color: var(--accent);
      font-size: 11px;
    }
    .section-badge-code {
      font-family: var(--font-mono);
      font-size: 8.5px;
      font-weight: 700;
      color: var(--text-sub);
      background: var(--bg-pill);
      padding: 1px 5px;
      border-radius: 3px;
    }

    /* ─── Executive Summary Card ───────────────────────────────────────────── */
    .cv-summary-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-left: 3px solid var(--accent);
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 7px;
    }
    .cv-summary-text {
      font-size: 10.4px;
      line-height: 1.48;
      color: var(--text-muted);
      text-align: justify;
    }
    .cv-summary-text strong {
      color: var(--text);
      font-weight: 700;
    }

    /* ─── Visual Technical Competencies Matrix ─────────────────────────────── */
    .skills-matrix-visual {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px 10px;
      margin-bottom: 7px;
    }
    .skill-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 8px;
    }
    .skill-card-header {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--accent);
      margin-bottom: 3px;
    }
    .skill-card-header i {
      font-size: 9px;
    }
    .skill-pills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
    }
    .skill-tag {
      font-size: 9.2px;
      font-weight: 600;
      padding: 1.5px 5.5px;
      border-radius: 3px;
      background: var(--bg-card-subtle);
      border: 1px solid var(--border);
      color: var(--text-muted);
      white-space: nowrap;
    }
    .skill-tag.core {
      background: var(--bg-pill);
      border-color: var(--border-accent);
      color: var(--accent);
      font-weight: 700;
    }

    /* ─── Visual Work Experience Cards ─────────────────────────────────────── */
    .exp-visual-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 7px;
      padding: 7px 10px;
      margin-bottom: 6px;
      position: relative;
      border-left: 3px solid var(--accent);
    }
    .exp-visual-card.highlight {
      border-left-color: var(--emerald);
    }
    .exp-top-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }
    .exp-role-title {
      font-size: 11.8px;
      font-weight: 800;
      color: var(--text);
    }
    .exp-date-chip {
      font-family: var(--font-mono);
      font-size: 9px;
      font-weight: 700;
      color: var(--accent);
      background: var(--bg-pill);
      border: 1px solid var(--border-accent);
      padding: 1.5px 6px;
      border-radius: 4px;
    }
    .exp-date-chip.active-chip {
      color: var(--emerald);
      border-color: var(--border-emerald);
      background: rgba(16, 185, 129, 0.15);
    }
    .exp-company-sub {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 4px;
    }
    .exp-company-sub span {
      color: var(--text-sub);
      font-weight: 500;
    }
    .exp-bullets-list {
      list-style: none;
      padding-left: 0;
    }
    .exp-bullets-list li {
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.44;
      margin-bottom: 2.5px;
      position: relative;
      padding-left: 12px;
    }
    .exp-bullets-list li::before {
      content: '◈';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-size: 9px;
      top: -1px;
    }
    .exp-visual-card.highlight .exp-bullets-list li::before {
      color: var(--emerald);
    }
    .exp-bullets-list li strong {
      color: var(--text);
      font-weight: 700;
    }
    .exp-tags-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px dashed var(--border);
    }
    .exp-mini-tag {
      font-family: var(--font-mono);
      font-size: 8.5px;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 3px;
      background: var(--bg-card-subtle);
      border: 1px solid var(--border);
      color: var(--text-sub);
    }

    /* ─── Visual Projects Grid (Page 2) ────────────────────────────────────── */
    .projects-visual-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-bottom: 7px;
    }
    .project-visual-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 7px 9px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .project-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }
    .project-card-title {
      font-size: 10.8px;
      font-weight: 800;
      color: var(--text);
    }
    .project-badge-tag {
      font-family: var(--font-mono);
      font-size: 8px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(16, 185, 129, 0.15);
      color: var(--emerald);
      border: 1px solid var(--border-emerald);
      white-space: nowrap;
    }
    .project-card-desc {
      font-size: 9.5px;
      color: var(--text-muted);
      line-height: 1.38;
      margin-bottom: 4px;
    }
    .project-pills-row {
      display: flex;
      gap: 6px;
      font-size: 8.6px;
      color: var(--accent);
      font-weight: 700;
    }

    /* ─── Visual Credentials Grid ──────────────────────────────────────────── */
    .credentials-visual-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-bottom: 7px;
    }
    .cred-visual-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-left: 3px solid var(--accent);
      border-radius: 6px;
      padding: 6px 8px;
    }
    .cred-visual-card:nth-child(2) { border-left-color: var(--emerald); }
    .cred-visual-card:nth-child(3) { border-left-color: #f59e0b; }
    .cred-visual-card:nth-child(4) { border-left-color: #818cf8; }
    .cred-title-row {
      font-size: 10.5px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.25;
    }
    .cred-meta-row {
      font-size: 9.2px;
      color: var(--text-sub);
      display: flex;
      justify-content: space-between;
      margin-top: 1px;
    }
    .cred-code-chip {
      font-family: var(--font-mono);
      font-size: 8.4px;
      color: var(--accent);
      background: var(--bg-pill);
      border: 1px solid var(--border-accent);
      padding: 1px 4px;
      border-radius: 3px;
      display: inline-block;
      margin-top: 2px;
    }

    /* ─── Visual Education & Languages 2-Col Split ─────────────────────────── */
    .bottom-visual-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 5px;
    }
    .edu-visual-card, .lang-visual-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 6px 9px;
    }
    .edu-row-item {
      margin-bottom: 4px;
    }
    .edu-row-item:last-child {
      margin-bottom: 0;
    }
    .edu-row-title {
      font-size: 10.2px;
      font-weight: 800;
      color: var(--text);
    }
    .edu-row-inst {
      font-size: 9.2px;
      color: var(--text-muted);
    }
    .edu-row-date {
      font-family: var(--font-mono);
      font-size: 8.5px;
      color: var(--text-sub);
    }

    /* ─── Page Footers ─────────────────────────────────────────────────────── */
    .cv-page-footer {
      padding-top: 5px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.8px;
      color: var(--text-sub);
    }
    .cv-page-footer a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
    }

    /* ─── Mobile Responsiveness (Phones 320px - 768px) ─────────────────────── */
    @media (max-width: 800px) {
      body {
        padding-bottom: 30px;
      }
      .screen-action-bar {
        padding: 8px 12px;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      .action-bar-brand {
        justify-content: space-between;
        font-size: 12.5px;
      }
      .action-bar-buttons {
        justify-content: space-between;
        gap: 6px;
      }
      .btn-action {
        padding: 6px 10px;
        font-size: 11px;
        flex: 1;
        justify-content: center;
      }
      .theme-toggle-btn {
        flex: 0 0 32px;
      }
      .cv-pages-wrapper {
        margin: 12px auto;
        padding: 0 8px;
        gap: 16px;
      }
      .cv-page {
        width: 100%;
        height: auto;
        max-height: none;
        padding: 16px 12px;
        border-radius: 8px;
      }
      .cv-header-pro {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 14px 10px;
      }
      .cv-avatar-wrap {
        margin: 0 auto;
      }
      .cv-contacts-bar {
        justify-content: center;
      }
      .cv-metrics-strip {
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
      .skills-matrix-visual,
      .projects-visual-grid,
      .credentials-visual-grid,
      .bottom-visual-split {
        grid-template-columns: 1fr;
        gap: 6px;
      }
      .cv-page-footer {
        flex-direction: column;
        gap: 4px;
        text-align: center;
      }
    }

    /* ─── Print Engine (Forces Pristine 2-Page White A4) ───────────────────── */
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      body, html {
        background: #ffffff !important;
        color: #0f172a !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .screen-action-bar {
        display: none !important;
      }
      .cv-pages-wrapper {
        margin: 0 !important;
        padding: 0 !important;
        gap: 0 !important;
      }
      .cv-page {
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        margin: 0 !important;
        padding: 9.5mm 12mm 7.5mm 12mm !important;
        background: #ffffff !important;
        color: #0f172a !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        overflow: hidden !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .cv-page:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .cv-header-pro,
      .cv-summary-card,
      .cv-metric-box,
      .skill-card,
      .exp-visual-card,
      .project-visual-card,
      .cred-visual-card,
      .edu-visual-card,
      .lang-visual-card {
        background: #f8fafc !important;
        border-color: #cbd5e1 !important;
        color: #0f172a !important;
        box-shadow: none !important;
      }
      .cv-full-name,
      .exp-role-title,
      .project-card-title,
      .cred-title-row,
      .edu-row-title,
      .cv-metric-val {
        color: #0f172a !important;
      }
      .cv-summary-text,
      .exp-bullets-list li,
      .project-card-desc,
      .edu-row-inst {
        color: #334155 !important;
      }
      .skill-tag,
      .exp-mini-tag {
        background: #f1f5f9 !important;
        border-color: #cbd5e1 !important;
        color: #1e293b !important;
      }
      .cv-contact-item {
        background: #f1f5f9 !important;
        border-color: #cbd5e1 !important;
        color: #334155 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar -->
  <aside class="screen-action-bar" aria-label="CV controls">
    <div class="action-bar-brand">
      <span class="logo-badge">AB.</span>
      <span style="font-weight: 700;">Abdellah BELMAARIS — Executive CV</span>
      <span class="doc-spec-pill">2 Pages · ATS Ready · PDF</span>
    </div>
    <div class="action-bar-buttons">
      <a href="/" class="btn-action btn-ghost" title="Return to interactive portfolio">
        <i class="fa-solid fa-arrow-left"></i> Portfolio
      </a>
      <a href="/assets/Abdellah_BELMAARIS_CV.pdf" download="Abdellah_BELMAARIS_CV.pdf" class="btn-action btn-accent" id="cv-download-pdf-btn" title="Download official high-res PDF file">
        <i class="fa-solid fa-file-arrow-down"></i> Download PDF
      </a>
      <button onclick="window.print()" class="btn-action btn-ghost" title="Print document or save via browser engine">
        <i class="fa-solid fa-print"></i> Print
      </button>
      <button onclick="toggleTheme()" class="btn-action btn-ghost theme-toggle-btn" id="theme-btn" title="Toggle Visual Dark / Paper Light">
        <i class="fa-solid fa-sun" id="theme-icon"></i>
      </button>
      <a href="/CV.md" target="_blank" class="btn-action btn-ghost" title="View Markdown plain text">
        <i class="fa-solid fa-code"></i> MD
      </a>
    </div>
  </aside>

  <!-- Physical Document Wrapper -->
  <main class="cv-pages-wrapper">

    <!-- ════════════════════ PAGE 1 ════════════════════ -->
    <article class="cv-page cv-page-1">
      <div class="cv-page-content">

        <!-- Visual Header Card -->
        <header class="cv-header-pro">
          <div class="cv-avatar-wrap">
            <img src="${avatarBase64}" alt="Abdellah BELMAARIS" class="cv-avatar" />
            <span class="cv-avatar-status" title="Active & Available"></span>
          </div>
          <div class="cv-identity-block">
            <span class="cv-role-kicker">
              <i class="fa-solid fa-circle-check"></i> Available for Full-Stack & Backend Engineering Roles
            </span>
            <h1 class="cv-full-name">Abdellah BELMAARIS</h1>
            <div class="cv-headline">
              Junior Full-Stack Developer & Backend Systems Specialist
              <span class="cv-headline-company">• BIMPulse (Casablanca, Morocco)</span>
            </div>

            <div class="cv-contacts-bar">
              <span class="cv-contact-item">
                <i class="fa-solid fa-location-dot"></i> Casablanca, Morocco
              </span>
              <a href="mailto:obaidbelmaaris@gmail.com" class="cv-contact-item">
                <i class="fa-solid fa-envelope"></i> obaidbelmaaris@gmail.com
              </a>
              <a href="https://linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer" class="cv-contact-item">
                <i class="fa-brands fa-linkedin"></i> linkedin.com/in/abdellah-belmaaris
              </a>
              <a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer" class="cv-contact-item">
                <i class="fa-brands fa-github"></i> github.com/Abdellah-BELMAARIS
              </a>
              <a href="https://abdellah-belmaaris.github.io" target="_blank" rel="noopener noreferrer" class="cv-contact-item">
                <i class="fa-solid fa-globe"></i> abdellah-belmaaris.github.io
              </a>
            </div>
          </div>
        </header>

        <!-- Visual Metrics Strip -->
        <div class="cv-metrics-strip">
          <div class="cv-metric-box">
            <div class="cv-metric-val">14 ROLES</div>
            <div class="cv-metric-lbl">RBAC Architecture</div>
          </div>
          <div class="cv-metric-box">
            <div class="cv-metric-val">O(1) TIME</div>
            <div class="cv-metric-lbl">SQL Optimization</div>
          </div>
          <div class="cv-metric-box">
            <div class="cv-metric-val">4+ CERTS</div>
            <div class="cv-metric-lbl">DataCamp AI & Python</div>
          </div>
          <div class="cv-metric-box">
            <div class="cv-metric-val">&lt; 200ms</div>
            <div class="cv-metric-lbl">Telemetry Engine</div>
          </div>
        </div>

        <!-- Visual Executive Summary Card -->
        <section>
          <div class="section-title-visual">
            <span class="title-left"><i class="fa-solid fa-user-astronaut"></i> Executive Summary</span>
            <span class="section-badge-code">01 // PROFILE</span>
          </div>
          <div class="cv-summary-card">
            <p class="cv-summary-text">
              Performance-driven <strong>Full-Stack Software Developer</strong> operating at the intersection of enterprise backend architecture, AEC digital transformation, and applied artificial intelligence at <strong>BIMPulse</strong>. Specialized in engineering high-throughput <strong>Python/Django REST</strong> backends, normalized <strong>PostgreSQL</strong> schemas, and modern responsive <strong>React/TypeScript</strong> interfaces. Proven track record in eliminating severe N+1 SQL bottlenecks to <strong>constant O(1) query time</strong> and architecting granular <strong>14-role Role-Based Access Control (RBAC)</strong> security engines. Certified by DataCamp in Applied AI Engineering (LLMs, RAG Architectures) and Python Data Analytics.
            </p>
          </div>
        </section>

        <!-- Visual Technical Stack Matrix -->
        <section>
          <div class="section-title-visual">
            <span class="title-left"><i class="fa-solid fa-layer-group"></i> Technical Core & Capabilities</span>
            <span class="section-badge-code">02 // STACK</span>
          </div>
          <div class="skills-matrix-visual">
            <div class="skill-card">
              <div class="skill-card-header">
                <i class="fa-solid fa-server"></i> Backend & Systems
              </div>
              <div class="skill-pills-wrap">
                <span class="skill-tag core">Python 3.12</span>
                <span class="skill-tag core">Django</span>
                <span class="skill-tag core">Django REST Framework</span>
                <span class="skill-tag core">PostgreSQL</span>
                <span class="skill-tag">SQL Optimization</span>
                <span class="skill-tag">RESTful APIs</span>
                <span class="skill-tag">JWT</span>
                <span class="skill-tag">14 RBAC Roles</span>
                <span class="skill-tag">Celery / Redis</span>
              </div>
            </div>
            <div class="skill-card">
              <div class="skill-card-header">
                <i class="fa-solid fa-code"></i> Frontend Engineering
              </div>
              <div class="skill-pills-wrap">
                <span class="skill-tag core">React 19</span>
                <span class="skill-tag core">TypeScript</span>
                <span class="skill-tag">JavaScript (ES6+)</span>
                <span class="skill-tag">HTML5 / Semantic CSS3</span>
                <span class="skill-tag">Three.js / WebGL</span>
                <span class="skill-tag">Vite</span>
                <span class="skill-tag">Responsive UI</span>
                <span class="skill-tag">Framer Motion</span>
              </div>
            </div>
            <div class="skill-card">
              <div class="skill-card-header">
                <i class="fa-solid fa-brain"></i> Applied AI & Data
              </div>
              <div class="skill-pills-wrap">
                <span class="skill-tag core">Pandas</span>
                <span class="skill-tag">NumPy</span>
                <span class="skill-tag">Matplotlib</span>
                <span class="skill-tag core">LLM API Integration</span>
                <span class="skill-tag">RAG Architectures</span>
                <span class="skill-tag">Prompt Engineering</span>
                <span class="skill-tag">Data Cleaning Pipelines</span>
              </div>
            </div>
            <div class="skill-card">
              <div class="skill-card-header">
                <i class="fa-solid fa-cubes"></i> Architecture & DevOps
              </div>
              <div class="skill-pills-wrap">
                <span class="skill-tag core">Clean Architecture</span>
                <span class="skill-tag">GoF Design Patterns</span>
                <span class="skill-tag">Git / GitHub CI/CD</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">Linux</span>
                <span class="skill-tag">pytest</span>
                <span class="skill-tag">PEP-8</span>
                <span class="skill-tag">OWASP Security</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Visual Professional Work Experience (Part 1) -->
        <section>
          <div class="section-title-visual">
            <span class="title-left"><i class="fa-solid fa-briefcase"></i> Professional Work Experience</span>
            <span class="section-badge-code">03 // CAREER</span>
          </div>

          <!-- Role 1: BIMPulse -->
          <article class="exp-visual-card highlight">
            <div class="exp-top-row">
              <h3 class="exp-role-title">Junior Full-Stack Developer</h3>
              <span class="exp-date-chip active-chip">AUG 2026 — PRESENT</span>
            </div>
            <div class="exp-company-sub">
              BIMPulse • Casablanca, Morocco <span>(Apprenticeship) · AEC & Digital Engineering Software Solutions</span>
            </div>
            <ul class="exp-bullets-list">
              <li>Engineered and deployed core application modules for <strong>BIMPulse Academy</strong>, an enterprise digital training platform dedicated to Architecture, Engineering, Construction & Operations (AECO) professionals.</li>
              <li>Developed backend services and normalized PostgreSQL relational data models strictly adhering to international <strong>BIM / IFC digital engineering standards</strong>.</li>
              <li>Engineered scalable REST APIs in Python & Django paired with modular, mobile-responsive user interfaces.</li>
              <li>Modeled normalized PostgreSQL schemas and optimized database transactions for high-traffic student enrollment flows.</li>
              <li>Formally commended by senior engineering leadership on LinkedIn for architectural milestones and technical contributions to platform delivery.</li>
            </ul>
            <div class="exp-tags-strip">
              <span class="exp-mini-tag">Python 3.12</span>
              <span class="exp-mini-tag">Django REST</span>
              <span class="exp-mini-tag">PostgreSQL</span>
              <span class="exp-mini-tag">BIM / IFC</span>
              <span class="exp-mini-tag">BIMPulse Academy</span>
              <span class="exp-mini-tag">React</span>
            </div>
          </article>

          <!-- Role 2: Django Developer -->
          <article class="exp-visual-card">
            <div class="exp-top-row">
              <h3 class="exp-role-title">Django & Backend Systems Developer</h3>
              <span class="exp-date-chip">MAY 2026 — AUG 2026</span>
            </div>
            <div class="exp-company-sub">
              Self-Directed & Production Systems <span>· Casablanca, Morocco · Enterprise Web Platforms</span>
            </div>
            <ul class="exp-bullets-list">
              <li>Architected enterprise-grade <strong>Role-Based Access Control (RBAC)</strong> supporting <strong>14 discrete user roles</strong> with granular permission matrices and security auditing.</li>
              <li>Eliminated severe <strong>N+1 query bottlenecks</strong> using eager loading (<code>select_related</code> and <code>prefetch_related</code>), reducing database roundtrips to constant O(1) query time.</li>
              <li>Integrated automated transactional emails, custom full-text search indexing, and resilient structured application logging.</li>
            </ul>
            <div class="exp-tags-strip">
              <span class="exp-mini-tag">Django</span>
              <span class="exp-mini-tag">14 RBAC Roles</span>
              <span class="exp-mini-tag">O(1) Eager Loading</span>
              <span class="exp-mini-tag">SQL Optimization</span>
              <span class="exp-mini-tag">PostgreSQL</span>
            </div>
          </article>
        </section>

      </div>

      <!-- Page 1 Footer -->
      <footer class="cv-page-footer">
        <span>Abdellah BELMAARIS — Executive Curriculum Vitae • Authenticated Document</span>
        <span>Page 1 of 2</span>
      </footer>
    </article>


    <!-- ════════════════════ PAGE 2 ════════════════════ -->
    <article class="cv-page cv-page-2">
      <div class="cv-page-content">

        <!-- Professional Experience (Continued) -->
        <section>
          <div class="section-title-visual">
            <span class="title-left"><i class="fa-solid fa-briefcase"></i> Work Experience (Continued)</span>
            <span class="section-badge-code">03 // CONT.</span>
          </div>

          <!-- Role 3: Python Systems -->
          <article class="exp-visual-card">
            <div class="exp-top-row">
              <h3 class="exp-role-title">Python Developer & Data Systems</h3>
              <span class="exp-date-chip">JAN 2020 — PRESENT</span>
            </div>
            <div class="exp-company-sub">
              Systems Engineering & Automation <span>· Core Codebases & Open Source</span>
            </div>
            <ul class="exp-bullets-list">
              <li>Constructed automated high-throughput data processing pipelines, unstructured server log tokenizers, and computational algorithms in Python 3.12.</li>
              <li>Authored a production-grade software library implementing classical <strong>Gang of Four (GoF) design patterns</strong> with 100% pytest test suite coverage and clean dependency injection.</li>
            </ul>
            <div class="exp-tags-strip">
              <span class="exp-mini-tag">Python 3.12</span>
              <span class="exp-mini-tag">Design Patterns</span>
              <span class="exp-mini-tag">Pandas</span>
              <span class="exp-mini-tag">pytest</span>
              <span class="exp-mini-tag">Data Pipelines</span>
            </div>
          </article>

          <!-- Role 4: Full-Stack Web -->
          <article class="exp-visual-card">
            <div class="exp-top-row">
              <h3 class="exp-role-title">Web Developer — Full-Stack Applications</h3>
              <span class="exp-date-chip">FEB 2023 — JUN 2026</span>
            </div>
            <div class="exp-company-sub">
              Full-Stack Application Development <span>· Casablanca, Morocco</span>
            </div>
            <ul class="exp-bullets-list">
              <li>Engineered full-stack web applications translating functional requirements into modular backends and responsive user interfaces.</li>
              <li>Developed <strong>The Modern Journal CMS</strong>, a scalable publishing platform featuring multi-user roles, live readership analytics telemetry, and responsive typography.</li>
            </ul>
            <div class="exp-tags-strip">
              <span class="exp-mini-tag">Web Development</span>
              <span class="exp-mini-tag">Django</span>
              <span class="exp-mini-tag">Bootstrap 5</span>
              <span class="exp-mini-tag">HTML5 / CSS3</span>
              <span class="exp-mini-tag">REST APIs</span>
            </div>
          </article>
        </section>

        <!-- Featured Production Projects -->
        <section>
          <div class="section-title-visual">
            <span class="title-left"><i class="fa-solid fa-code-branch"></i> Standout Production Projects</span>
            <span class="section-badge-code">04 // SYSTEMS</span>
          </div>
          <div class="projects-visual-grid">
            <div class="project-visual-card">
              <div class="project-card-top">
                <span class="project-card-title">The Modern Journal — CMS</span>
                <span class="project-badge-tag">14 RBAC Roles</span>
              </div>
              <p class="project-card-desc">
                Production multi-user publishing engine featuring granular role matrices, live analytics telemetry (views, users, posts), constant O(1) database query resolution, and transactional email triggers.
              </p>
              <div class="project-pills-row">
                <span><i class="fa-solid fa-bolt"></i> O(1) Queries</span>
                <span><i class="fa-solid fa-shield"></i> RBAC Security</span>
                <span><i class="fa-solid fa-database"></i> PostgreSQL</span>
              </div>
            </div>

            <div class="project-visual-card">
              <div class="project-card-top">
                <span class="project-card-title">PyGame 3D Web Arcade (WASM)</span>
                <span class="project-badge-tag">16 Games WASM</span>
              </div>
              <p class="project-card-desc">
                Compiled 16 native Python Pygame arcade games to WebAssembly via Pygbag. Features interactive 3D cabinet selector with dynamic Three.js lighting and locked 60 FPS WebGL rendering.
              </p>
              <div class="project-pills-row">
                <span><i class="fa-solid fa-gamepad"></i> 16 Python Games</span>
                <span><i class="fa-solid fa-cube"></i> Three.js</span>
                <span><i class="fa-solid fa-microchip"></i> WASM</span>
              </div>
            </div>

            <div class="project-visual-card">
              <div class="project-card-top">
                <span class="project-card-title">Dev-Pulse — Developer Telemetry</span>
                <span class="project-badge-tag">&lt; 200ms Reports</span>
              </div>
              <p class="project-card-desc">
                Local data telemetry engine parsing high-dimensional unstructured system logs; performs cleaning with Pandas and automatically generates statistical Matplotlib visual performance reports in under 200ms.
              </p>
              <div class="project-pills-row">
                <span><i class="fa-solid fa-chart-line"></i> Pandas</span>
                <span><i class="fa-solid fa-chart-pie"></i> Matplotlib</span>
                <span><i class="fa-solid fa-lock"></i> 100% Local</span>
              </div>
            </div>

            <div class="project-visual-card">
              <div class="project-card-top">
                <span class="project-card-title">OOP Patterns & Architecture</span>
                <span class="project-badge-tag">GoF Library</span>
              </div>
              <p class="project-card-desc">
                Reference implementation of Gang of Four software design patterns in Python demonstrating modular separation of concerns, dependency inversion, clean architecture, and complete unit test suites.
              </p>
              <div class="project-pills-row">
                <span><i class="fa-solid fa-check-double"></i> Pytest</span>
                <span><i class="fa-solid fa-sitemap"></i> Clean Arch</span>
                <span><i class="fa-solid fa-code"></i> PEP-8</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Verified Industry Credentials -->
        <section>
          <div class="section-title-visual">
            <span class="title-left"><i class="fa-solid fa-award"></i> Verified Industry Credentials</span>
            <span class="section-badge-code">05 // VERIFIED</span>
          </div>
          <div class="credentials-visual-grid">
            <div class="cred-visual-card">
              <div class="cred-title-row">AI Engineer for Developers Associate</div>
              <div class="cred-meta-row">
                <span>DataCamp Certified</span>
                <span>Apr 2026 – Apr 2028</span>
              </div>
              <code class="cred-code-chip">ID: AIEDA0011678564836</code>
            </div>

            <div class="cred-visual-card">
              <div class="cred-title-row">Python Data Associate</div>
              <div class="cred-meta-row">
                <span>DataCamp Certified</span>
                <span>Feb 2026 – Feb 2028</span>
              </div>
              <code class="cred-code-chip">ID: PDA0019412806212</code>
            </div>

            <div class="cred-visual-card">
              <div class="cred-title-row">Cybersecurity Fundamentals</div>
              <div class="cred-meta-row">
                <span>المدرسة - Almdrasa</span>
                <span>Issued Feb 2026 · Verified</span>
              </div>
              <code class="cred-code-chip">ID: 77F16BFF2A-77EB48CD64-1451D2521</code>
            </div>

            <div class="cred-visual-card">
              <div class="cred-title-row">Associate Python Developer</div>
              <div class="cred-meta-row">
                <span>DataCamp Statement</span>
                <span>Nov 2025 · 30 HR Track</span>
              </div>
              <code class="cred-code-chip">ID: #736,739 Statement</code>
            </div>
          </div>
        </section>

        <!-- Visual Education & Languages Split -->
        <div class="bottom-visual-split">
          <!-- Education Card -->
          <div class="edu-visual-card">
            <div class="section-title-visual" style="margin-top: 0; padding-bottom: 2px;">
              <span class="title-left"><i class="fa-solid fa-graduation-cap"></i> Education & Tracks</span>
              <span class="section-badge-code">EDU</span>
            </div>
            <div class="edu-row-item">
              <div class="edu-row-title">Backend Architecture & Systems Engineering</div>
              <div class="edu-row-inst">Specialized Track · Self-directed Engineering</div>
              <div class="edu-row-date">Jan 2023 – Present</div>
            </div>
            <div class="edu-row-item">
              <div class="edu-row-title">Career Track: Backend Developer</div>
              <div class="edu-row-inst">DataCamp Professional Career Track</div>
              <div class="edu-row-date">Verified Continuous Learning</div>
            </div>
            <div class="edu-row-item">
              <div class="edu-row-title">Data Science & Analytics Foundations</div>
              <div class="edu-row-inst">DataCamp Skill Track</div>
              <div class="edu-row-date">Verified Continuous Learning</div>
            </div>
          </div>

          <!-- Languages Card -->
          <div class="lang-visual-card">
            <div class="section-title-visual" style="margin-top: 0; padding-bottom: 2px;">
              <span class="title-left"><i class="fa-solid fa-globe"></i> Languages & Standards</span>
              <span class="section-badge-code">STANDARDS</span>
            </div>
            <div class="skill-pills-wrap" style="margin-bottom: 6px;">
              <span class="skill-tag core">English (Professional)</span>
              <span class="skill-tag core">French (Professional)</span>
              <span class="skill-tag core">Arabic (Native)</span>
            </div>
            <div style="font-size: 8.8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); margin-bottom: 3px;">
              Standards Adhered To
            </div>
            <div class="skill-pills-wrap">
              <span class="skill-tag">BIM / IFC Standards</span>
              <span class="skill-tag">PEP-8 Python Standards</span>
              <span class="skill-tag">RESTful API Design</span>
              <span class="skill-tag">Clean Architecture</span>
              <span class="skill-tag">OWASP Security</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Page 2 Footer -->
      <footer class="cv-page-footer">
        <span>Official Curriculum Vitae of Abdellah BELMAARIS • Live Verification: <a href="https://abdellah-belmaaris.github.io" target="_blank">abdellah-belmaaris.github.io</a></span>
        <span>Page 2 of 2</span>
      </footer>
    </article>

  </main>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-cv-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-cv-theme', next);
      const icon = document.getElementById('theme-icon');
      if (icon) {
        icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      try {
        localStorage.setItem('cv-theme-mode', next);
      } catch (e) {}
    }

    // Init theme
    try {
      const saved = localStorage.getItem('cv-theme-mode');
      if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-cv-theme', saved);
        const icon = document.getElementById('theme-icon');
        if (icon) {
          icon.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
      }
    } catch (e) {}
  </script>

</body>
</html>
`;

// 1. Write HTML file to public/cv.html
const publicCvHtmlPath = path.join(rootDir, 'public', 'cv.html');
fs.writeFileSync(publicCvHtmlPath, cvHtml, 'utf-8');
console.log('Created enhanced visual public/cv.html successfully!');

// 2. Also write a clean Markdown version to CV.md
const cvMarkdown = `# Abdellah BELMAARIS — Curriculum Vitae
**Junior Full-Stack Developer & Backend Systems Specialist**  
BIMPulse • Casablanca, Morocco  
obaidbelmaaris@gmail.com · [LinkedIn](https://linkedin.com/in/abdellah-belmaaris) · [GitHub](https://github.com/Abdellah-BELMAARIS) · [Portfolio](https://abdellah-belmaaris.github.io)

---

## Executive Summary
Performance-driven Full-Stack Software Developer operating at the intersection of enterprise backend architecture, AEC digital transformation, and applied artificial intelligence at BIMPulse. Specialized in engineering high-throughput Python/Django REST backends, normalized PostgreSQL schemas, and modern responsive React/TypeScript interfaces. Proven track record in eliminating severe N+1 SQL bottlenecks to constant O(1) query time and architecting granular 14-role Role-Based Access Control (RBAC) security engines. Certified by DataCamp in Applied AI Engineering (LLMs, RAG Architectures) and Python Data Analytics.

---

## Key Engineering Metrics
- **14 Roles**: Role-Based Access Control (RBAC) security architecture
- **O(1) Time**: SQL Query Optimization resolving N+1 bottlenecks
- **4+ Certifications**: DataCamp Applied AI & Python Certified
- **< 200ms**: High-throughput telemetry pipeline performance

---

## Technical Core & Capabilities
- **Backend & Core Languages**: Python 3.12, Django, Django REST Framework, PostgreSQL, Relational Database Modeling, SQL Optimization, RESTful APIs, JWT Authentication, 14 RBAC Roles, Celery, Redis.
- **Frontend & Web Interfaces**: React 19, TypeScript, JavaScript (ES6+), HTML5 Semantic, Modern CSS3 Architecture, Three.js, WebGL, Responsive UI, Vite, Framer Motion.
- **Data & Applied AI**: Pandas, NumPy, Matplotlib, LLM API Integration, RAG Architectures, Prompt Engineering, Data Cleaning Pipelines.
- **Architecture & DevOps**: Clean Architecture, Gang of Four (GoF) Design Patterns, Git / GitHub CI/CD, Docker, Linux, Unit Testing (pytest), PEP-8, OWASP Security Guidelines.

---

## Professional Work Experience

### Junior Full-Stack Developer — BIMPulse
*Casablanca, Morocco (Apprenticeship) | Aug 2026 – Present*  
*AEC & Digital Engineering Software Solutions*
- Engineered and deployed core application modules for **BIMPulse Academy**, an enterprise digital learning platform dedicated to Architecture, Engineering, Construction & Operations (AECO) professionals.
- Developed backend services and relational data models strictly adhering to international **BIM / IFC digital engineering standards**.
- Engineered scalable REST APIs in Python & Django coupled with modular, mobile-responsive user interfaces.
- Modeled normalized PostgreSQL schemas and optimized database transactions for high-traffic student enrollment flows.
- Formally commended by senior engineering leadership on LinkedIn for architectural milestones and technical contributions to platform delivery.

### Django & Backend Systems Developer — Self-Directed & Production Systems
*Casablanca, Morocco | May 2026 – Aug 2026*
*Enterprise Web Platforms & API Architecture*
- Architected enterprise-grade **Role-Based Access Control (RBAC)** supporting **14 discrete user roles** with granular permission matrices and security auditing.
- Eliminated severe **N+1 query bottlenecks** using eager loading (\`select_related\` and \`prefetch_related\`), reducing database roundtrips to constant O(1) query time.
- Integrated automated transactional emails, custom full-text search indexing, and resilient logging mechanisms.

### Python Developer & Data Systems — Systems Engineering & Automation
*Casablanca, Morocco | Jan 2020 – Present*
*Software Architecture, Automation & Data Engineering*
- Constructed automated high-throughput data processing pipelines, unstructured server log tokenizers, and computational algorithms in Python 3.12.
- Authored a production-grade software library implementing classical **Gang of Four (GoF) software design patterns** with full unit test coverage and clean dependency injection.

### Full-Stack Web Developer — Full-Stack Application Development
*Casablanca, Morocco | Feb 2023 – Jun 2026*
*Full-Stack Web Development & CMS Solutions*
- Engineered full-stack web applications translating functional requirements into modular backends and responsive user interfaces.
- Developed **The Modern Journal CMS**, a scalable publishing platform featuring multi-user roles, live readership analytics telemetry, and responsive typography.

---

## Standout Production Projects
- **The Modern Journal — Django CMS**: Multi-user publishing platform with 14 RBAC user roles, live telemetry analytics, O(1) query-optimized data retrieval, and full-text search.
- **PyGame 3D Web Arcade & WASM Console**: 16 native Python Pygame arcade games compiled to WebAssembly via Pygbag, executing at locked 60 FPS in-browser with Three.js 3D cabinet selector.
- **Dev-Pulse — Developer Activity Telemetry**: Local data telemetry engine parsing high-dimensional system logs with Pandas and generating automated statistical Matplotlib performance visuals in <200ms.
- **OOP Patterns & Software Architecture Library**: Production Gang of Four design patterns in Python 3.12 with clean architecture, dependency inversion, and comprehensive test suites.

---

## Verified Industry Credentials
- **AI Engineer for Developers Associate** — DataCamp (ID: \`AIEDA0011678564836\` · Valid through Apr 2028)
- **Python Data Associate** — DataCamp (ID: \`PDA0019412806212\` · Valid through Feb 2028)
- **Cybersecurity Fundamentals** — المدرسة / Almdrasa (ID: \`77F16BFF2A-77EB48CD64-1451D2521\` · Feb 2026)
- **Associate Python Developer (30 HR Track)** — DataCamp (#736,739 Statement of Accomplishment · Nov 2025)

---

## Education & Specializations
- **Backend Architecture & Systems Engineering**: Specialized Track · Self-directed Engineering (Jan 2023 – Present)
- **Career Track: Backend Developer**: DataCamp Professional Career Track
- **Data Science & Analytics Foundations**: DataCamp Skill Track

---

## Languages & Standards
- **Languages**: English (Professional Working), French (Professional Working), Arabic (Native)
- **Engineering Standards**: BIM / IFC Industry Standards, PEP-8 Python Standards, RESTful API Design, Clean Architecture, OWASP Security Guidelines
`;

fs.writeFileSync(path.join(rootDir, 'CV.md'), cvMarkdown, 'utf-8');
fs.writeFileSync(path.join(rootDir, 'public', 'assets', 'Abdellah_BELMAARIS_CV.txt'), cvMarkdown, 'utf-8');

// 3. Compile public/cv.html into public/assets/Abdellah_BELMAARIS_CV.pdf using Microsoft Edge
const pdfDestPath = path.join(rootDir, 'public', 'assets', 'Abdellah_BELMAARIS_CV.pdf');
const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgeExe)) {
  console.log('Compiling Pro Visual CV PDF with Microsoft Edge headless...');
  const fileUrl = `file:///${publicCvHtmlPath.replace(/\\/g, '/')}`;
  
  if (fs.existsSync(pdfDestPath)) {
    try {
      fs.unlinkSync(pdfDestPath);
      console.log('Removed old PDF file.');
    } catch (e) {
      console.warn('Could not delete old PDF directly:', e.message);
    }
  }

  const psScript = `
    $edge = '${edgeExe}';
    $html = '${fileUrl}';
    $pdf = '${pdfDestPath.replace(/\\/g, '/')}';
    $p = Start-Process -FilePath $edge -ArgumentList @('--headless', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer', "--print-to-pdf=$pdf", $html) -PassThru -Wait;
    if (Test-Path $pdf) {
      $item = Get-Item $pdf;
      Write-Host "Pro Visual CV PDF Generation Success! Bytes: $($item.Length)"
    } else {
      Write-Error "Failed to generate PDF at $pdf"
    }
  `;

  try {
    const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', psScript], { encoding: 'utf-8' });
    console.log(result.stdout || result.stderr);
    if (fs.existsSync(pdfDestPath)) {
      const stat = fs.statSync(pdfDestPath);
      console.log(`Verified new Pro Visual CV PDF! Size: ${stat.size} bytes at: ${pdfDestPath}`);
    }
  } catch (err) {
    console.error('Error executing Edge command:', err);
  }
} else {
  console.warn('Microsoft Edge executable not found at expected path.');
}
