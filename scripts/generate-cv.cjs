const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const avatarPath = path.join(rootDir, 'public', 'assets', 'avatar.jpg');
const bimpulseLogoPath = path.join(rootDir, 'public', 'assets', 'bimpulse-logo.png');

let avatarBase64 = '';
if (fs.existsSync(avatarPath)) {
  avatarBase64 = `data:image/jpeg;base64,${fs.readFileSync(avatarPath).toString('base64')}`;
}

let bimpulseBase64 = '';
if (fs.existsSync(bimpulseLogoPath)) {
  bimpulseBase64 = `data:image/png;base64,${fs.readFileSync(bimpulseLogoPath).toString('base64')}`;
}

const cvHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abdellah BELMAARIS — Curriculum Vitae | Junior Full-Stack Developer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --card-border: #1f2937;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --text-sub: #6b7280;
      --cyan: #00e5ff;
      --cyan-soft: rgba(0, 229, 255, 0.12);
      --cyan-border: rgba(0, 229, 255, 0.3);
      --emerald: #10b981;
      --emerald-soft: rgba(16, 185, 129, 0.12);
      --purple: #a855f7;
      --purple-soft: rgba(168, 85, 247, 0.12);
      --amber: #f59e0b;
      --blue: #3b82f6;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #06090e;
      color: var(--text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* Screen Action Bar (hidden in print) */
    .screen-action-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 25, 0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .action-bar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      color: #fff;
    }
    .action-bar-brand .logo-badge {
      background: linear-gradient(135deg, #00e5ff, #3b82f6);
      color: #000;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .action-bar-buttons {
      display: flex;
      gap: 10px;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .btn-action.btn-cyan {
      background: #00e5ff;
      color: #06090e;
    }
    .btn-action.btn-cyan:hover {
      background: #33ebff;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(0, 229, 255, 0.35);
    }
    .btn-action.btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.15);
      color: #e5e7eb;
    }
    .btn-action.btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    /* CV Document Container */
    .cv-container {
      max-width: 900px;
      margin: 32px auto;
      background: #0b111e;
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 229, 255, 0.05);
    }

    /* Header Section */
    .cv-header {
      background: linear-gradient(135deg, #090e18 0%, #0e172a 100%);
      border-bottom: 1px solid rgba(0, 229, 255, 0.2);
      padding: 36px 40px;
      position: relative;
    }
    .cv-header-top {
      display: flex;
      gap: 28px;
      align-items: center;
    }
    .avatar-wrapper {
      position: relative;
      flex-shrink: 0;
    }
    .avatar-img {
      width: 104px;
      height: 104px;
      border-radius: 20px;
      object-fit: cover;
      border: 2px solid #00e5ff;
      box-shadow: 0 8px 24px rgba(0, 229, 255, 0.25);
      display: block;
    }
    .avatar-status-dot {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 18px;
      height: 18px;
      background: #10b981;
      border: 3px solid #0b111e;
      border-radius: 50%;
    }
    .header-details {
      flex: 1;
    }
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      background: var(--cyan-soft);
      color: var(--cyan);
      border: 1px solid var(--cyan-border);
      margin-bottom: 8px;
    }
    .cv-name {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      line-height: 1.15;
    }
    .cv-title {
      font-size: 17px;
      font-weight: 600;
      color: #38bdf8;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cv-company-tag {
      color: #94a3b8;
      font-weight: 400;
    }

    /* Contact & Metadata Pills Grid */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.15s;
    }
    .contact-item:hover {
      color: #00e5ff;
    }
    .contact-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00e5ff;
      font-size: 12px;
      flex-shrink: 0;
    }

    /* CV Main Body */
    .cv-body {
      padding: 36px 40px;
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 36px;
    }

    /* Section Styling */
    .cv-section {
      margin-bottom: 28px;
    }
    .cv-section:last-child {
      margin-bottom: 0;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(0, 229, 255, 0.2);
    }
    .section-icon {
      color: #00e5ff;
      font-size: 14px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #ffffff;
    }

    /* Profile Narrative */
    .profile-text {
      font-size: 13px;
      line-height: 1.65;
      color: #cbd5e1;
      text-align: justify;
    }

    /* Left Sidebar Cards */
    .credential-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-left: 3px solid #00e5ff;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .cred-title {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }
    .cred-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 3px;
      display: flex;
      justify-content: space-between;
    }
    .cred-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 6px;
      display: inline-block;
    }

    /* Skills Pill Cloud */
    .skill-group {
      margin-bottom: 14px;
    }
    .skill-group-name {
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #38bdf8;
      margin-bottom: 6px;
    }
    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-pill {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
    }
    .skill-pill.highlight {
      background: rgba(0, 229, 255, 0.1);
      border-color: rgba(0, 229, 255, 0.3);
      color: #00e5ff;
      font-weight: 600;
    }

    /* Education Item */
    .edu-item {
      margin-bottom: 12px;
      padding-left: 12px;
      border-left: 2px solid rgba(255, 255, 255, 0.1);
    }
    .edu-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #f1f5f9;
    }
    .edu-inst {
      font-size: 11.5px;
      color: #94a3b8;
    }
    .edu-date {
      font-size: 10.5px;
      color: #64748b;
    }

    /* Right Column: Experience Timeline */
    .exp-item {
      margin-bottom: 22px;
      position: relative;
    }
    .exp-item:last-child {
      margin-bottom: 0;
    }
    .exp-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    .exp-role-name {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
    }
    .exp-company-name {
      font-size: 13.5px;
      font-weight: 600;
      color: #00e5ff;
    }
    .exp-date-badge {
      font-size: 11px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      padding: 3px 8px;
      border-radius: 4px;
    }
    .exp-location {
      font-size: 11.5px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .exp-bullet-list {
      list-style: none;
      padding: 0;
    }
    .exp-bullet-list li {
      font-size: 12.5px;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 6px;
      position: relative;
      padding-left: 16px;
    }
    .exp-bullet-list li::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: #00e5ff;
      font-weight: bold;
    }
    .exp-tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .exp-mini-tag {
      font-size: 10.5px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(0, 229, 255, 0.08);
      color: #38bdf8;
      border: 1px solid rgba(0, 229, 255, 0.2);
    }

    /* Projects Section in CV */
    .project-card {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 14px;
    }
    .project-card:last-child {
      margin-bottom: 0;
    }
    .project-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .project-name {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
    }
    .project-badge {
      font-size: 10.5px;
      font-family: 'JetBrains Mono', monospace;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .project-desc {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.55;
      margin-bottom: 8px;
    }
    .project-highlights {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: #38bdf8;
    }
    .project-highlights span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Footer / Telemetry */
    .cv-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: #080d16;
      padding: 16px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      color: #64748b;
    }
    .cv-footer a {
      color: #00e5ff;
      text-decoration: none;
    }

    /* Print & PDF Export Rules */
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
      }
      .screen-action-bar {
        display: none !important;
      }
      .cv-container {
        max-width: 100% !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        background: #ffffff !important;
      }
      .cv-header {
        background: #0a1120 !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .cv-name {
        color: #ffffff !important;
      }
      .contact-item {
        color: #cbd5e1 !important;
      }
      .contact-icon {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #00e5ff !important;
      }
      .cv-body {
        background: #ffffff !important;
        color: #1e293b !important;
      }
      .section-title {
        color: #0f172a !important;
        border-bottom-color: #0284c7 !important;
      }
      .profile-text, .exp-bullet-list li {
        color: #334155 !important;
      }
      .exp-role-name, .project-name, .cred-title {
        color: #0f172a !important;
      }
      .exp-company-name {
        color: #0284c7 !important;
      }
      .credential-card, .project-card {
        background: #f8fafc !important;
        border-color: #e2e8f0 !important;
      }
      .skill-pill {
        background: #f1f5f9 !important;
        color: #334155 !important;
        border-color: #cbd5e1 !important;
      }
      .skill-pill.highlight {
        background: #e0f2fe !important;
        color: #0369a1 !important;
        border-color: #7dd3fc !important;
      }
      .cv-footer {
        background: #f8fafc !important;
        color: #64748b !important;
      }
    }

    @media (max-width: 768px) {
      .cv-body {
        grid-template-columns: 1fr;
        padding: 24px;
      }
      .cv-header {
        padding: 24px;
      }
      .cv-header-top {
        flex-direction: column;
        align-items: flex-start;
      }
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Screen Action Bar -->
  <header class="screen-action-bar">
    <div class="action-bar-brand">
      <span class="logo-badge">AB.</span>
      <span>Abdellah BELMAARIS — Portfolio Pro CV</span>
    </div>
    <div class="action-bar-buttons">
      <a href="/" class="btn-action btn-ghost">
        <i class="fa-solid fa-arrow-left"></i> Return to Portfolio
      </a>
      <a href="assets/Abdellah_BELMAARIS_CV.pdf" download="Abdellah_BELMAARIS_CV.pdf" class="btn-action btn-cyan">
        <i class="fa-solid fa-file-arrow-down"></i> Download PDF Version
      </a>
      <button onclick="window.print()" class="btn-action btn-ghost">
        <i class="fa-solid fa-print"></i> Print Document
      </button>
    </div>
  </header>

  <!-- Document Container -->
  <main class="cv-container">
    <!-- Header -->
    <header class="cv-header">
      <div class="cv-header-top">
        <div class="avatar-wrapper">
          <img src="${avatarBase64}" alt="Abdellah BELMAARIS" class="avatar-img" />
          <span class="avatar-status-dot" title="Available for new opportunities"></span>
        </div>
        <div class="header-details">
          <span class="badge-pill">
            <i class="fa-solid fa-circle-check"></i> Available for Full-Stack & AI Roles
          </span>
          <h1 class="cv-name">Abdellah BELMAARIS</h1>
          <div class="cv-title">
            <span>Junior Full-Stack Developer</span>
            <span class="cv-company-tag">at BIMPulse • Casablanca, Morocco</span>
          </div>
        </div>
      </div>

      <!-- Contact Metadata Grid -->
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-icon"><i class="fa-solid fa-location-dot"></i></div>
          <span>Casablanca, Morocco (Hybrid/Remote)</span>
        </div>
        <a href="mailto:obaidbelmaaris@gmail.com" class="contact-item">
          <div class="contact-icon"><i class="fa-solid fa-envelope"></i></div>
          <span>obaidbelmaaris@gmail.com</span>
        </a>
        <a href="https://linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer" class="contact-item">
          <div class="contact-icon"><i class="fa-brands fa-linkedin"></i></div>
          <span>linkedin.com/in/abdellah-belmaaris</span>
        </a>
        <a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer" class="contact-item">
          <div class="contact-icon"><i class="fa-brands fa-github"></i></div>
          <span>github.com/Abdellah-BELMAARIS</span>
        </a>
        <a href="https://abdellah-belmaaris.github.io" target="_blank" rel="noopener noreferrer" class="contact-item">
          <div class="contact-icon"><i class="fa-solid fa-globe"></i></div>
          <span>abdellah-belmaaris.github.io</span>
        </a>
      </div>
    </header>

    <!-- 2-Column Body Layout -->
    <div class="cv-body">
      <!-- Left Column (Bio, Credentials, Skills, Education) -->
      <aside class="cv-left-col">
        <!-- Executive Profile -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-user-astronaut section-icon"></i>
            <h2 class="section-title">Executive Profile</h2>
          </div>
          <p class="profile-text">
            Junior Full-Stack Developer operating at the intersection of web architecture and AEC digital transformation at BIMPulse. Specializes in building modular Python backends, Django REST APIs, relational PostgreSQL schemas, and modern responsive frontends. Certified by DataCamp in Applied AI Engineering (LLMs, RAG) and Python Data Analytics.
          </p>
        </section>

        <!-- Verified Credentials -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-award section-icon"></i>
            <h2 class="section-title">Verified Credentials</h2>
          </div>

          <div class="credential-card">
            <div class="cred-title">AI Engineer for Developers Associate</div>
            <div class="cred-meta">
              <span>DataCamp</span>
              <span>Issued Apr 2026</span>
            </div>
            <code class="cred-id">AIEDA0011678564836</code>
          </div>

          <div class="credential-card">
            <div class="cred-title">Python Data Associate</div>
            <div class="cred-meta">
              <span>DataCamp</span>
              <span>Issued Feb 2026</span>
            </div>
            <code class="cred-id">PDA0019412806212</code>
          </div>

          <div class="credential-card">
            <div class="cred-title">Cybersecurity Fundamentals</div>
            <div class="cred-meta">
              <span>المدرسة - Almdrasa</span>
              <span>Feb 2026</span>
            </div>
            <code class="cred-id">77F16BFF2A-77EB48CD64-1451D2521</code>
          </div>

          <div class="credential-card">
            <div class="cred-title">Associate Python Developer</div>
            <div class="cred-meta">
              <span>DataCamp · 30 HR Track</span>
              <span>Nov 2025</span>
            </div>
            <code class="cred-id">#736,739 Statement</code>
          </div>
        </section>

        <!-- Core Technical Stack -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-layer-group section-icon"></i>
            <h2 class="section-title">Core Capabilities</h2>
          </div>

          <div class="skill-group">
            <div class="skill-group-name">Development (Core)</div>
            <div class="skill-pills">
              <span class="skill-pill highlight">Python</span>
              <span class="skill-pill highlight">Django</span>
              <span class="skill-pill highlight">Django REST</span>
              <span class="skill-pill highlight">PostgreSQL</span>
              <span class="skill-pill">SQL Optimization</span>
              <span class="skill-pill">React</span>
              <span class="skill-pill">TypeScript</span>
              <span class="skill-pill">HTML5 / CSS3</span>
              <span class="skill-pill">RESTful APIs</span>
            </div>
          </div>

          <div class="skill-group">
            <div class="skill-group-name">Data & Applied AI</div>
            <div class="skill-pills">
              <span class="skill-pill highlight">Pandas</span>
              <span class="skill-pill">Matplotlib</span>
              <span class="skill-pill">Data Pipelines</span>
              <span class="skill-pill highlight">LLM APIs</span>
              <span class="skill-pill">RAG Concepts</span>
              <span class="skill-pill">Prompt Engineering</span>
            </div>
          </div>

          <div class="skill-group">
            <div class="skill-group-name">Systems & Tools</div>
            <div class="skill-pills">
              <span class="skill-pill">14 RBAC Roles</span>
              <span class="skill-pill">Design Patterns (GoF)</span>
              <span class="skill-pill">WebAssembly (Pygbag)</span>
              <span class="skill-pill">Three.js</span>
              <span class="skill-pill">Git / GitHub</span>
              <span class="skill-pill">Docker</span>
              <span class="skill-pill">Unit Testing</span>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-graduation-cap section-icon"></i>
            <h2 class="section-title">Education & Tracks</h2>
          </div>

          <div class="edu-item">
            <div class="edu-title">Backend Architecture & Systems</div>
            <div class="edu-inst">Specialized Track · Self-directed</div>
            <div class="edu-date">2023 – 2026</div>
          </div>

          <div class="edu-item">
            <div class="edu-title">Career Track: Backend Developer</div>
            <div class="edu-inst">DataCamp Professional Path</div>
            <div class="edu-date">Certified Continuous Learning</div>
          </div>

          <div class="edu-item">
            <div class="edu-title">Data Science & Analytics Foundations</div>
            <div class="edu-inst">DataCamp Skill Track</div>
            <div class="edu-date">Certified Continuous Learning</div>
          </div>
        </section>

        <!-- Languages -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-language section-icon"></i>
            <h2 class="section-title">Languages</h2>
          </div>
          <div class="skill-pills">
            <span class="skill-pill">English (Professional)</span>
            <span class="skill-pill">French (Professional)</span>
            <span class="skill-pill">Arabic (Native)</span>
          </div>
        </section>
      </aside>

      <!-- Right Column (Experience & Featured Projects) -->
      <main class="cv-right-col">
        <!-- Professional Experience -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-briefcase section-icon"></i>
            <h2 class="section-title">Professional Experience</h2>
          </div>

          <!-- Role 1: BIMPulse -->
          <article class="exp-item">
            <div class="exp-item-header">
              <h3 class="exp-role-name">Junior Full-Stack Developer</h3>
              <span class="exp-date-badge">AUG 2026 — PRESENT</span>
            </div>
            <div class="exp-company-name">BIMPulse • Casablanca, Morocco (Apprenticeship)</div>
            <div class="exp-location">Connecting software development with BIM, engineering, and AEC digital transformation</div>
            <ul class="exp-bullet-list">
              <li>Contributing to <strong>BIMPulse Academy</strong>, an enterprise learning platform for AECO (Architecture, Engineering, Construction & Operations) professionals.</li>
              <li>Engineered backend services and relational data models complying with international <strong>BIM / IFC industry standards</strong>.</li>
              <li>Developed performant backend APIs in Python & Django coupled with modular, accessible client-side interfaces.</li>
              <li>Acknowledged by senior engineering leadership on LinkedIn for architectural contributions to production platform milestones.</li>
            </ul>
            <div class="exp-tags-row">
              <span class="exp-mini-tag">BIMPulse Academy</span>
              <span class="exp-mini-tag">BIM / IFC</span>
              <span class="exp-mini-tag">Python & Django</span>
              <span class="exp-mini-tag">PostgreSQL</span>
              <span class="exp-mini-tag">Digital Solutions</span>
            </div>
          </article>

          <!-- Role 2: Django Developer -->
          <article class="exp-item">
            <div class="exp-item-header">
              <h3 class="exp-role-name">Django & Backend Developer</h3>
              <span class="exp-date-badge">MAY 2026 — PRESENT</span>
            </div>
            <div class="exp-company-name">Production & Self-Directed Web Architecture</div>
            <div class="exp-location">Casablanca, Morocco</div>
            <ul class="exp-bullet-list">
              <li>Engineered enterprise-grade <strong>Role-Based Access Control (RBAC)</strong> supporting 14 distinct roles with granular permission matrices.</li>
              <li>Eliminated the <strong>N+1 query bottleneck</strong> using eager loading (<code>select_related</code> and <code>prefetch_related</code>), reducing loop query latency to constant O(1) performance.</li>
              <li>Built robust Django REST Framework endpoints with JWT authentication, custom query search indexing, and automated transactional emails.</li>
            </ul>
            <div class="exp-tags-row">
              <span class="exp-mini-tag">Django REST</span>
              <span class="exp-mini-tag">14 RBAC Roles</span>
              <span class="exp-mini-tag">O(1) Eager Loading</span>
              <span class="exp-mini-tag">PostgreSQL</span>
            </div>
          </article>

          <!-- Role 3: Python Developer -->
          <article class="exp-item">
            <div class="exp-item-header">
              <h3 class="exp-role-name">Python Developer & Data Systems</h3>
              <span class="exp-date-badge">JAN 2020 — PRESENT</span>
            </div>
            <div class="exp-company-name">Core Systems & Automation</div>
            <ul class="exp-bullet-list">
              <li>Built automated data extraction pipelines, unstructured log tokenizers, and algorithms across the Python ecosystem.</li>
              <li>Designed modular object-oriented software implementing classical Gang of Four design patterns and strict PEP-8 compliance.</li>
            </ul>
            <div class="exp-tags-row">
              <span class="exp-mini-tag">Python 3.12</span>
              <span class="exp-mini-tag">Pandas</span>
              <span class="exp-mini-tag">Data Pipelines</span>
              <span class="exp-mini-tag">Design Patterns</span>
            </div>
          </article>
        </section>

        <!-- Featured Production Projects -->
        <section class="cv-section">
          <div class="section-header">
            <i class="fa-solid fa-code-branch section-icon"></i>
            <h2 class="section-title">Key Production Projects</h2>
          </div>

          <!-- Project 1 -->
          <div class="project-card">
            <div class="project-top">
              <span class="project-name">The Modern Journal — Architectural Django CMS</span>
              <span class="project-badge">14 RBAC Roles</span>
            </div>
            <p class="project-desc">
              Production-ready multi-user publishing platform with author telemetry dashboards, constant O(1) database query resolution, custom full-text search indexing, and automated email workflows.
            </p>
            <div class="project-highlights">
              <span><i class="fa-solid fa-bolt"></i> O(1) Queries</span>
              <span><i class="fa-solid fa-shield"></i> RBAC Security</span>
              <span><i class="fa-solid fa-chart-line"></i> Live Analytics</span>
            </div>
          </div>

          <!-- Project 2 -->
          <div class="project-card">
            <div class="project-top">
              <span class="project-name">PyGame 3D Web Arcade & WASM Console</span>
              <span class="project-badge">16 Games WASM</span>
            </div>
            <p class="project-desc">
              Compiled 16 native Python PyGame classics into client-side WebAssembly via Pygbag. Features interactive 3D cabinet selector with dynamic Three.js lighting and locked 60 FPS WebGL rendering.
            </p>
            <div class="project-highlights">
              <span><i class="fa-solid fa-gamepad"></i> 16 Python Games</span>
              <span><i class="fa-solid fa-cube"></i> Three.js 3D</span>
              <span><i class="fa-solid fa-microchip"></i> WebAssembly</span>
            </div>
          </div>

          <!-- Project 3 -->
          <div class="project-card">
            <div class="project-top">
              <span class="project-name">Dev-Pulse — Developer Activity Telemetry</span>
              <span class="project-badge">&lt;200ms Reports</span>
            </div>
            <p class="project-desc">
              High-throughput developer telemetry engine parsing unstructured system logs with Pandas; generates automated Matplotlib statistical performance visuals with 100% privacy-first local processing.
            </p>
            <div class="project-highlights">
              <span><i class="fa-solid fa-shield-halved"></i> 100% Local</span>
              <span><i class="fa-solid fa-file-waveform"></i> Pandas Pipeline</span>
              <span><i class="fa-solid fa-chart-pie"></i> Matplotlib</span>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- CV Footer -->
    <footer class="cv-footer">
      <span>Curriculum Vitae of Abdellah BELMAARIS • Verified Authentic Portfolio Document</span>
      <span>Live Portfolio: <a href="https://abdellah-belmaaris.github.io" target="_blank">abdellah-belmaaris.github.io</a></span>
    </footer>
  </main>

</body>
</html>
`;

// 1. Write HTML file to public/cv.html
const publicCvHtmlPath = path.join(rootDir, 'public', 'cv.html');
fs.writeFileSync(publicCvHtmlPath, cvHtml, 'utf-8');
console.log('Created public/cv.html successfully!');

// 2. Also write a clean Markdown version to CV.md
const cvMarkdown = `# Abdellah BELMAARIS
**Junior Full-Stack Developer at BIMPulse • Applied AI & Django Specialist**  
Casablanca, Morocco · obaidbelmaaris@gmail.com · [LinkedIn](https://linkedin.com/in/abdellah-belmaaris) · [GitHub](https://github.com/Abdellah-BELMAARIS) · [Portfolio](https://abdellah-belmaaris.github.io)

---

## Executive Profile
Junior Full-Stack Developer operating at the intersection of web architecture and AEC digital transformation at BIMPulse. Specializes in building modular Python backends, Django REST APIs, relational PostgreSQL schemas, and modern responsive frontends. Certified by DataCamp in Applied AI Engineering (LLMs, RAG) and Python Data Analytics.

---

## Professional Experience

### Junior Full-Stack Developer — BIMPulse
*Casablanca, Morocco (Apprenticeship) | Aug 2026 – Present*
- Contributing to **BIMPulse Academy**, an enterprise learning platform for AECO (Architecture, Engineering, Construction & Operations) professionals.
- Engineered backend services and relational data models complying with international **BIM / IFC industry standards**.
- Developed performant backend APIs in Python & Django coupled with modular, accessible client-side interfaces.
- Acknowledged by senior engineering leadership on LinkedIn for architectural contributions to production platform milestones.

### Django & Backend Developer — Self-Directed & Production Work
*Casablanca, Morocco | May 2026 – Present*
- Engineered enterprise-grade **Role-Based Access Control (RBAC)** supporting 14 distinct roles with granular permission matrices.
- Eliminated the **N+1 query bottleneck** using eager loading (\`select_related\` and \`prefetch_related\`), reducing loop query latency to constant O(1) performance.
- Built robust Django REST Framework endpoints with JWT authentication, custom query search indexing, and automated transactional emails.

### Python Developer & Data Systems — Core Systems & Automation
*Jan 2020 – Present*
- Built automated data extraction pipelines, unstructured log tokenizers, and algorithms across the Python ecosystem.
- Designed modular object-oriented software implementing classical Gang of Four design patterns and strict PEP-8 compliance.

---

## Verified Industry Credentials
- **AI Engineer for Developers Associate** — DataCamp (Credential ID: \`AIEDA0011678564836\`, Issued Apr 2026 · Valid through Apr 2028)
- **Python Data Associate** — DataCamp (Credential ID: \`PDA0019412806212\`, Issued Feb 2026 · Valid through Feb 2028)
- **Cybersecurity Fundamentals** — المدرسة / Almdrasa (Credential ID: \`77F16BFF2A-77EB48CD64-1451D2521\`, Issued Feb 2026)
- **Associate Python Developer (30 HR Track)** — DataCamp (#736,739 Statement of Accomplishment, Nov 2025)

---

## Standout Production Projects
- **The Modern Journal — Architectural Django CMS**: Full-featured CMS with 14 RBAC roles, O(1) eager loading query optimization, author telemetry dashboard, and full-text search indexing.
- **PyGame 3D Web Arcade & WASM Console**: 16 native Python games compiled to WebAssembly via Pygbag, rendered at 60 FPS in browser with Three.js 3D cabinet selector.
- **Dev-Pulse — Developer Activity Telemetry Engine**: Local data pipeline parsing system logs with Pandas and generating automated Matplotlib visual reports in <200ms.
- **OOP Architecture & Software Patterns Library**: Production GoF design patterns in Python 3.12 with clean architecture and unit test suites.

---

## Technical Capabilities
- **Core Languages & Frameworks**: Python 3.12, Django, Django REST Framework, PostgreSQL, SQL, React, TypeScript, HTML5, CSS3, REST APIs.
- **Data & Applied AI**: Pandas, Matplotlib, Data Pipelines, LLM API Integration, Prompt Engineering, RAG Concepts.
- **Engineering & Systems**: 14 RBAC Roles, Clean Architecture, Design Patterns (GoF), WebAssembly (Pygbag), Three.js, Git/GitHub, Docker, Unit Testing.

---

## Education
- **Specialized Track: Backend Architecture & Systems** (2023 – 2026)
- **Career Track: Backend Developer** — DataCamp
- **Data Science & Analytics Foundations** — DataCamp

## Languages
- **English**: Professional Working Proficiency
- **French**: Professional Working Proficiency
- **Arabic**: Native Proficiency
`;

fs.writeFileSync(path.join(rootDir, 'CV.md'), cvMarkdown, 'utf-8');
fs.writeFileSync(path.join(rootDir, 'public', 'assets', 'Abdellah_BELMAARIS_CV.txt'), cvMarkdown, 'utf-8');
console.log('Created CV.md and public/assets/Abdellah_BELMAARIS_CV.txt successfully!');

// 3. Compile public/cv.html into public/assets/Abdellah_BELMAARIS_CV.pdf using Microsoft Edge
const pdfDestPath = path.join(rootDir, 'public', 'assets', 'Abdellah_BELMAARIS_CV.pdf');
const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgeExe)) {
  console.log('Compiling Pro CV PDF with Microsoft Edge headless...');
  const fileUrl = `file:///${publicCvHtmlPath.replace(/\\/g, '/')}`;
  
  if (fs.existsSync(pdfDestPath)) {
    try {
      fs.unlinkSync(pdfDestPath);
      console.log('Removed old LinkedIn PDF file.');
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
      Write-Host "Edge PDF Generation Success! Bytes: $($item.Length)"
    } else {
      Write-Error "Failed to generate PDF at $pdf"
    }
  `;

  try {
    const { spawnSync } = require('child_process');
    const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', psScript], { encoding: 'utf-8' });
    console.log(result.stdout || result.stderr);
    if (fs.existsSync(pdfDestPath)) {
      const stat = fs.statSync(pdfDestPath);
      console.log(`Verified new Pro CV PDF! Size: ${stat.size} bytes at: ${pdfDestPath}`);
    }
  } catch (err) {
    console.error('Error executing Edge command:', err);
  }
} else {
  console.warn('Microsoft Edge executable not found at expected path.');
}

