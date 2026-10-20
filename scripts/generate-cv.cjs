const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const publicAssetsDir = path.join(rootDir, 'public', 'assets');
const avatarCvPath = path.join(publicAssetsDir, 'avatar_cv.jpg');
const avatarOriginalPath = path.join(publicAssetsDir, 'avatar.jpg');

// Certificate Images
const certAiPath = path.join(publicAssetsDir, 'certificate_ai_engineer.png');
const certPythonDataPath = path.join(publicAssetsDir, 'python_data_associate.jpg');
const certCyberPath = path.join(publicAssetsDir, 'cybersecurity_fundamentals.jpg');
const certPythonDevPath = path.join(publicAssetsDir, 'certificate.png');

// Convert to Base64 for instant, offline, and PDF print embedding
let avatarBase64 = '';
if (fs.existsSync(avatarCvPath)) {
  avatarBase64 = `data:image/jpeg;base64,${fs.readFileSync(avatarCvPath).toString('base64')}`;
} else if (fs.existsSync(avatarOriginalPath)) {
  avatarBase64 = `data:image/jpeg;base64,${fs.readFileSync(avatarOriginalPath).toString('base64')}`;
}

const certAiBase64 = fs.existsSync(certAiPath) ? `data:image/png;base64,${fs.readFileSync(certAiPath).toString('base64')}` : 'assets/certificate_ai_engineer.png';
const certPythonDataBase64 = fs.existsSync(certPythonDataPath) ? `data:image/jpeg;base64,${fs.readFileSync(certPythonDataPath).toString('base64')}` : 'assets/python_data_associate.jpg';
const certCyberBase64 = fs.existsSync(certCyberPath) ? `data:image/jpeg;base64,${fs.readFileSync(certCyberPath).toString('base64')}` : 'assets/cybersecurity_fundamentals.jpg';
const certPythonDevBase64 = fs.existsSync(certPythonDevPath) ? `data:image/png;base64,${fs.readFileSync(certPythonDevPath).toString('base64')}` : 'assets/certificate.png';

const cvHtml = `<!DOCTYPE html>
<html lang="en" data-cv-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abdellah BELMAARIS — Executive Curriculum Vitae</title>
  <meta name="description" content="Official Curriculum Vitae of Abdellah BELMAARIS — Full-Stack Developer & Backend Systems Specialist at BIMPulse. Verified Certifications & Standout Projects.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* ─── Visual Theme Design System ────────────────────────────────────────── */
    :root {
      /* Screen Theme: Cyber Obsidian Pro (Default Dark) */
      --bg-canvas: #060a12;
      --bg-surface: #0a1120;
      --bg-card: rgba(13, 22, 40, 0.78);
      --bg-card-hover: rgba(18, 30, 54, 0.92);
      --bg-card-subtle: rgba(16, 27, 49, 0.6);
      --bg-pill: rgba(0, 229, 255, 0.08);
      --bg-pill-hover: rgba(0, 229, 255, 0.16);
      --border: rgba(255, 255, 255, 0.09);
      --border-accent: rgba(0, 229, 255, 0.28);
      --border-emerald: rgba(16, 185, 129, 0.35);
      --text: #f8fafc;
      --text-muted: #cbd5e1;
      --text-sub: #94a3b8;
      --accent: #00e5ff;
      --accent-dark: #0284c7;
      --accent-glow: rgba(0, 229, 255, 0.2);
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.25);
      --gold: #f59e0b;
      --card-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06);
      --card-radius: 14px;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    }

    [data-cv-theme="light"] {
      /* Crisp Clean Arctic Light */
      --bg-canvas: #f1f5f9;
      --bg-surface: #ffffff;
      --bg-card: #ffffff;
      --bg-card-hover: #f8fafc;
      --bg-card-subtle: #f8fafc;
      --bg-pill: rgba(0, 118, 138, 0.07);
      --bg-pill-hover: rgba(0, 118, 138, 0.14);
      --border: #e2e8f0;
      --border-accent: rgba(0, 118, 138, 0.28);
      --border-emerald: rgba(5, 133, 103, 0.3);
      --text: #0f172a;
      --text-muted: #334155;
      --text-sub: #64748b;
      --accent: #00768a;
      --accent-dark: #005a6a;
      --accent-glow: rgba(0, 118, 138, 0.15);
      --emerald: #058567;
      --emerald-glow: rgba(5, 133, 103, 0.18);
      --gold: #b45309;
      --card-shadow: 0 10px 30px rgba(0, 45, 65, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    /* ─── Global Reset & Typography ────────────────────────────────────────── */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-canvas);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      padding-bottom: 60px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* ─── Executive Screen Action Bar ──────────────────────────────────────── */
    .screen-action-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 17, 32, 0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    [data-cv-theme="light"] .screen-action-bar {
      background: rgba(255, 255, 255, 0.92);
      border-bottom: 1px solid #cbd5e1;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }

    .action-bar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .action-bar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text);
    }

    .action-bar-logo {
      font-family: var(--font-sans);
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--accent);
      background: rgba(0, 229, 255, 0.12);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--border-accent);
    }

    [data-cv-theme="light"] .action-bar-logo {
      background: rgba(0, 118, 138, 0.1);
    }

    .action-bar-title {
      font-size: 0.92rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .doc-spec-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--border-emerald);
      padding: 3px 8px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .doc-spec-badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 8px var(--emerald);
    }

    .action-bar-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.25s ease;
      font-family: var(--font-sans);
      border: 1px solid transparent;
    }

    .btn-action.btn-primary {
      background: linear-gradient(135deg, #00e5ff 0%, #0284c7 100%);
      color: #040912;
      box-shadow: 0 4px 14px rgba(0, 229, 255, 0.3);
    }

    [data-cv-theme="light"] .btn-action.btn-primary {
      background: linear-gradient(135deg, #00768a 0%, #0369a1 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(0, 118, 138, 0.25);
    }

    .btn-action.btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 229, 255, 0.45);
    }

    .btn-action.btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--border);
      color: var(--text-muted);
    }

    [data-cv-theme="light"] .btn-action.btn-ghost {
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    }

    .btn-action.btn-ghost:hover {
      background: rgba(255, 255, 255, 0.12);
      color: var(--text);
      border-color: var(--border-accent);
      transform: translateY(-1px);
    }

    [data-cv-theme="light"] .btn-action.btn-ghost:hover {
      background: #f8fafc;
      color: #0f172a;
      border-color: var(--accent);
    }

    .theme-toggle-btn {
      width: 38px;
      height: 38px;
      padding: 0;
      justify-content: center;
      border-radius: 8px;
    }

    /* ─── Main Spacious Document Canvas ────────────────────────────────────── */
    .cv-main-container {
      max-width: 1200px;
      margin: 32px auto 0;
      padding: 0 24px;
    }

    /* ─── Hero Identity Header Card ────────────────────────────────────────── */
    .cv-hero-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      box-shadow: var(--card-shadow);
      padding: 28px 32px;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
    }

    .cv-hero-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent) 0%, var(--emerald) 50%, #8b5cf6 100%);
    }

    .cv-hero-grid {
      display: grid;
      grid-template-columns: 104px 1fr;
      gap: 26px;
      align-items: center;
    }

    .cv-avatar-wrap {
      position: relative;
      width: 104px;
      height: 104px;
      flex-shrink: 0;
    }

    .cv-avatar {
      width: 104px;
      height: 104px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      border: 3px solid var(--accent);
      box-shadow: 0 6px 20px rgba(0, 229, 255, 0.3);
    }

    [data-cv-theme="light"] .cv-avatar {
      box-shadow: 0 6px 20px rgba(0, 118, 138, 0.2);
    }

    .cv-avatar-status {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      background: var(--emerald);
      border: 3px solid var(--bg-card);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--emerald);
    }

    .cv-hero-body {
      display: flex;
      flex-direction: column;
    }

    .cv-kicker-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .cv-full-name {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.8px;
      line-height: 1.15;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .cv-verified-badge {
      font-size: 1rem;
      color: var(--accent);
    }

    .cv-headline-role {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 4px;
    }

    .cv-headline-company {
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Contact Links Strip */
    .cv-contacts-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      margin-top: 14px;
    }

    .cv-contact-chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      text-decoration: none;
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 8px;
      background: var(--bg-pill);
      border: 1px solid var(--border-accent);
      transition: all 0.2s ease;
    }

    .cv-contact-chip i {
      color: var(--accent);
      font-size: 0.85rem;
    }

    .cv-contact-chip:hover {
      background: var(--bg-pill-hover);
      color: var(--text);
      border-color: var(--accent);
      transform: translateY(-1px);
    }

    /* ─── Impact Metrics Strip ─────────────────────────────────────────────── */
    .cv-metrics-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }

    .cv-metric-box {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 16px 18px;
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .cv-metric-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--accent);
    }

    .cv-metric-box:hover {
      border-color: var(--border-accent);
      transform: translateY(-2px);
    }

    .cv-metric-val {
      font-family: var(--font-mono);
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--accent);
      line-height: 1.2;
    }

    .cv-metric-lbl {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .cv-metric-sub {
      font-size: 0.72rem;
      color: var(--text-sub);
    }

    /* ─── Two-Column Executive Body Layout ──────────────────────────────────── */
    .cv-content-split {
      display: grid;
      grid-template-columns: 1fr 390px;
      gap: 28px;
      align-items: start;
    }

    .cv-col-main, .cv-col-side {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ─── Section Header ───────────────────────────────────────────────────── */
    .cv-section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1.5px solid var(--border);
      margin-bottom: 16px;
    }

    .cv-section-title .title-text {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 1.05rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text);
    }

    .cv-section-title .title-text i {
      color: var(--accent);
      font-size: 1rem;
    }

    .cv-section-title .section-code-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-sub);
      background: var(--bg-pill);
      padding: 3px 8px;
      border-radius: 6px;
    }

    /* ─── Executive Summary Card ───────────────────────────────────────────── */
    .cv-summary-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 20px 24px;
      box-shadow: var(--card-shadow);
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-muted);
    }

    .cv-summary-card strong {
      color: var(--text);
      font-weight: 700;
    }

    /* ─── Experience Timeline Cards ────────────────────────────────────────── */
    .exp-cards-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .exp-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 22px 24px;
      box-shadow: var(--card-shadow);
      transition: all 0.25s ease;
      position: relative;
    }

    .exp-card.highlight {
      border-left: 4px solid var(--emerald);
      background: linear-gradient(135deg, rgba(13, 22, 40, 0.9) 0%, rgba(16, 185, 129, 0.05) 100%);
    }

    [data-cv-theme="light"] .exp-card.highlight {
      background: linear-gradient(135deg, #ffffff 0%, rgba(5, 133, 103, 0.04) 100%);
    }

    .exp-card:hover {
      border-color: var(--border-accent);
      transform: translateY(-2px);
    }

    .exp-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      flex-wrap: wrap;
    }

    .exp-role-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text);
      line-height: 1.3;
    }

    .exp-date-chip {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--bg-pill);
      color: var(--accent);
      border: 1px solid var(--border-accent);
      white-space: nowrap;
    }

    .exp-date-chip.active-chip {
      background: rgba(16, 185, 129, 0.12);
      color: var(--emerald);
      border-color: var(--border-emerald);
    }

    .exp-company-sub {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--accent);
      margin: 4px 0 12px 0;
    }

    .exp-company-sub span {
      color: var(--text-sub);
      font-weight: 500;
    }

    .exp-bullets-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .exp-bullets-list li {
      position: relative;
      padding-left: 20px;
    }

    .exp-bullets-list li::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-size: 1rem;
      line-height: 1.4;
    }

    .exp-bullets-list strong {
      color: var(--text);
    }

    .exp-tags-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }

    .exp-mini-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      background: var(--bg-pill);
      color: var(--accent);
      border: 1px solid var(--border-accent);
    }

    /* ─── Projects Showcase Cards ──────────────────────────────────────────── */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .project-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 18px 20px;
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
    }

    .project-card:hover {
      border-color: var(--border-accent);
      transform: translateY(-2px);
    }

    .project-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px;
    }

    .project-title {
      font-size: 0.96rem;
      font-weight: 800;
      color: var(--text);
    }

    .project-badge {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--border-emerald);
      padding: 2px 7px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .project-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 12px;
    }

    .project-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 0.74rem;
      font-family: var(--font-mono);
      color: var(--text-sub);
    }

    .project-pills span {
      background: var(--bg-pill);
      border: 1px solid var(--border);
      padding: 2px 7px;
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .project-pills span i {
      color: var(--accent);
      font-size: 0.7rem;
    }

    /* ─── SIDEBAR: VERIFIED INDUSTRY CERTIFICATES (WITH REAL PHOTOS) ────────── */
    .cert-showcase-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cert-photo-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      box-shadow: var(--card-shadow);
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .cert-photo-card:hover {
      border-color: var(--border-accent);
      box-shadow: 0 12px 30px rgba(0, 229, 255, 0.16);
      transform: translateY(-2px);
    }

    /* Visual Certificate Image Container */
    .cert-image-thumb-wrap {
      position: relative;
      width: 100%;
      height: 160px;
      background: #040810;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--border);
    }

    [data-cv-theme="light"] .cert-image-thumb-wrap {
      background: #e2e8f0;
    }

    .cert-image-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.4s ease;
      display: block;
    }

    .cert-photo-card:hover .cert-image-thumb {
      transform: scale(1.04);
    }

    .cert-image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(4, 9, 18, 0.65);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      opacity: 0;
      transition: opacity 0.25s ease;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }

    .cert-photo-card:hover .cert-image-overlay {
      opacity: 1;
    }

    .cert-zoom-btn {
      background: var(--accent);
      color: #040912;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0, 229, 255, 0.4);
    }

    /* Certificate Card Content */
    .cert-card-body {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cert-title-link {
      font-size: 0.92rem;
      font-weight: 800;
      color: var(--text);
      text-decoration: none;
      line-height: 1.35;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .cert-title-link:hover {
      color: var(--accent);
    }

    .cert-issuer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: var(--text-sub);
    }

    .cert-issuer-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--emerald);
      font-weight: 600;
    }

    .cert-id-chip {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      background: var(--bg-pill);
      border: 1px solid var(--border-accent);
      color: var(--accent);
      padding: 2px 7px;
      border-radius: 4px;
      align-self: flex-start;
      margin-top: 2px;
    }

    /* ─── SIDEBAR: SKILLS MATRIX & CORE CAPABILITIES ───────────────────────── */
    .skills-matrix-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .skill-category-box {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 14px 16px;
      box-shadow: var(--card-shadow);
    }

    .skill-cat-header {
      font-size: 0.86rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--accent);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .skill-cat-header i {
      font-size: 0.8rem;
    }

    .skill-pills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .skill-pill {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 6px;
      background: var(--bg-pill);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .skill-pill.core {
      background: rgba(0, 229, 255, 0.12);
      color: var(--accent);
      border-color: var(--border-accent);
      font-weight: 700;
    }

    /* ─── SIDEBAR: EDUCATION & TRACKS ──────────────────────────────────────── */
    .edu-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 16px 18px;
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .edu-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .edu-item:not(:last-child) {
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }

    .edu-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text);
    }

    .edu-inst {
      font-size: 0.8rem;
      color: var(--accent);
      font-weight: 600;
    }

    .edu-date {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-sub);
    }

    /* ─── SIDEBAR: LANGUAGES & STANDARDS ───────────────────────────────────── */
    .lang-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 16px 18px;
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .lang-item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .lang-item-row span:last-child {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent);
    }

    /* ─── Interactive Lightbox Modal ───────────────────────────────────────── */
    .cert-lightbox-modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(3, 7, 18, 0.88);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    .cert-lightbox-modal.active {
      display: flex;
      opacity: 1;
    }

    .cert-modal-content {
      background: var(--bg-surface);
      border: 1px solid var(--border-accent);
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .cert-modal-header {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
    }

    .cert-modal-title {
      font-size: 1rem;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cert-modal-close {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 1.1rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .cert-modal-close:hover {
      background: var(--accent);
      color: #040912;
    }

    .cert-modal-body {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      background: #02050b;
    }

    .cert-modal-body img {
      max-width: 100%;
      max-height: 72vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .cert-modal-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-sub);
      background: var(--bg-card);
    }

    /* ─── Responsive Media Queries ─────────────────────────────────────────── */
    @media (max-width: 980px) {
      .cv-content-split {
        grid-template-columns: 1fr;
      }
      .cv-metrics-strip {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 680px) {
      .cv-main-container {
        padding: 0 14px;
        margin-top: 16px;
      }
      .cv-hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .cv-avatar-wrap {
        margin: 0 auto;
      }
      .cv-full-name {
        justify-content: center;
        font-size: 1.7rem;
      }
      .cv-contacts-grid {
        justify-content: center;
      }
      .projects-grid {
        grid-template-columns: 1fr;
      }
      .screen-action-bar {
        padding: 10px 14px;
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      .action-bar-left, .action-bar-buttons {
        justify-content: space-between;
      }
    }

    /* ─── Pristine Multi-Page Print Engine (A4 PDF Print) ───────────────────── */
    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
      }
      body, html {
        background: #ffffff !important;
        color: #0f172a !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .screen-action-bar, .cert-lightbox-modal, .cert-image-overlay {
        display: none !important;
      }
      .cv-main-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .cv-hero-card, .cv-metric-box, .cv-summary-card, .exp-card, .project-card,
      .cert-photo-card, .skill-category-box, .edu-card, .lang-card {
        background: #ffffff !important;
        color: #0f172a !important;
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
      }
      .cv-content-split {
        grid-template-columns: 1fr 340px !important;
        gap: 16px !important;
      }
      .cert-image-thumb-wrap {
        height: 120px !important;
      }
      .cert-image-thumb {
        object-fit: cover !important;
      }
      .exp-role-title, .cv-full-name, .project-title, .edu-title, .cert-title-link {
        color: #0f172a !important;
      }
      .exp-company-sub, .cv-headline-role, .edu-inst, .cert-id-chip {
        color: #00768a !important;
      }
      .exp-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .cert-photo-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>

  <!-- ─── Screen Control & Action Bar ──────────────────────────────────────── -->
  <header class="screen-action-bar">
    <div class="action-bar-left">
      <a href="index.html" class="action-bar-brand" title="Return to Abdellah BELMAARIS Portfolio">
        <span class="action-bar-logo">AB.</span>
        <span class="action-bar-title">Abdellah BELMAARIS</span>
      </a>
      <span class="doc-spec-badge">Authenticated Executive CV</span>
    </div>

    <div class="action-bar-buttons">
      <a href="assets/Abdellah_BELMAARIS_CV.pdf" download="Abdellah_BELMAARIS_CV.pdf" class="btn-action btn-primary" title="Download Official High-Resolution PDF">
        <i class="fa-solid fa-file-arrow-down"></i>
        <span>Download PDF</span>
      </a>

      <button type="button" class="btn-action btn-ghost" onclick="window.print()" title="Print or Save to Local PDF">
        <i class="fa-solid fa-print"></i>
        <span>Print</span>
      </button>

      <button type="button" class="btn-action btn-ghost theme-toggle-btn" id="theme-toggle-btn" title="Toggle Light / Dark Mode">
        <i class="fa-solid fa-sun" id="theme-icon"></i>
      </button>

      <a href="index.html" class="btn-action btn-ghost" title="Back to Interactive Portfolio">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Portfolio</span>
      </a>
    </div>
  </header>

  <!-- ─── Spacious Executive Document Container ────────────────────────────── -->
  <main class="cv-main-container">

    <!-- Hero Profile & Identity Card -->
    <header class="cv-hero-card">
      <div class="cv-hero-grid">
        <div class="cv-avatar-wrap">
          <img src="${avatarBase64}" alt="Abdellah BELMAARIS Avatar" class="cv-avatar">
          <span class="cv-avatar-status" title="Status: Active & Available for Roles"></span>
        </div>

        <div class="cv-hero-body">
          <div class="cv-kicker-pill">
            <i class="fa-solid fa-terminal"></i>
            <span>Junior Full-Stack Developer at BIMPulse • Applied AI & Backend Systems</span>
          </div>

          <h1 class="cv-full-name">
            Abdellah BELMAARIS
            <i class="fa-solid fa-circle-check cv-verified-badge" title="Verified Professional Identity"></i>
          </h1>

          <div class="cv-headline-role">
            Full-Stack Software Developer <span class="cv-headline-company">• BIMPulse & Enterprise Systems</span>
          </div>

          <div class="cv-contacts-grid">
            <a href="mailto:obaidbelmaaris@gmail.com" class="cv-contact-chip">
              <i class="fa-solid fa-envelope"></i> obaidbelmaaris@gmail.com
            </a>
            <a href="tel:+212654624382" class="cv-contact-chip">
              <i class="fa-solid fa-phone"></i> +212 654 624 382
            </a>
            <span class="cv-contact-chip">
              <i class="fa-solid fa-location-dot"></i> Casablanca, Morocco
            </span>
            <a href="https://linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer" class="cv-contact-chip">
              <i class="fa-brands fa-linkedin"></i> linkedin.com/in/abdellah-belmaaris
            </a>
            <a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer" class="cv-contact-chip">
              <i class="fa-brands fa-github"></i> github.com/Abdellah-BELMAARIS
            </a>
            <a href="https://abdellah-belmaaris.github.io" target="_blank" rel="noopener noreferrer" class="cv-contact-chip">
              <i class="fa-solid fa-globe"></i> abdellah-belmaaris.github.io
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Key Impact Metrics Strip -->
    <div class="cv-metrics-strip">
      <div class="cv-metric-box">
        <div class="cv-metric-val">O(1) TIME</div>
        <div class="cv-metric-lbl">SQL Optimization</div>
        <div class="cv-metric-sub">Eager Loading & Eliminated N+1</div>
      </div>
      <div class="cv-metric-box">
        <div class="cv-metric-val">14 ROLES</div>
        <div class="cv-metric-lbl">RBAC Architecture</div>
        <div class="cv-metric-sub">Granular Permission Matrix</div>
      </div>
      <div class="cv-metric-box">
        <div class="cv-metric-val">4+ CERTS</div>
        <div class="cv-metric-lbl">Industry Certifications</div>
        <div class="cv-metric-sub">DataCamp AI & Python Verified</div>
      </div>
      <div class="cv-metric-box">
        <div class="cv-metric-val">&lt; 200ms</div>
        <div class="cv-metric-lbl">Telemetry Engine</div>
        <div class="cv-metric-sub">Log Analytics & Data Pipelines</div>
      </div>
    </div>

    <!-- Executive Body Split Grid -->
    <div class="cv-content-split">

      <!-- ─── PRIMARY LEFT COLUMN (Career & Projects) ─────────────────────── -->
      <div class="cv-col-main">

        <!-- Executive Profile -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-user-astronaut"></i> Executive Summary</span>
            <span class="section-code-badge">01 // PROFILE</span>
          </div>
          <div class="cv-summary-card">
            <p>
              Performance-driven <strong>Full-Stack Software Developer</strong> operating at the intersection of enterprise backend architecture, AEC digital engineering, and applied artificial intelligence at <strong>BIMPulse</strong>. Specialized in engineering high-throughput <strong>Python/Django REST</strong> backends, normalized <strong>PostgreSQL</strong> schemas, and modern responsive <strong>React/TypeScript</strong> interfaces. Proven track record in eliminating severe N+1 database bottlenecks down to <strong>constant O(1) query time</strong> and architecting granular <strong>14-role Role-Based Access Control (RBAC)</strong> engines. Certified by DataCamp in Applied AI Engineering (LLMs, RAG Architectures) and Python Data Analytics.
            </p>
          </div>
        </section>

        <!-- Professional Work Experience -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-briefcase"></i> Professional Work Experience</span>
            <span class="section-code-badge">02 // CAREER</span>
          </div>

          <div class="exp-cards-stack">
            <!-- Role 1: BIMPulse -->
            <article class="exp-card highlight">
              <div class="exp-top-bar">
                <h3 class="exp-role-title">Junior Full-Stack Developer</h3>
                <span class="exp-date-chip active-chip">AUG 2026 — PRESENT</span>
              </div>
              <div class="exp-company-sub">
                BIMPulse • Casablanca, Morocco <span>(Apprenticeship) · AEC & Digital Engineering Solutions</span>
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
            <article class="exp-card">
              <div class="exp-top-bar">
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

            <!-- Role 3: Python Systems -->
            <article class="exp-card">
              <div class="exp-top-bar">
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
            <article class="exp-card">
              <div class="exp-top-bar">
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
          </div>
        </section>

        <!-- Standout Production Projects -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-code-branch"></i> Standout Production Projects</span>
            <span class="section-code-badge">03 // SYSTEMS</span>
          </div>

          <div class="projects-grid">
            <div class="project-card">
              <div class="project-card-top">
                <h4 class="project-title">The Modern Journal — CMS</h4>
                <span class="project-badge">14 RBAC Roles</span>
              </div>
              <p class="project-desc">
                Production multi-user publishing engine featuring granular role matrices, live analytics telemetry (views, users, posts), constant O(1) database query resolution, and transactional email triggers.
              </p>
              <div class="project-pills">
                <span><i class="fa-solid fa-bolt"></i> O(1) Queries</span>
                <span><i class="fa-solid fa-shield"></i> RBAC Security</span>
                <span><i class="fa-solid fa-database"></i> PostgreSQL</span>
              </div>
            </div>

            <div class="project-card">
              <div class="project-card-top">
                <h4 class="project-title">PyGame 3D Web Arcade (WASM)</h4>
                <span class="project-badge">16 Games WASM</span>
              </div>
              <p class="project-desc">
                Compiled 16 native Python Pygame arcade games to WebAssembly via Pygbag. Features interactive 3D cabinet selector with dynamic Three.js lighting and locked 60 FPS WebGL rendering.
              </p>
              <div class="project-pills">
                <span><i class="fa-solid fa-gamepad"></i> 16 Python Games</span>
                <span><i class="fa-solid fa-cube"></i> Three.js</span>
                <span><i class="fa-solid fa-microchip"></i> WASM</span>
              </div>
            </div>

            <div class="project-card">
              <div class="project-card-top">
                <h4 class="project-title">Dev-Pulse — Developer Telemetry</h4>
                <span class="project-badge">&lt; 200ms Reports</span>
              </div>
              <p class="project-desc">
                Local data telemetry engine parsing high-dimensional unstructured system logs; performs cleaning with Pandas and automatically generates statistical Matplotlib visual performance reports in under 200ms.
              </p>
              <div class="project-pills">
                <span><i class="fa-solid fa-chart-line"></i> Pandas</span>
                <span><i class="fa-solid fa-chart-pie"></i> Matplotlib</span>
                <span><i class="fa-solid fa-lock"></i> 100% Local</span>
              </div>
            </div>

            <div class="project-card">
              <div class="project-card-top">
                <h4 class="project-title">OOP Patterns & Architecture</h4>
                <span class="project-badge">GoF Library</span>
              </div>
              <p class="project-desc">
                Reference implementation of Gang of Four software design patterns in Python demonstrating modular separation of concerns, dependency inversion, clean architecture, and complete unit test suites.
              </p>
              <div class="project-pills">
                <span><i class="fa-solid fa-check-double"></i> Pytest</span>
                <span><i class="fa-solid fa-sitemap"></i> Clean Arch</span>
                <span><i class="fa-solid fa-code"></i> PEP-8</span>
              </div>
            </div>
          </div>
        </section>

      </div>


      <!-- ─── SECONDARY RIGHT COLUMN (Certificates & Credentials) ────────── -->
      <aside class="cv-col-side">

        <!-- Verified Industry Credentials Showcase WITH REAL PHOTOS -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-award"></i> Verified Credentials</span>
            <span class="section-code-badge">04 // CERTS</span>
          </div>

          <div class="cert-showcase-stack">

            <!-- Certificate 1: AI Engineer -->
            <article class="cert-photo-card">
              <div class="cert-image-thumb-wrap" onclick="openCertModal('${certAiBase64}', 'AI Engineer for Developers Associate', 'DataCamp Certified • ID: AIEDA0011678564836')">
                <img src="${certAiBase64}" alt="AI Engineer for Developers Associate Certificate Photo" class="cert-image-thumb" loading="lazy">
                <div class="cert-image-overlay">
                  <span class="cert-zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i> View Certificate</span>
                </div>
              </div>
              <div class="cert-card-body">
                <a href="https://www.datacamp.com/certificate/AIEDA0011678564836" target="_blank" rel="noopener noreferrer" class="cert-title-link">
                  <span>AI Engineer for Developers Associate</span>
                  <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; color: var(--accent);"></i>
                </a>
                <div class="cert-issuer-row">
                  <span class="cert-issuer-badge"><i class="fa-solid fa-certificate"></i> DataCamp</span>
                  <span>Apr 2026 – Apr 2028</span>
                </div>
                <code class="cert-id-chip">ID: AIEDA0011678564836</code>
              </div>
            </article>

            <!-- Certificate 2: Python Data Associate -->
            <article class="cert-photo-card">
              <div class="cert-image-thumb-wrap" onclick="openCertModal('${certPythonDataBase64}', 'Python Data Associate', 'DataCamp Certified • ID: PDA0019412806212')">
                <img src="${certPythonDataBase64}" alt="Python Data Associate Certificate Photo" class="cert-image-thumb" loading="lazy">
                <div class="cert-image-overlay">
                  <span class="cert-zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i> View Certificate</span>
                </div>
              </div>
              <div class="cert-card-body">
                <a href="https://www.datacamp.com/certificate/PDA0019412806212" target="_blank" rel="noopener noreferrer" class="cert-title-link">
                  <span>Python Data Associate</span>
                  <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; color: var(--accent);"></i>
                </a>
                <div class="cert-issuer-row">
                  <span class="cert-issuer-badge"><i class="fa-solid fa-certificate"></i> DataCamp</span>
                  <span>Feb 2026 – Feb 2028</span>
                </div>
                <code class="cert-id-chip">ID: PDA0019412806212</code>
              </div>
            </article>

            <!-- Certificate 3: Cybersecurity Fundamentals -->
            <article class="cert-photo-card">
              <div class="cert-image-thumb-wrap" onclick="openCertModal('${certCyberBase64}', 'Cybersecurity Fundamentals', 'المدرسة - Almdrasa • Verified ID: 77F16BFF2A')">
                <img src="${certCyberBase64}" alt="Cybersecurity Fundamentals Certificate Photo" class="cert-image-thumb" loading="lazy">
                <div class="cert-image-overlay">
                  <span class="cert-zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i> View Certificate</span>
                </div>
              </div>
              <div class="cert-card-body">
                <a href="https://almdrasa.com/" target="_blank" rel="noopener noreferrer" class="cert-title-link">
                  <span>Cybersecurity Fundamentals</span>
                  <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; color: var(--accent);"></i>
                </a>
                <div class="cert-issuer-row">
                  <span class="cert-issuer-badge"><i class="fa-solid fa-shield-halved"></i> Almdrasa</span>
                  <span>Issued Feb 2026</span>
                </div>
                <code class="cert-id-chip">ID: 77F16BFF2A-77EB48CD64</code>
              </div>
            </article>

            <!-- Certificate 4: Associate Python Developer -->
            <article class="cert-photo-card">
              <div class="cert-image-thumb-wrap" onclick="openCertModal('${certPythonDevBase64}', 'Associate Python Developer (30 HR)', 'DataCamp Statement of Accomplishment • #736,739')">
                <img src="${certPythonDevBase64}" alt="Associate Python Developer Certificate Photo" class="cert-image-thumb" loading="lazy">
                <div class="cert-image-overlay">
                  <span class="cert-zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i> View Certificate</span>
                </div>
              </div>
              <div class="cert-card-body">
                <a href="assets/certificate.png" target="_blank" rel="noopener noreferrer" class="cert-title-link">
                  <span>Associate Python Developer (30 HR)</span>
                  <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; color: var(--accent);"></i>
                </a>
                <div class="cert-issuer-row">
                  <span class="cert-issuer-badge"><i class="fa-solid fa-code"></i> DataCamp</span>
                  <span>Nov 2025 · 30 HR Track</span>
                </div>
                <code class="cert-id-chip">Statement #736,739</code>
              </div>
            </article>

          </div>
        </section>

        <!-- Technical Core Capabilities Matrix -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-layer-group"></i> Technical Core</span>
            <span class="section-code-badge">05 // STACK</span>
          </div>

          <div class="skills-matrix-stack">
            <div class="skill-category-box">
              <div class="skill-cat-header"><i class="fa-solid fa-server"></i> Backend & Systems</div>
              <div class="skill-pills-row">
                <span class="skill-pill core">Python 3.12</span>
                <span class="skill-pill core">Django</span>
                <span class="skill-pill core">Django REST Framework</span>
                <span class="skill-pill core">PostgreSQL</span>
                <span class="skill-pill">SQL Optimization</span>
                <span class="skill-pill">RESTful APIs</span>
                <span class="skill-pill">JWT</span>
                <span class="skill-pill">14 RBAC Roles</span>
                <span class="skill-pill">Celery / Redis</span>
              </div>
            </div>

            <div class="skill-category-box">
              <div class="skill-cat-header"><i class="fa-solid fa-code"></i> Frontend Engineering</div>
              <div class="skill-pills-row">
                <span class="skill-pill core">React 19</span>
                <span class="skill-pill core">TypeScript</span>
                <span class="skill-pill">JavaScript (ES6+)</span>
                <span class="skill-pill">HTML5 / CSS3</span>
                <span class="skill-pill">Three.js / WebGL</span>
                <span class="skill-pill">Vite</span>
                <span class="skill-pill">Responsive UI</span>
                <span class="skill-pill">Framer Motion</span>
              </div>
            </div>

            <div class="skill-category-box">
              <div class="skill-cat-header"><i class="fa-solid fa-brain"></i> Applied AI & Data</div>
              <div class="skill-pills-row">
                <span class="skill-pill core">Pandas</span>
                <span class="skill-pill">NumPy</span>
                <span class="skill-pill">Matplotlib</span>
                <span class="skill-pill core">LLM API Integration</span>
                <span class="skill-pill">RAG Architectures</span>
                <span class="skill-pill">Prompt Engineering</span>
                <span class="skill-pill">Data Cleaning Pipelines</span>
              </div>
            </div>

            <div class="skill-category-box">
              <div class="skill-cat-header"><i class="fa-solid fa-cubes"></i> Architecture & DevOps</div>
              <div class="skill-pills-row">
                <span class="skill-pill core">Clean Architecture</span>
                <span class="skill-pill">GoF Design Patterns</span>
                <span class="skill-pill">Git / GitHub CI/CD</span>
                <span class="skill-pill">Docker</span>
                <span class="skill-pill">Linux</span>
                <span class="skill-pill">pytest</span>
                <span class="skill-pill">PEP-8</span>
                <span class="skill-pill">OWASP Security</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Education & Specialized Tracks -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-graduation-cap"></i> Education & Tracks</span>
            <span class="section-code-badge">06 // EDU</span>
          </div>

          <div class="edu-card">
            <div class="edu-item">
              <div class="edu-title">Backend Architecture & Systems Engineering</div>
              <div class="edu-inst">Specialized Track · Self-directed Engineering</div>
              <div class="edu-date">Jan 2023 – Present</div>
            </div>
            <div class="edu-item">
              <div class="edu-title">Career Track: Backend Developer</div>
              <div class="edu-inst">DataCamp Professional Career Track</div>
              <div class="edu-date">Verified Continuous Learning</div>
            </div>
            <div class="edu-item">
              <div class="edu-title">Data Science & Analytics Foundations</div>
              <div class="edu-inst">DataCamp Skill Track</div>
              <div class="edu-date">Verified Continuous Learning</div>
            </div>
          </div>
        </section>

        <!-- Languages & Standards -->
        <section>
          <div class="cv-section-title">
            <span class="title-text"><i class="fa-solid fa-globe"></i> Languages & Standards</span>
            <span class="section-code-badge">07 // GLOBAL</span>
          </div>

          <div class="lang-card">
            <div class="lang-item-row">
              <span>English</span>
              <span>Professional Working</span>
            </div>
            <div class="lang-item-row">
              <span>French</span>
              <span>Professional Working</span>
            </div>
            <div class="lang-item-row">
              <span>Arabic</span>
              <span>Native</span>
            </div>
            <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); margin-top: 6px;">
              Industry Standards
            </div>
            <div class="skill-pills-row">
              <span class="skill-pill">BIM / IFC Standards</span>
              <span class="skill-pill">PEP-8 Python</span>
              <span class="skill-pill">RESTful API Design</span>
              <span class="skill-pill">Clean Architecture</span>
              <span class="skill-pill">OWASP Security</span>
            </div>
          </div>
        </section>

      </aside>

    </div>

  </main>

  <!-- ─── Interactive Lightbox Modal for Certificate Inspection ────────────── -->
  <div class="cert-lightbox-modal" id="cert-lightbox" onclick="closeCertModal(event)">
    <div class="cert-modal-content" onclick="event.stopPropagation()">
      <div class="cert-modal-header">
        <div class="cert-modal-title">
          <i class="fa-solid fa-award" style="color: var(--accent);"></i>
          <span id="modal-cert-title">Verified Certificate Preview</span>
        </div>
        <button type="button" class="cert-modal-close" onclick="closeCertModal()" aria-label="Close Preview">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="cert-modal-body">
        <img id="modal-cert-img" src="" alt="Certificate High Resolution Photo">
      </div>
      <div class="cert-modal-footer">
        <span id="modal-cert-meta">Official Verified Credential</span>
        <button type="button" class="btn-action btn-ghost" onclick="closeCertModal()">
          <span>Close Preview</span>
        </button>
      </div>
    </div>
  </div>

  <script>
    // Theme toggle handling
    const rootEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    function applyTheme(theme) {
      rootEl.setAttribute('data-cv-theme', theme);
      localStorage.setItem('abdellah_cv_theme', theme);
      if (theme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    }

    const savedTheme = localStorage.getItem('abdellah_cv_theme') || 'dark';
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
      const current = rootEl.getAttribute('data-cv-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Lightbox modal handling
    const modal = document.getElementById('cert-lightbox');
    const modalImg = document.getElementById('modal-cert-img');
    const modalTitle = document.getElementById('modal-cert-title');
    const modalMeta = document.getElementById('modal-cert-meta');

    function openCertModal(imgSrc, title, meta) {
      modalImg.src = imgSrc;
      modalTitle.textContent = title;
      modalMeta.textContent = meta;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCertModal(e) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      modalImg.src = '';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeCertModal();
      }
    });
  </script>

</body>
</html>
`;

// 1. Write the rich HTML CV
const publicCvHtmlPath = path.join(rootDir, 'public', 'cv.html');
fs.writeFileSync(publicCvHtmlPath, cvHtml, 'utf-8');
console.log('Created enhanced visual public/cv.html successfully!');

// 2. Generate markdown CV
const cvMarkdown = `# Abdellah BELMAARIS
**Junior Full-Stack Developer at BIMPulse** • Backend Systems & Applied AI Specialist  
*Casablanca, Morocco* • [obaidbelmaaris@gmail.com](mailto:obaidbelmaaris@gmail.com) • +212 654 624 382  
[LinkedIn Profile](https://linkedin.com/in/abdellah-belmaaris) • [GitHub Profile](https://github.com/Abdellah-BELMAARIS) • [Portfolio Website](https://abdellah-belmaaris.github.io)

---

## Executive Summary
Performance-driven **Full-Stack Software Developer** operating at the intersection of enterprise backend architecture, AEC digital engineering, and applied artificial intelligence at **BIMPulse**. Specialized in engineering high-throughput **Python/Django REST** backends, normalized **PostgreSQL** schemas, and modern responsive **React/TypeScript** interfaces. Proven track record in eliminating severe N+1 SQL bottlenecks down to **constant O(1) query time** and architecting granular **14-role Role-Based Access Control (RBAC)** security engines. Certified by DataCamp in Applied AI Engineering (LLMs, RAG Architectures) and Python Data Analytics.

---

## Technical Core Capabilities
- **Backend & Systems**: Python 3.12, Django, Django REST Framework, PostgreSQL, SQL Optimization, RESTful APIs, JWT Authentication, 14 RBAC Roles, Celery, Redis
- **Frontend Engineering**: React 19, TypeScript, JavaScript (ES6+), HTML5, Semantic CSS3, Three.js, WebGL, Vite, Responsive UI, Framer Motion
- **Applied AI & Data Systems**: Pandas, NumPy, Matplotlib, LLM API Integration, RAG Architectures, Prompt Engineering, Data Cleaning Pipelines
- **Architecture & DevOps**: Clean Architecture, GoF Design Patterns, Git / GitHub CI/CD, Docker, Linux, pytest, PEP-8 Standards, OWASP Security

---

## Professional Work Experience

### Junior Full-Stack Developer — BIMPulse (Casablanca, Morocco)
*AUG 2026 — PRESENT (Apprenticeship)*  
- Engineered and deployed core application modules for **BIMPulse Academy**, an enterprise digital training platform dedicated to Architecture, Engineering, Construction & Operations (AECO) professionals.
- Developed backend services and normalized PostgreSQL relational data models strictly adhering to international **BIM / IFC digital engineering standards**.
- Engineered scalable REST APIs in Python & Django paired with modular, mobile-responsive user interfaces.
- Modeled normalized PostgreSQL schemas and optimized database transactions for high-traffic student enrollment flows.
- Formally commended by senior engineering leadership on LinkedIn for architectural milestones and technical contributions to platform delivery.
- *Technologies*: Python 3.12, Django REST, PostgreSQL, BIM/IFC Standards, React, BIMPulse Academy

### Django & Backend Systems Developer — Production Systems (Casablanca, Morocco)
*MAY 2026 — AUG 2026*  
- Architected enterprise-grade **Role-Based Access Control (RBAC)** supporting **14 discrete user roles** with granular permission matrices and security auditing.
- Eliminated severe **N+1 query bottlenecks** using eager loading (\`select_related\` and \`prefetch_related\`), reducing database roundtrips to constant O(1) query time.
- Integrated automated transactional emails, custom full-text search indexing, and resilient structured application logging.
- *Technologies*: Django, 14 RBAC Roles, O(1) Eager Loading, SQL Optimization, PostgreSQL

### Python Developer & Data Systems — Systems Engineering & Open Source
*JAN 2020 — PRESENT*  
- Constructed automated high-throughput data processing pipelines, unstructured server log tokenizers, and computational algorithms in Python 3.12.
- Authored a production-grade software library implementing classical **Gang of Four (GoF) design patterns** with 100% pytest test suite coverage and clean dependency injection.
- *Technologies*: Python 3.12, Design Patterns, Pandas, pytest, Data Pipelines

### Web Developer — Full-Stack Applications (Casablanca, Morocco)
*FEB 2023 — JUN 2026*  
- Engineered full-stack web applications translating functional requirements into modular backends and responsive user interfaces.
- Developed **The Modern Journal CMS**, a scalable publishing platform featuring multi-user roles, live readership analytics telemetry, and responsive typography.
- *Technologies*: Web Development, Django, Bootstrap 5, HTML5/CSS3, REST APIs

---

## Standout Production Projects
- **The Modern Journal — CMS**: Production multi-user publishing engine featuring granular 14-role matrices, live analytics telemetry (views, users, posts), constant O(1) query resolution, and transactional email triggers.
- **PyGame 3D Web Arcade (WASM)**: Compiled 16 native Python Pygame arcade games to WebAssembly via Pygbag. Features interactive 3D cabinet selector with dynamic Three.js lighting and locked 60 FPS WebGL rendering.
- **Dev-Pulse — Developer Telemetry Engine**: Local data telemetry engine parsing high-dimensional unstructured system logs; performs cleaning with Pandas and automatically generates statistical Matplotlib performance reports in under 200ms.
- **OOP Software Design Patterns & Architecture Library**: Reference implementation of Gang of Four software design patterns in Python demonstrating modular separation of concerns, dependency inversion, clean architecture, and complete unit test suites.

---

## Verified Industry Credentials (With Official Certificates)
1. **AI Engineer for Developers Associate** — DataCamp Certified (Apr 2026 – Apr 2028) • *ID: AIEDA0011678564836*
2. **Python Data Associate** — DataCamp Certified (Feb 2026 – Feb 2028) • *ID: PDA0019412806212*
3. **Cybersecurity Fundamentals** — المدرسة - Almdrasa (Issued Feb 2026 · Verified) • *ID: 77F16BFF2A-77EB48CD64-1451D2521*
4. **Associate Python Developer (30 HR)** — DataCamp Statement of Accomplishment (Nov 2025) • *ID: Statement #736,739*

---

## Education & Specialized Tracks
- **Backend Architecture & Systems Engineering**: Specialized Track • Self-directed Engineering (Jan 2023 – Present)
- **Career Track: Backend Developer**: DataCamp Professional Career Track • Verified Continuous Learning
- **Data Science & Analytics Foundations**: DataCamp Skill Track • Verified Continuous Learning

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
