import { useState } from 'react';
import { motion } from 'framer-motion';
import { t as translateText } from '../i18n';

interface FooterGrandEndingProps {
  onScrollToTop?: () => void;
}

export default function FooterGrandEnding({
  onScrollToTop
}: FooterGrandEndingProps) {
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('obaidbelmaaris@gmail.com');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2400);
    } catch {
      // Fallback
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2400);
    }
  };

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="footer-grand-wrap">
      {/* ─── Grand Ending CTA Card ────────────────────────────────────── */}
      <motion.div
        className="footer-grand-cta-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-cta-glow-orb" />
        
        <div className="footer-cta-header-line">
          <span className="footer-status-pill">
            <span className="footer-pulse-dot" />
            <span>{translateText("AVAILABLE FOR CONTRACTS & NEW ROLES")}</span>
          </span>
          <span className="footer-location-tag">
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--emerald-bright)', marginRight: '6px' }} />
            Casablanca, Morocco
          </span>
        </div>

        <h2 className="footer-grand-title">
          {translateText("READY TO BUILD SOMETHING MEANINGFUL?")}
        </h2>

        <p className="footer-grand-subtitle">
          {translateText("Whether you are looking for a Full-Stack Web Developer, a Django REST Backend Architect, or an Applied AI & Data Engineer — let’s build high-impact solutions together.")}
        </p>

        <div className="footer-grand-actions-row">
          <button
            type="button"
            className="btn btn-primary footer-action-btn highlight"
            onClick={() => handleNavigate('request-project')}
            id="footer-start-project-btn"
          >
            <span>{translateText("Start a Project Inquiry →")}</span>
          </button>

          <a
            href="assets/Abdellah_BELMAARIS_CV.pdf"
            download="Abdellah_BELMAARIS_CV.pdf"
            className="btn btn-secondary footer-action-btn"
            id="footer-download-cv-btn"
            title={translateText("Download Abdellah BELMAARIS CV (PDF)")}
          >
            <i className="fa-solid fa-file-arrow-down" style={{ marginRight: '8px', color: 'var(--accent)' }} />
            <span>{translateText("Download CV (PDF)")}</span>
            <span className="btn-arrow" style={{ marginLeft: '4px' }}>↓</span>
          </a>

          <a
            href="cv.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary footer-action-btn"
            id="footer-view-cv-btn"
            title={translateText("View Abdellah BELMAARIS Interactive CV")}
          >
            <i className="fa-solid fa-file-lines" style={{ marginRight: '8px', color: '#10b981' }} />
            <span>{translateText("View CV (Online)")}</span>
            <span className="btn-arrow" style={{ marginLeft: '4px' }}>↗</span>
          </a>



          <button
            type="button"
            className={`btn btn-secondary footer-action-btn email-copy ${emailCopied ? 'copied' : ''}`}
            onClick={handleCopyEmail}
            id="footer-copy-email-btn"
            title={translateText("Click to copy email")}
          >
            <i className={`fa-solid ${emailCopied ? 'fa-check' : 'fa-copy'}`} style={{ marginRight: '8px', color: emailCopied ? 'var(--emerald-bright)' : 'var(--cyan)' }} />
            <span>{emailCopied ? translateText("Email Copied!") : 'obaidbelmaaris@gmail.com'}</span>
          </button>
        </div>
      </motion.div>

      {/* ─── 4-Column Architectural Footer ───────────────────────────── */}
      <footer className="footer-grand-main" role="contentinfo">
        <div className="footer-columns-grid">
          {/* Column 1: Identity */}
          <div className="footer-col col-identity">
            <div className="footer-brand-lockup">
              <span className="footer-brand-logo">{translateText("AB.")}</span>
              <div className="footer-brand-text">
                <h3 className="footer-brand-name">Abdellah BELMAARIS</h3>
                <p className="footer-brand-sub">{translateText("Junior Full-Stack Developer at BIMPulse")}</p>
              </div>
            </div>

            <p className="footer-col-desc">
              {translateText("Building robust full-stack web platforms, Django REST systems, and applied AI applications with clean software architecture.")}
            </p>
          </div>

          {/* Column 2: Quick Directory */}
          <div className="footer-col col-directory">
            <h4 className="footer-col-title">
              <i className="fa-solid fa-compass" style={{ marginRight: '8px', color: 'var(--accent)' }} />
              {translateText("Quick Directory")}
            </h4>
            <ul className="footer-nav-list">
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Services & Solutions")}
                </a>
              </li>
              <li>
                <a href="#work" onClick={(e) => { e.preventDefault(); handleNavigate('work'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Selected Work")}
                </a>
              </li>
              <li>
                <a href="#personal-projects" onClick={(e) => { e.preventDefault(); handleNavigate('personal-projects'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Personal Projects")}
                </a>
              </li>
              <li>
                <a href="#experience" onClick={(e) => { e.preventDefault(); handleNavigate('experience'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Experience & BIMPulse")}
                </a>
              </li>
              <li>
                <a href="#skills" onClick={(e) => { e.preventDefault(); handleNavigate('skills'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Bio-Neural Skills Mesh")}
                </a>
              </li>
              <li>
                <a href="#certifications" onClick={(e) => { e.preventDefault(); handleNavigate('certifications'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Verified Credentials")}
                </a>
              </li>
              <li>
                <a href="#request-project" onClick={(e) => { e.preventDefault(); handleNavigate('request-project'); }}>
                  <i className="fa-solid fa-angle-right" /> {translateText("Start a Project")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Industry Credentials */}
          <div className="footer-col col-credentials">
            <h4 className="footer-col-title">
              <i className="fa-solid fa-award" style={{ marginRight: '8px', color: 'var(--emerald-bright)' }} />
              {translateText("Verified Industry Credentials")}
            </h4>
            <div className="footer-credentials-stack">
              <a
                href="https://www.datacamp.com/certificate/AIEDA0011678564836"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credential-item"
              >
                <div className="footer-cred-top">
                  <span className="footer-cred-name">AI Engineer for Developers Associate</span>
                  <span className="footer-cred-arrow">↗</span>
                </div>
                <span className="footer-cred-meta">DataCamp · AIEDA0011678564836 · 2026</span>
              </a>

              <a
                href="https://www.datacamp.com/certificate/PDA0019412806212"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credential-item"
              >
                <div className="footer-cred-top">
                  <span className="footer-cred-name">Python Data Associate</span>
                  <span className="footer-cred-arrow">↗</span>
                </div>
                <span className="footer-cred-meta">DataCamp · PDA0019412806212 · 2026</span>
              </a>

              <a
                href="https://almdrasa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credential-item"
              >
                <div className="footer-cred-top">
                  <span className="footer-cred-name">Cybersecurity Fundamentals</span>
                  <span className="footer-cred-arrow">↗</span>
                </div>
                <span className="footer-cred-meta">المدرسة - Almdrasa · Verified · 2026</span>
              </a>

              <a
                href="assets/certificate.png"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credential-item"
              >
                <div className="footer-cred-top">
                  <span className="footer-cred-name">Associate Python Developer (30 HR)</span>
                  <span className="footer-cred-arrow">↗</span>
                </div>
                <span className="footer-cred-meta">DataCamp Statement of Accomplishment · #736,739</span>
              </a>
            </div>
          </div>

          {/* Column 4: Connect & Direct Resources */}
          <div className="footer-col col-connect">
            <h4 className="footer-col-title">
              <i className="fa-solid fa-link" style={{ marginRight: '8px', color: 'var(--cyan)' }} />
              {translateText("Connect & Resources")}
            </h4>
            <div className="footer-connect-list">
              <a
                href="assets/Abdellah_BELMAARIS_CV.pdf"
                download="Abdellah_BELMAARIS_CV.pdf"
                className="footer-connect-link highlight-cv"
                title={translateText("Download Abdellah BELMAARIS CV (PDF)")}
              >
                <i className="fa-solid fa-file-arrow-down" />
                <span>{translateText("Download Curriculum Vitae (PDF)")}</span>
                <span className="footer-connect-arrow">↓</span>
              </a>

              <a
                href="cv.html"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-connect-link highlight-cv"
                title={translateText("View Abdellah BELMAARIS Interactive CV")}
              >
                <i className="fa-solid fa-file-lines" style={{ color: '#10b981' }} />
                <span>{translateText("View CV (Online)")}</span>
                <span className="footer-connect-arrow">↗</span>
              </a>

              <a
                href="https://github.com/Abdellah-BELMAARIS"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-connect-link"
              >
                <i className="fa-brands fa-github" />
                <span>GitHub · Abdellah-BELMAARIS</span>
                <span className="footer-connect-arrow">↗</span>
              </a>

              <a
                href="https://linkedin.com/in/abdellah-belmaaris"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-connect-link"
              >
                <i className="fa-brands fa-linkedin-in" />
                <span>LinkedIn Profile</span>
                <span className="footer-connect-arrow">↗</span>
              </a>

              <a
                href="mailto:obaidbelmaaris@gmail.com"
                className="footer-connect-link"
              >
                <i className="fa-regular fa-envelope" />
                <span>obaidbelmaaris@gmail.com</span>
                <span className="footer-connect-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── Bottom HUD Telemetry Strip ───────────────────────────── */}
        <div className="footer-telemetry-bottom-strip">
          <div className="footer-strip-left">
            <span>© 2026 Abdellah BELMAARIS. All rights reserved.</span>
          </div>

          <div className="footer-strip-center">
            <span className="footer-strip-pill">
              <span className="footer-strip-dot" />
              <span>{translateText("100% Client-Side Bundle · React 19 · Vite · TypeScript · Static PWA")}</span>
            </span>
          </div>

          <div className="footer-strip-right">
            {onScrollToTop && (
              <button
                type="button"
                className="footer-scroll-top-btn"
                onClick={onScrollToTop}
                title={translateText("Scroll to Top ↑")}
                id="footer-scroll-to-top-btn"
              >
                <span>{translateText("Scroll to Top ↑")}</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
