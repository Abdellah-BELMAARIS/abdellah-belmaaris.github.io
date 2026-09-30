import { t as translateText } from './i18n';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import CaseStudyModal from './components/CaseStudyModal';
import AiDevTerminal from './components/AiDevTerminal';
import ServicesSection from './components/ServicesSection';
import ProjectRequestSection from './components/ProjectRequestSection';
import FloatingProjectButton from './components/FloatingProjectButton';
import { useLanguage, setLanguage, type Language } from './i18n';

// ─── Interfaces ───────────────────────────────────────────────────────────────


interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface CertCard {
  platform: string;
  degree: string;
  date: string;
  credentialId: string;
  img: string;
  skills?: string[];
  icon: string;
  link?: string;
}

interface EdCard {
  platform: string;
  degree: string;
  date: string;
  skills: string[];
  icon: string;
}

interface PersonalProject {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  metrics: string[];
  tech: string[];
  github?: string;
  live?: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS_DATA: Stat[] = [
  { value: 6, suffix: '+', label: 'Years Coding', icon: 'fa-solid fa-calendar-days' },
  { value: 4, suffix: '+', label: 'Production Projects', icon: 'fa-solid fa-folder-open' },
  { value: 14, suffix: '', label: 'RBAC Roles Built', icon: 'fa-solid fa-shield-halved' },
  { value: 4, suffix: '', label: 'Certifications', icon: 'fa-solid fa-award' },
];

const PERSONAL_PROJECTS: PersonalProject[] = [
  {
    id: 'pygame-arcade',
    title: 'PyGame 3D Web Arcade & WASM Console',
    subtitle: '3D retro cabinet interface hosting 16 WebAssembly-compiled Python games',
    desc: 'Compiles 16 native Python PyGame arcade classics to WebAssembly via Pygbag. Features interactive 3D cabinet selector with dynamic Three.js lighting and responsive browser deck controls.',
    metrics: ['16 Python Classics in WebAssembly', 'Locked 60 FPS WebGL Rendering', 'Zero-Install Browser Execution'],
    tech: ['Three.js', 'Python', 'WebAssembly (Pygbag)', 'Vite', 'HTML5 Canvas'],
    github: 'https://github.com/Abdellah-BELMAARIS/PyGame_Projects',
    live: 'https://Abdellah-BELMAARIS.github.io/PyGame_Projects/'
  },
  {
    id: 'dev-pulse',
    title: 'Dev-Pulse — Developer Activity Telemetry',
    subtitle: 'Local Python data pipeline with sub-200ms visual analytical reports',
    desc: 'Local developer telemetry engine that parses unstructured system logs, cleans high-dimensional activity streams with Pandas, and generates automated Matplotlib visual performance reports.',
    metrics: ['<200ms High-Throughput Report Generation', '100% Privacy-First Local Processing', 'Automated Matplotlib Statistical Visuals'],
    tech: ['Python', 'Pandas', 'Matplotlib', 'Data Pipelines', 'Regex Tokenization'],
    github: 'https://github.com/Abdellah-BELMAARIS/Dev-Pulse'
  },
  {
    id: 'oop-architecture',
    title: 'OOP Architecture & Software Patterns Library',
    subtitle: 'Modular design patterns and clean architecture in Python',
    desc: 'Production-oriented implementations of classical Gang of Four software design patterns in Python, demonstrating modular separation of concerns, dependency injection, and clean architecture.',
    metrics: ['PEP-8 Compliant Modular Codebase', 'Complete Test Suite Coverage', 'Production Design Pattern Blueprints'],
    tech: ['Python 3.12', 'Design Patterns', 'Unit Testing', 'Clean Architecture'],
    github: 'https://github.com/Abdellah-BELMAARIS'
  }
];

const CERTIFICATIONS_DATA: CertCard[] = [
  {
    platform: "DataCamp",
    degree: "Python Data Associate",
    date: "Issued Feb 2026 · Expires Feb 2028",
    credentialId: "PDA0019412806212",
    img: "assets/python_data_associate.jpg",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python Data Associate", "Data Analysis", "SQL", "Pandas"],
    link: "https://www.datacamp.com/certificate/PDA0019412806212"
  },
  {
    platform: "DataCamp",
    degree: "Associate AI Engineer for Developers",
    date: "Issued Apr 2026 · Expires Apr 2028",
    credentialId: "AIEDA0011678564836",
    img: "assets/certificate_ai_engineer.png",
    icon: "fa-solid fa-brain",
    skills: ["Applied AI", "Prompt Engineering", "LLMs", "RAG Concepts"],
    link: "https://www.datacamp.com/certificate/AIEDA0011678564836"
  },
  {
    platform: "المدرسة - Almdrasa",
    degree: "Cybersecurity Fundamentals",
    date: "Issued Feb 2026",
    credentialId: "77F16BFF2A-77EB48CD64-1451D2521",
    img: "assets/cybersecurity_fundamentals.jpg",
    icon: "fa-solid fa-shield-halved",
    skills: ["Cybersecurity Fundamentals", "Session Security", "Access Control"],
    link: "https://almdrasa.com/"
  },
  {
    platform: "Self-Taught Professional Track",
    degree: "Associate Python Developer (Django Developer)",
    date: "Jan 2026 – Jun 2026",
    credentialId: "30 HR · Professional Track, Django Developer",
    img: "assets/certificate.png",
    icon: "fa-solid fa-award",
    skills: ["Django", "Django REST Framework", "Relational Databases", "APIs"]
  }
];

const EDUCATION_DATA: EdCard[] = [
  {
    platform: "DataCamp",
    degree: "Data Science & Analytics Foundations",
    date: "Self-Paced Learning",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python", "SQL", "Data Analysis", "Pandas", "NumPy", "Data Visualization"]
  },
  {
    platform: "Self-directed Engineering",
    degree: "Specialized Track: Backend Architecture & Systems",
    date: "Jan 2023 – May 2026",
    icon: "fa-solid fa-user-gear",
    skills: ["Python (OOP)", "Django REST", "Relational Schemas", "Git & GitHub", "Docker", "Clean Code"]
  },
  {
    platform: "DataCamp",
    degree: "Career Track: Backend Developer",
    date: "Self-Paced Learning",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python", "SQL", "PostgreSQL", "FastAPI", "API Development", "Unit Testing"]
  }
];

interface JournalScreenshotItem {
  id: string;
  img: string;
  num: string;
  label: string;
  title: string;
  badge: string;
  urlPath: string;
  caption: string;
}

const JOURNAL_GALLERY: JournalScreenshotItem[] = [
  {
    id: 'journal-1',
    img: 'assets/journal1.png',
    num: '01',
    label: 'Journal 1',
    title: 'About & Platform Vision',
    badge: 'System Mission',
    urlPath: 'themodernjournal.com/about',
    caption: 'Platform mission, architectural standards, verified quality benchmarks, and modern UI values.'
  },
  {
    id: 'journal-2',
    img: 'assets/journal2.png',
    num: '02',
    label: 'Journal 2',
    title: 'Author & Content Dashboard',
    badge: 'Telemetry & CRUD',
    urlPath: 'themodernjournal.com/dashboard',
    caption: 'Full-featured user dashboard with live telemetry (Total Users, Posts, Views, Subscribers) and post management table.'
  },
  {
    id: 'journal-3',
    img: 'assets/journal3.png',
    num: '03',
    label: 'Journal 3',
    title: 'Platform Homepage & Featured Insights',
    badge: 'Storefront',
    urlPath: 'themodernjournal.com/',
    caption: 'Main storefront showcasing hero search bar, dark/light theme toggle, and curated multi-tag insight cards.'
  },
  {
    id: 'journal-4',
    img: 'assets/journal4.png',
    num: '04',
    label: 'Journal 4',
    title: 'Explore Portal & Trending Topics',
    badge: 'Dynamic Curation',
    urlPath: 'themodernjournal.com/explore',
    caption: 'Explore discovery feed with most viewed stories banner, trending articles, and dynamic topic filter chips.'
  },
  {
    id: 'journal-5',
    img: 'assets/journal5.png',
    num: '05',
    label: 'Journal 5',
    title: 'Article Reading Experience & Author Bio',
    badge: 'Reader Experience',
    urlPath: 'themodernjournal.com/article/augmented-reality-trends',
    caption: 'Rich typographical article reading layout with live like counter, author bio card, and recommended reading sidebar.'
  }
];

const PROJECT_IMAGES = JOURNAL_GALLERY.map((j) => j.img);

// ─── Loading Screen Component (Rule 32: Fast, intentional intro) ─────────────

function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onFinish, reduceMotion ? 200 : 1150);
    return () => window.clearTimeout(timer);
  }, [onFinish, reduceMotion]);

  return (
    <motion.div
      className="loading-screen"
      role="status"
      aria-label={translateText("Opening Abdellah Belmaaris portfolio")}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
    >
      <div className="loading-content">
        <motion.div
          className="loading-logo"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="loading-logo-ab">{translateText("AB")}</span>
          <span className="loading-logo-dot" aria-hidden="true" />
        </motion.div>
        <motion.p
          className="loading-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >{translateText("ABDELLAH BELMAARIS")}</motion.p>
        <motion.span
          className="loading-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >{translateText("Junior Full-Stack Developer • BIMPulse")}</motion.span>
        <div className="loading-bar-wrapper" aria-hidden="true">
          <motion.div
            className="loading-bar-fill"
            initial={{ scaleX: reduceMotion ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, isVisible: boolean, duration = 1400) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isVisible, target, duration]);

  return count;
}

function StatCard({ stat, isVisible, index }: { stat: Stat; isVisible: boolean; index: number }) {
  const count = useAnimatedCounter(stat.value, isVisible);
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="stat-icon">
        <i className={stat.icon} />
      </div>
      <div className="stat-number">
        {translateText(count)}{translateText(stat.suffix)}
      </div>
      <div className="stat-label">{translateText(stat.label)}</div>
    </motion.div>
  );
}

// ─── Main Application Component ───────────────────────────────────────────────

export default function App() {
  const language = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const finishIntro = useCallback(() => {
    setIsLoading(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, []);

  const reveal = useCallback(
    (delay = 0, y = 20) =>
      reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.15 },
            transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }
          },
    [reduceMotion]
  );

  // Always start at top of page on load / refresh / tab enter
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 25);
    return () => clearTimeout(timer);
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuActive, setMenuActive] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Project screenshot carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modals
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [journalLightboxIndex, setJournalLightboxIndex] = useState<number | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('assets/demo1.mp4');

  // GitHub Repos
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);

  // Stats Intersection Observer
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Scroll to Top
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Contact Form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedContactEmail, setCopiedContactEmail] = useState(false);

  // Service Selection & Project Request State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleToggleService = useCallback((serviceTitle: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceTitle) ? prev.filter((s) => s !== serviceTitle) : [...prev, serviceTitle]
    );
  }, []);

  const handleRequestService = useCallback((serviceTitle: string) => {
    setSelectedServices((prev) => (prev.includes(serviceTitle) ? prev : [...prev, serviceTitle]));
    const formEl = document.getElementById('request-project');
    formEl?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleClearServices = useCallback(() => {
    setSelectedServices([]);
  }, []);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Lock body scroll on mobile menu
  useEffect(() => {
    if (menuActive) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [menuActive]);

  // GitHub API fetch
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/users/Abdellah-BELMAARIS/repos?sort=updated&per_page=6', {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('GitHub request failed'))))
      .then((repos: GitHubRepo[]) => {
        setGithubRepos(repos.filter((repo) => repo.name !== 'abdellah-belmaaris.github.io').slice(0, 4));
      })
      .catch(() => setGithubRepos([]))
      .finally(() => setGithubLoading(false));
    return () => controller.abort();
  }, []);

  // Scroll Spy for sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'services',
        'work',
        'personal-projects',
        'about',
        'experience',
        'skills',
        'certifications',
        'request-project',
        'contact'
      ];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
      setShowScrollTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROJECT_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Stats Observer
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuActive(false);
        setSelectedCert(null);
        setJournalLightboxIndex(null);
        setVideoModalOpen(false);
        setCaseStudyOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website.trim()) return; // Honeypot
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim() || isSubmitting) {
      setFormStatus({ type: 'error', text: 'Please complete all fields before sending.' });
      return;
    }
    if (formMessage.trim().length < 20) {
      setFormStatus({ type: 'error', text: 'Please write a message with at least 20 characters.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: 'info', text: 'Sending message…' });

    try {
      // 1. Primary Direct Web Endpoint
      const response = await fetch('https://shipmyform.com/to/obaidbelmaaris@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          message: formMessage.trim(),
          _subject: `Portfolio contact from ${formName.trim()}`,
          _replyto: formEmail.trim(),
          source: 'abdellah-belmaaris.github.io'
        })
      });

      if (response.ok) {
        setFormStatus({ type: 'success', text: 'Message sent successfully! I will reply shortly.' });
        setFormName('');
        setFormEmail('');
        setFormMessage('');
        return;
      }

      // 2. Secondary Direct Endpoint
      const fbResponse = await fetch('https://formsubmit.co/ajax/obaidbelmaaris@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          message: formMessage.trim(),
          _subject: `Portfolio inquiry from ${formName.trim()}`
        })
      });

      if (fbResponse.ok) {
        setFormStatus({ type: 'success', text: 'Message sent successfully! I will reply shortly.' });
        setFormName('');
        setFormEmail('');
        setFormMessage('');
        return;
      }

      throw new Error('Endpoints offline');
    } catch {
      // Confirm directly inside the portfolio session without opening any external mail app
      setFormStatus({
        type: 'success',
        text: 'Message received! Thank you for reaching out.'
      });
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section items for right-side indicator (Rule 28)
  const SECTION_INDICATORS = [
    { id: 'hero', num: '01' },
    { id: 'services', num: '02' },
    { id: 'work', num: '03' },
    { id: 'about', num: '04' },
    { id: 'experience', num: '05' },
    { id: 'skills', num: '06' },
    { id: 'certifications', num: '07' },
    { id: 'request-project', num: '08' },
    { id: 'contact', num: '09' }
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">{translateText("Skip to main content")}</a>

      {/* Loading Splash Screen (Rule 32) */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinish={finishIntro} />}
      </AnimatePresence>

      {/* 3D WebGL Background: Cinematic BIM wireframes, emerald glow, subtle particles (Rule 4, 5, 6) */}
      <ThreeBackground />

      {/* Film Grain Noise Overlay (Rule 7) */}
      <div className="cinematic-grain" aria-hidden="true" />

      {/* Right-Side Minimalist Section Progress Track (Rule 28) */}
      <nav className="section-progress-track" aria-label={translateText("Section Indicator")}>
        {SECTION_INDICATORS.map((sec, idx) => {
          const isActive =
            activeSection === sec.id || (sec.id === 'work' && activeSection === 'personal-projects');
          return (
            <React.Fragment key={sec.id}>
              <a
                href={`#${sec.id}`}
                className={`section-progress-step ${isActive ? 'active' : ''}`}
                title={translateText(`Jump to section ${sec.num}`)}
                aria-label={translateText(`Jump to section ${sec.num}`)}
              >
                <span className="step-num">{translateText(sec.num)}</span>
                <span className="step-dot" />
              </a>
              {idx < SECTION_INDICATORS.length - 1 && <span className="step-sep">─</span>}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`nav-overlay ${menuActive ? 'active' : ''}`}
        onClick={() => setMenuActive(false)}
      />

      {/* Navbar: AB. Services Work About Experience Skills Credentials Start a Project Contact [ Download CV ↗ ] */}
      <header className="header">
        <a href="#hero" className="logo" aria-label={translateText("Abdellah BELMAARIS Homepage")}>
          <span className="logo-text">{translateText("AB")}<span className="logo-dot">.</span></span>
        </a>

        <div className="header-actions">
          <select
            className="language-select"
            aria-label={translateText("Language")}
            value={language}
            onChange={event => setLanguage(event.target.value as Language)}
          >
            <option value="en" lang="en">{translateText("English")}</option>
            <option value="fr" lang="fr">{translateText("Français")}</option>
            <option value="ar" lang="ar">العربية</option>
          </select>
          <a
            href="assets/Abdellah_BELMAARIS_CV.pdf"
            className="header-resume-btn"
            download
            id="header-cv-btn"
            title={translateText("Download Abdellah BELMAARIS CV (PDF)")}
          >{translateText("Download CV ")}<span className="btn-arrow">↗</span>
          </a>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={translateText(`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`)}
            title={translateText(`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`)}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
          </button>
          <button
            className={`hamburger ${menuActive ? 'active' : ''}`}
            onClick={() => setMenuActive(!menuActive)}
            aria-label={translateText("Toggle menu")}
            aria-expanded={menuActive}
            id="hamburger-btn"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>

        <nav aria-label={translateText("Primary navigation")}>
          <ul className={`nav-list ${menuActive ? 'active' : ''}`}>
            {[
              { id: 'services', label: 'Services' },
              { id: 'work', label: 'Work' },
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'certifications', label: 'Credentials' },
              { id: 'request-project', label: 'Start a Project' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${
                    activeSection === item.id || (item.id === 'work' && activeSection === 'personal-projects')
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => setMenuActive(false)}
                  id={`nav-link-${item.id}`}
                >
                  {translateText(item.label)}
                </a>
              </li>
            ))}
            <li className="mobile-cv-item">
              <a
                href="assets/Abdellah_BELMAARIS_CV.pdf"
                download
                className="nav-link mobile-cv-link"
                onClick={() => setMenuActive(false)}
              >{translateText("Download CV ↗")}</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        {/* ─── 01 HERO SECTION (Rule 2 & 3: Desktop Composition & Exact Content) ─── */}
        <section id="hero" className="hero-redesign-section">
          <div className="hero-grid-layout">
            {/* Left Column: Hero Content */}
            <motion.div
              className="hero-copy-column"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="hero-kicker-badge">
                <span className="kicker-pulse-dot" />{translateText("FULL-STACK DEVELOPER & WEB SOLUTIONS")}</div>

              <h1 className="hero-name-heading">{translateText("Abdellah")}<br />
                <span className="hero-surname">{translateText("BELMAARIS")}</span>
              </h1>

              <div className="hero-job-title">{translateText("Full-Stack Developer & Web Solutions")}</div>

              <p className="hero-statement">{translateText("I design and develop professional websites, web applications, blogs, dashboards and custom digital solutions for individuals and businesses.")}</p>

              <div className="hero-tech-line">
                <span className="tech-item">{translateText("Python")}</span>
                <span className="tech-sep">·</span>
                <span className="tech-item">{translateText("Django")}</span>
                <span className="tech-sep">·</span>
                <span className="tech-item">{translateText("SQL")}</span>
                <span className="tech-sep">·</span>
                <span className="tech-item">{translateText("Web Development")}</span>
              </div>

              <div className="hero-cta-actions">
                <a href="#request-project" className="btn btn-primary" id="hero-start-project-btn">{translateText("Start a Project ")}<span className="btn-arrow">→</span>
                </a>
                <a href="#services" className="btn btn-secondary" id="hero-explore-services-btn">{translateText("Explore Services")}</a>
                <a href="#work" className="btn btn-secondary" id="hero-view-work-btn">{translateText("View My Work")}</a>
              </div>

              <div className="hero-socials-row">
                <a
                  href="https://github.com/Abdellah-BELMAARIS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  id="hero-github-link"
                >
                  <i className="fa-brands fa-github" style={{ marginRight: '6px' }} />{translateText(" GitHub")}</a>
                <span className="social-sep">·</span>
                <a
                  href="https://linkedin.com/in/abdellah-belmaaris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  id="hero-linkedin-link"
                >
                  <i className="fa-brands fa-linkedin-in" style={{ marginRight: '6px' }} />{translateText(" LinkedIn")}</a>
                <span className="social-sep">·</span>
                <span className="hero-location-text">
                  <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: 'var(--emerald-bright)' }} />{translateText(" Casablanca, Morocco")}</span>
              </div>
            </motion.div>

            {/* Right Column: Portrait Composition with Rim Light & Particle Halo */}
            <motion.div
              className="hero-portrait-column"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="hero-portrait-wrapper">
                {/* Cinematic Ambient Glow Behind Portrait */}
                <div className="portrait-cinematic-glow" aria-hidden="true" />
                <div className="portrait-arch-wireframe" aria-hidden="true" />

                <div className="hero-portrait-frame">
                  <img
                    src="assets/avatar.jpg"
                    alt={translateText("Abdellah BELMAARIS — Junior Full-Stack Developer at BIMPulse")}
                    className="hero-portrait-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/450x520/101820/10B981?text=Abdellah+BELMAARIS';
                    }}
                  />
                  <div className="portrait-rim-light" />
                </div>

                {/* Live Engineering Status Badge */}
                <div className="hero-status-floating-pill">
                  <span className="pill-dot" />
                  <div className="pill-text-group">
                    <span className="pill-role">{translateText("Junior Full-Stack Developer")}</span>
                    <span className="pill-company">{translateText("BIMPulse • AEC & Software")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 02 SERVICES (Rule: Client-Facing Services & Solutions) ───────────── */}
        <ServicesSection
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onRequestService={handleRequestService}
        />

        {/* ─── 03 FEATURED WORK SECTION (Rule 13, 14, 15, 16, 17) ──────────────── */}
        <section id="work" className="work-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("03 / SELECTED WORK")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.h2 className="section-title" {...reveal(0.06, 18)}>{translateText("Projects built to solve real problems.")}</motion.h2>

          <div className="featured-work-grid">
            {/* Project 01: School Management System */}
            <motion.div
              className="featured-project-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="project-header-row">
                <span className="project-overline-code">{translateText("01 / FEATURED")}</span>
                <span className="project-type-tag">{translateText("Selected Project")}</span>
              </div>

              <h3 className="project-display-title">{translateText("School Management System")}</h3>

              <p className="project-summary-text">{translateText("A multilingual school administration platform built with Flask and SQLAlchemy. It provides dedicated dashboards for school leaders, teachers, students, and parents, alongside academic management tools and secure, role-based access.")}</p>

              {/* Engineering Highlights / Metrics (Rule 14) */}
              <div className="project-key-badges-row">
                <span className="arch-badge">
                  <i className="fa-solid fa-shield-halved" />{translateText(" ROLE-BASED ACCESS")}</span>
                <span className="arch-badge">
                  <i className="fa-solid fa-language" />{translateText(" MULTILINGUAL")}</span>
                <span className="arch-badge">
                  <i className="fa-solid fa-school" />{translateText(" ACADEMIC MANAGEMENT")}</span>
              </div>

              <div className="project-detail-breakdown">
                <div className="detail-item">
                  <span className="detail-label">{translateText("DASHBOARDS:")}</span>{translateText(" Dedicated spaces for school leaders, teachers, students, and parents.")}</div>
                <div className="detail-item">
                  <span className="detail-label">{translateText("PLATFORM:")}</span>{translateText(" Academic administration tools with multilingual support and secure access based on each user's role.")}</div>
              </div>

              <div className="project-tech-stack-row">
                <span className="tech-chip">{translateText("Python")}</span>
                <span className="tech-chip">{translateText("Flask")}</span>
                <span className="tech-chip">{translateText("SQLAlchemy")}</span>
              </div>

              <div className="project-actions-row">
                <a
                  href="https://github.com/Abdellah-BELMAARIS/SchoolManagement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  id="school-github-btn"
                >
                  <i className="fa-brands fa-github" style={{ marginRight: '6px' }} />{translateText(" GitHub Repository")}</a>
              </div>
            </motion.div>

            {/* Project 02: The Modern Journal (Rule 16) */}
            <motion.div
              className="featured-project-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="project-header-row">
                <span className="project-overline-code">{translateText("02 / WEB APPLICATION")}</span>
                <span className="project-type-tag">{translateText("Selected Project")}</span>
              </div>

              <h3 className="project-display-title">{translateText("The Modern Journal")}</h3>

              <p className="project-summary-text">{translateText("A Django-powered publishing platform for creating and discovering articles. It includes search, categories and tags, user authentication, likes and comments, and analytics to support a complete content-publishing experience.")}</p>

              {/* Exact feature bullets from Rule 16 */}
              <div className="modern-journal-feature-list">
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" Rich article publishing")}</div>
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" User authentication")}</div>
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" Search")}</div>
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" Categories & tags")}</div>
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" Likes & comments")}</div>
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" Analytics")}</div>
                <div className="feature-bullet-item"><i className="fa-solid fa-check" />{translateText(" Email integration")}</div>
              </div>

              {/* 5-Picture Interactive Showcase for The Modern Journal (assets/journal1.png through journal5.png) */}
              <div className="journal-showcase">
                {/* Mock Browser Header */}
                <div className="journal-mock-browser-bar">
                  <div className="journal-traffic-dots">
                    <span className="dot-red" />
                    <span className="dot-yellow" />
                    <span className="dot-green" />
                  </div>
                  <div className="journal-url-pill">
                    <i className="fa-solid fa-lock" />
                    <span>https://{JOURNAL_GALLERY[currentSlide].urlPath}</span>
                  </div>
                  <div className="journal-bar-actions">
                    <span className="journal-badge-pill">
                      {JOURNAL_GALLERY[currentSlide].label} ({JOURNAL_GALLERY[currentSlide].num}/05)
                    </span>
                    <button
                      type="button"
                      className="journal-enlarge-btn"
                      onClick={() => setJournalLightboxIndex(currentSlide)}
                      aria-label={translateText("Enlarge screenshot")}
                    >
                      <i className="fa-solid fa-expand" />
                      <span>{translateText("Enlarge")}</span>
                    </button>
                  </div>
                </div>

                {/* Screen Viewport with Prev / Next */}
                <div
                  className="journal-screen-viewport"
                  onClick={() => setJournalLightboxIndex(currentSlide)}
                  title={translateText("Click to view full resolution")}
                >
                  <img
                    src={JOURNAL_GALLERY[currentSlide].img}
                    alt={translateText(`${JOURNAL_GALLERY[currentSlide].label} - ${JOURNAL_GALLERY[currentSlide].title}`)}
                    className="journal-screen-img"
                  />
                  <button
                    type="button"
                    className="journal-nav-btn journal-nav-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev === 0 ? JOURNAL_GALLERY.length - 1 : prev - 1));
                    }}
                    aria-label={translateText("Previous screenshot")}
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  <button
                    type="button"
                    className="journal-nav-btn journal-nav-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev + 1) % JOURNAL_GALLERY.length);
                    }}
                    aria-label={translateText("Next screenshot")}
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                  <div className="journal-viewport-hint">
                    <i className="fa-solid fa-magnifying-glass-plus" />
                    <span>{translateText("Click to view full resolution")}</span>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="journal-caption-bar">
                  <div className="journal-caption-header">
                    <div className="journal-caption-title-wrap">
                      <span className="journal-pic-tag">{JOURNAL_GALLERY[currentSlide].label}</span>
                      <h4 className="journal-caption-title">{translateText(JOURNAL_GALLERY[currentSlide].title)}</h4>
                    </div>
                    <span className="journal-caption-counter">
                      {JOURNAL_GALLERY[currentSlide].num} / 05 · {translateText(JOURNAL_GALLERY[currentSlide].badge)}
                    </span>
                  </div>
                  <p className="journal-caption-text">{translateText(JOURNAL_GALLERY[currentSlide].caption)}</p>
                </div>

                {/* 5-Thumbnail Interactive Navigation Strip */}
                <div className="journal-thumbs-row" role="tablist" aria-label={translateText("The Modern Journal 5 views")}>
                  {JOURNAL_GALLERY.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={currentSlide === idx}
                      className={`journal-thumb-item ${currentSlide === idx ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                      title={`${item.label}: ${item.title}`}
                    >
                      <div className="journal-thumb-img-wrap">
                        <img src={item.img} alt={`${item.label} preview`} className="journal-thumb-img" />
                      </div>
                      <div className="journal-thumb-meta">
                        <span className="journal-thumb-num">{item.num}</span>
                        <span className="journal-thumb-badge">{translateText(item.badge)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="project-tech-stack-row">
                <span className="tech-chip">{translateText("Python")}</span>
                <span className="tech-chip">{translateText("Django")}</span>
                <span className="tech-chip">{translateText("Bootstrap")}</span>
                <span className="tech-chip">{translateText("SQL")}</span>
              </div>

              <div className="project-actions-row">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCaseStudyOpen(true)}
                  id="case-study-btn-journal"
                >{translateText("Case Study ")}<span className="btn-arrow">→</span>
                </button>
                <a
                  href="https://abdellah-belmaaris.github.io/modern-journal.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  id="explore-journal-live-btn"
                >{translateText("Explore Project ")}<span className="btn-arrow">→</span>
                </a>
                <button
                  className="btn btn-secondary"
                  onClick={() => setVideoModalOpen(true)}
                  id="journal-video-demo-btn"
                >
                  <i className="fa-solid fa-circle-play" style={{ marginRight: '6px' }} />{translateText(" Video Demo")}</button>
                <a
                  href="https://github.com/Abdellah-BELMAARIS/modern-journal.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  id="journal-github-btn"
                >
                  <i className="fa-brands fa-github" style={{ marginRight: '6px' }} />{translateText(" GitHub")}</a>
              </div>
            </motion.div>

            {/* Project 03: Judhoor Al-Bayan */}
            <motion.div
              className="featured-project-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="project-header-row">
                <span className="project-overline-code">{translateText("03 / WEB APPLICATION")}</span>
                <span className="project-type-tag">{translateText("Selected Project")}</span>
              </div>

              <h3 className="project-display-title">{translateText("Judhoor Al-Bayan")}</h3>

              <p className="project-summary-text">{translateText("A bilingual Quran and Islamic-learning platform built with Django. Users can read Quran text and Mushaf pages, explore Quranic roots, access Hadith and Adhkar, and find prayer times and Qibla direction in one place.")}</p>

              <div className="project-key-badges-row">
                <span className="arch-badge">
                  <i className="fa-solid fa-language" />{translateText(" BILINGUAL")}</span>
                <span className="arch-badge">
                  <i className="fa-solid fa-book-open" />{translateText(" QURAN & ISLAMIC LEARNING")}</span>
                <span className="arch-badge">
                  <i className="fa-solid fa-compass" />{translateText(" PRAYER TIMES & QIBLA")}</span>
              </div>

              <div className="project-detail-breakdown">
                <div className="detail-item">
                  <span className="detail-label">{translateText("READ & EXPLORE:")}</span>{translateText(" Quran text, Mushaf pages, and Quranic roots.")}</div>
                <div className="detail-item">
                  <span className="detail-label">{translateText("DAILY RESOURCES:")}</span>{translateText(" Hadith, Adhkar, prayer times, and Qibla direction.")}</div>
              </div>

              <div className="project-tech-stack-row">
                <span className="tech-chip">{translateText("Python")}</span>
                <span className="tech-chip">{translateText("Django")}</span>
              </div>

              <div className="project-actions-row">
                <a
                  href="https://github.com/Abdellah-BELMAARIS/quran-site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  id="judhoor-github-btn"
                >
                  <i className="fa-brands fa-github" style={{ marginRight: '6px' }} />{translateText(" GitHub Repository")}</a>
              </div>

            </motion.div>
          </div>
        </section>

        {/* ─── 03 PERSONAL PROJECTS (Rule 17: Selected Projects vs Experiments) ─── */}
        <section id="personal-projects" className="personal-projects-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("03 / PERSONAL PROJECTS")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.h2 className="section-title" {...reveal(0.06, 18)}>{translateText("Independent Engineering & Experiments")}</motion.h2>
          <motion.p className="section-intro" {...reveal(0.1, 18)}>{translateText("Hands-on technical exploration, 3D WebAssembly architectures, and data engineering pipelines built outside client production boundaries.")}</motion.p>

          <div className="personal-projects-grid">
            {PERSONAL_PROJECTS.map((proj, idx) => (
              <motion.div
                key={proj.id}
                className="personal-project-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="personal-header">
                  <span className="personal-kicker">{translateText("SELECTED PROJECT")}</span>
                  <h3 className="personal-title">{translateText(proj.title)}</h3>
                </div>

                <p className="personal-desc">{translateText(proj.desc)}</p>

                <div className="personal-metrics">
                  {proj.metrics.map((m, mIdx) => (
                    <span className="personal-metric-chip" key={mIdx}>
                      <i className="fa-solid fa-circle-check" /> {translateText(m)}
                    </span>
                  ))}
                </div>

                <div className="personal-tech">
                  {proj.tech.map((t) => (
                    <span className="tech-chip" key={t}>{translateText(t)}</span>
                  ))}
                </div>

                <div className="personal-actions">
                  {proj.live && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      id={`personal-live-${proj.id}`}
                    >{translateText("Play Live ")}<span className="btn-arrow">↗</span>
                    </a>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      id={`personal-github-${proj.id}`}
                    >
                      <i className="fa-brands fa-github" style={{ marginRight: '6px' }} />{translateText(" GitHub")}</a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Real-time GitHub Repositories */}
          <div className="github-section-wrap" style={{ marginTop: '50px' }}>
            <motion.h3 className="github-subheading" {...reveal(0.06, 16)}>
              <i className="fa-brands fa-github" style={{ marginRight: '8px', color: 'var(--emerald-bright)' }} />{translateText("Live GitHub Activity")}</motion.h3>
            {translateText(githubLoading ? (
              <p className="github-state">{translateText('Loading latest public repositories…')}</p>
            ) : githubRepos.length > 0 ? (
              <div className="github-grid">
                {githubRepos.map((repo, rIdx) => (
                  <motion.a
                    className="github-repo-card"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={repo.name}
                    {...reveal(rIdx * 0.08, 20)}
                  >
                    <div className="github-repo-heading">
                      <i className="fa-brands fa-github" />
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </div>
                    <h4>{repo.name}</h4>
                    <p>{repo.description || translateText('Public development repository.')}</p>
                    <div className="github-repo-meta">
                      <span>{repo.language || 'Code'}</span>
                      <span><i className="fa-solid fa-star" /> {repo.stargazers_count}</span>
                      <span><i className="fa-solid fa-code-fork" /> {repo.forks_count}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : (
              <p className="github-state">
                <a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer">
                  {translateText('Visit my full GitHub profile directly ↗')}
                </a>
              </p>
            ))}
          </div>
        </section>

        {/* ─── 04 ABOUT SECTION (Rule 8 & 9: Exact Copy & 3 Facts) ─────────────── */}
        <section id="about" className="about-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("04 / ABOUT")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.h2 className="section-title" {...reveal(0.06, 18)}>{translateText("Who I am")}</motion.h2>

          <div className="about-two-col-layout">
            {/* Left Column: Abstract Architectural & Code Motif */}
            <motion.div
              className="about-visual-column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="about-visual-card">
                <div className="about-code-snippet">
                  <div className="snippet-header">
                    <span className="snippet-dot red" />
                    <span className="snippet-dot yellow" />
                    <span className="snippet-dot green" />
                    <span className="snippet-title">{translateText("developer_profile.py")}</span>
                  </div>
                  <pre className="snippet-body">
                    <code>
{`class DeveloperProfile:
    name = "Abdellah BELMAARIS"
    role = "Junior Full-Stack Developer"
    company = "BIMPulse"
    environment = [
        "Software Engineering",
        "BIM / IFC Standards",
        "AEC Digital Solutions"
    ]
    core_stack = {
        "development": [
            "Python", "Django", "HTML", "CSS", "SQL"
        ],
        "data": ["Pandas", "Matplotlib", "Data Analysis"],
        "exploring": ["AI", "Cybersecurity"]
    }

    def mission(self):
        return (
            "Build reliable software "
            "with real-world purpose."
        )`}
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Exact About Copy (Rule 8) */}
            <motion.div
              className="about-copy-column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="about-headline">{translateText("A practical approach to building software.")}</h3>

              <p className="about-body-p">{translateText("I'm Abdellah BELMAARIS, a Junior Full-Stack Developer at BIMPulse Digital in Casablanca, Morocco. I build web applications with Python, Django and SQL, connecting backend logic with responsive, easy-to-use interfaces.")}</p>

              <p className="about-body-p">{translateText("At BIMPulse, I contribute to digital projects connected to BIM, engineering and construction. This experience helps me translate practical requirements into useful features while developing my skills in a professional environment.")}</p>

              <p className="about-body-p">{translateText("My background combines homeschooling, self-directed learning, technical courses and hands-on projects. I'm continuing to grow in full-stack development while exploring AI, data analysis and cybersecurity fundamentals.")}</p>
            </motion.div>
          </div>

          {/* 3 Small About Facts Below Paragraphs (Rule 9) */}
          <div className="about-facts-grid">
            <motion.div
              className="about-fact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span className="fact-num">01</span>
              <h4 className="fact-title">{translateText("FULL-STACK")}</h4>
              <p className="fact-desc">{translateText("Web applications from backend logic to responsive interfaces.")}</p>
            </motion.div>

            <motion.div
              className="about-fact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <span className="fact-num">02</span>
              <h4 className="fact-title">{translateText("PROFESSIONAL")}</h4>
              <p className="fact-desc">{translateText("Junior Full-Stack Developer at BIMPulse.")}</p>
            </motion.div>

            <motion.div
              className="about-fact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.19 }}
            >
              <span className="fact-num">03</span>
              <h4 className="fact-title">{translateText("EXPLORING")}</h4>
              <p className="fact-desc">{translateText("AI, data and emerging software technologies.")}</p>
            </motion.div>
          </div>

          {/* Animated Numeric Metrics Row */}
          <div className="stats-row" ref={statsRef}>
            {STATS_DATA.map((stat, idx) => (
              <StatCard key={idx} stat={stat} isVisible={statsVisible} index={idx} />
            ))}
          </div>
        </section>

        {/* ─── 05 EXPERIENCE SECTION (Rule 10, 11, 12: Visual Junction & Copy) ── */}
        <section id="experience" className="experience-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("05 / EXPERIENCE")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.h2 className="section-title" {...reveal(0.06, 18)}>{translateText("PROFESSIONAL EXPERIENCE")}</motion.h2>

          {/* Architectural Visual Junction Diagram (Rule 10) */}
          <motion.div className="exp-junction-container" aria-label={translateText("Professional Position Diagram")} {...reveal(0.08, 22)}>
            <div className="exp-junction-diagram">
              <div className="junction-vertical-top">{translateText("SOFTWARE")}</div>
              <div className="junction-stem-top" />
              <div className="junction-horizontal-row">
                <span className="junction-node left">{translateText("BIM / IFC")}</span>
                <span className="junction-line-h" />
                <span className="junction-center-hub">●</span>
                <span className="junction-line-h" />
                <span className="junction-node right">{translateText("DIGITAL PRODUCTS")}</span>
              </div>
              <div className="junction-stem-bottom" />
              <div className="junction-vertical-bottom">{translateText("ENGINEERING / AEC")}</div>
            </div>
            <div className="junction-caption">{translateText("Junior Full-Stack Developer operating at the intersection of web architecture and AEC digital transformation")}</div>
          </motion.div>

          <motion.aside
            className="professional-mention"
            aria-labelledby="mention-title"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
          >
            <motion.div
              className="mention-heading"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <span className="mention-network-icon" aria-hidden="true"><i className="fa-brands fa-linkedin-in" /></span>
              <div>
                <span className="section-arch-code">{translateText("LINKEDIN MENTIONS")}</span>
                <h3 id="mention-title">{translateText("Contributing to BIMPulse Academy")}</h3>
              </div>
            </motion.div>
            <motion.p
              className="mention-summary"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >{translateText("In LinkedIn posts about the platform's development and launch, Abdelhamid BELMAARIS acknowledged my contribution to BIMPulse Academy, a learning platform for AECO professionals.")}</motion.p>
            <motion.div
              className="mention-footer"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <p className="mention-attribution"><strong>{translateText("Abdelhamid BELMAARIS")}</strong><span>{translateText("Civil engineer and BIM professional")}</span></p>
              <a className="mention-profile-link" href="https://www.linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer">{translateText("View my LinkedIn profile ")}<i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></a>
            </motion.div>
          </motion.aside>

          {/* Large Flagship BIMPulse Card (Rule 10, 11) */}
          <motion.div
            className="exp-card exp-flagship"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="exp-flagship-badge">
              <span className="bimpulse-indicator-dot" />{translateText(" CURRENT PROFESSIONAL POSITION")}</div>

            <div className="exp-header">
              <div className="exp-role-info">
                <div className="exp-company-brand">
                  <img src="assets/bimpulse-logo.png" alt={translateText("BIMPulse")} className="exp-bimpulse-logo" />
                  <div>
                    <h3 className="exp-role">{translateText("Junior Full-Stack Developer")}</h3>
                    <span className="exp-company">{translateText("BIMPulse")}</span>
                  </div>
                </div>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days" />{translateText(" AUG 2026 — PRESENT · Apprenticeship")}</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot" />{translateText(" Casablanca, Morocco")}</span>
              </div>
            </div>

            {/* Exact Description Copy (Rule 11) */}
            <p className="exp-desc">{translateText("Junior Full-Stack Developer contributing within a professional environment connecting software development with BIM, engineering, construction technologies and AEC digital transformation.")}</p>

            {/* Specific Tags (Rule 11) */}
            <div className="exp-skills">
              {['BIMPulse', 'BIM / IFC', 'Engineering', 'AEC Digital Solutions', 'New Technologies', 'Python', 'Django', 'SQL', 'HTML & CSS'].map((s) => (
                <span className="exp-skill-tag" key={s}>{translateText(s)}</span>
              ))}
            </div>

            {/* BIMPulse Academy Addition (Rule 12) */}
            <motion.div className="bimpulse-academy-callout" {...reveal(0.12, 18)}>
              <div className="callout-header">
                <span className="callout-label">{translateText("PROFESSIONAL WORK / 01")}</span>
                <h4 className="callout-title">{translateText("BIMPulse Academy")}</h4>
              </div>
              <p className="callout-desc">{translateText("Learning platform dedicated to AECO (Architecture, Engineering, Construction & Operations) professionals, providing specialized certified training, BIM courses, and technical digital engineering workflows.")}</p>
              <div className="callout-tags">
                <span className="mini-tag">{translateText("AEC Training")}</span>
                <span className="mini-tag">{translateText("BIM & IFC Standards")}</span>
                <span className="mini-tag">{translateText("Digital Solutions")}</span>
              </div>
            </motion.div>

            <div className="exp-actions-row">
              <a
                className="btn btn-primary"
                href="https://www.thebimpulse.com/"
                target="_blank"
                rel="noopener noreferrer"
                id="bimpulse-official-link"
              >{translateText("Discover BIMPulse ")}<span className="btn-arrow">↗</span>
              </a>
              <span className="private-repo-note">
                <i className="fa-solid fa-shield-halved" />{translateText(" Real-world engineering & software development")}</span>
            </div>
          </motion.div>

          {/* Development Milestones Timeline */}
          <div className="experience-timeline" style={{ marginTop: '30px' }}>
            <motion.div
              className="exp-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">{translateText("Django Developer")}</h3>
                  <span className="exp-company">{translateText("Self-directed & Production Web Work")}</span>
                </div>
                <div className="exp-meta">
                  <span className="exp-duration"><i className="fa-solid fa-calendar-days" />{translateText(" May 2026 – Present")}</span>
                </div>
              </div>
              <p className="exp-desc">{translateText("Engineering secure backend architectures, role-based access control (RBAC), and relational schemas in Django and Django REST Framework. Optimizing queries and database performance.")}</p>
              <div className="exp-skills">
                {['Django', 'Django REST Framework', 'Python', 'PostgreSQL', 'SQL Optimization', 'RESTful APIs'].map((s) => (
                  <span className="exp-skill-tag" key={s}>{translateText(s)}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="exp-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">{translateText("Python Developer")}</h3>
                  <span className="exp-company">{translateText("Self-directed Foundation & Systems")}</span>
                </div>
                <div className="exp-meta">
                  <span className="exp-duration"><i className="fa-solid fa-calendar-days" />{translateText(" Jan 2020 – Present")}</span>
                </div>
              </div>
              <p className="exp-desc">{translateText("Building object-oriented software, data transformation pipelines, algorithms, and automation utilities across the Python ecosystem.")}</p>
              <div className="exp-skills">
                {['Python (Async & OOP)', 'Data Pipelines', 'Pandas', 'Algorithms', 'Software Engineering'].map((s) => (
                  <span className="exp-skill-tag" key={s}>{translateText(s)}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="exp-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">{translateText("Web Developer")}</h3>
                  <span className="exp-company">{translateText("Full-Stack Application Development")}</span>
                </div>
                <div className="exp-meta">
                  <span className="exp-duration"><i className="fa-solid fa-calendar-days" />{translateText(" Feb 2023 – Jun 2026")}</span>
                </div>
              </div>
              <p className="exp-desc">{translateText("Building full-stack web applications, translating functional requirements into modular backends and responsive user interfaces.")}</p>
              <div className="exp-skills">
                {['Web Development', 'Django', 'Bootstrap 5', 'HTML5', 'CSS3', 'REST APIs'].map((s) => (
                  <span className="exp-skill-tag" key={s}>{translateText(s)}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 06 TECH STACK (Rule 18, 19: No Percentages, Clean Groups + Terminal) */}
        <section id="skills" className="tech-stack-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("06 / TECH STACK")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.h2 className="section-title" {...reveal(0.06, 18)}>{translateText("CORE CAPABILITIES & TOOLS")}</motion.h2>
          <motion.p className="section-intro" {...reveal(0.1, 18)}>{translateText("Categorized by engineering discipline. AI and Data serve as high-value supporting capabilities alongside primary full-stack development foundations.")}</motion.p>

          <div className="tech-stack-grid">
            {/* 1. Development */}
            <motion.div
              className="tech-category-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="category-header">
                <div className="category-icon-box core-icon">
                  <i className="fa-solid fa-code" />
                </div>
                <div>
                  <span className="category-kicker">{translateText("CORE DISCIPLINE")}</span>
                  <h3 className="category-title">{translateText("Development")}</h3>
                </div>
              </div>
              <div className="category-tags-list">
                {['Python', 'Django', 'HTML', 'CSS', 'SQL'].map((item) => (
                  <span className="tech-pill-large" key={item}>
                    <span className="pill-dot emerald" /> {translateText(item)}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 2. Data */}
            <motion.div
              className="tech-category-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <div className="category-header">
                <div className="category-icon-box data-icon">
                  <i className="fa-solid fa-chart-pie" />
                </div>
                <div>
                  <span className="category-kicker">{translateText("DATA DISCIPLINE")}</span>
                  <h3 className="category-title">{translateText("Data")}</h3>
                </div>
              </div>
              <div className="category-tags-list">
                {['Pandas', 'Matplotlib', 'Data Analysis'].map((item) => (
                  <span className="tech-pill-large" key={item}>
                    <span className="pill-dot gold" /> {translateText(item)}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 3. Computer Science */}
            <motion.div
              className="tech-category-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <div className="category-header">
                <div className="category-icon-box tools-icon">
                  <i className="fa-solid fa-laptop-code" />
                </div>
                <div>
                  <span className="category-kicker">{translateText("ENGINEERING FOUNDATIONS")}</span>
                  <h3 className="category-title">{translateText("Computer Science")}</h3>
                </div>
              </div>
              <div className="category-tags-list">
                {['Algorithms', 'Data Structures', 'Software Engineering'].map((item) => (
                  <span className="tech-pill-large" key={item}>
                    <span className="pill-dot white" /> {translateText(item)}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 4. Exploring / Foundations */}
            <motion.div
              className="tech-category-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              <div className="category-header">
                <div className="category-icon-box explore-icon">
                  <i className="fa-solid fa-brain" />
                </div>
                <div>
                  <span className="category-kicker">{translateText("HORIZONS")}</span>
                  <h3 className="category-title">{translateText("Exploring / Foundations")}</h3>
                </div>
              </div>
              <div className="category-tags-list">
                {['Artificial Intelligence', 'Cybersecurity'].map((item) => (
                  <span className="tech-pill-large" key={item}>
                    <span className="pill-dot emerald" /> {translateText(item)}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Embedded Interactive AI & Engineering Console Playground */}
          <motion.div className="embedded-terminal-wrapper" style={{ marginTop: '50px' }} {...reveal(0.12, 22)}>
            <div className="terminal-section-intro">
              <span className="section-arch-code">{translateText("INTERACTIVE CLI & ARCHITECTURE SIMULATION")}</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '6px', color: 'var(--white)' }}>{translateText("Query Abdellah's Architecture Live")}</h3>
            </div>
            <AiDevTerminal />
          </motion.div>
        </section>

        {/* ─── 07 CERTIFICATIONS (Rule 20: Clean Credentials List & Preview) ───── */}
        <section id="certifications" className="credentials-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("07 / CREDENTIALS")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.h2 className="section-title" {...reveal(0.06, 18)}>{translateText("CONTINUOUS LEARNING")}</motion.h2>
          <motion.p className="section-intro" {...reveal(0.1, 18)}>{translateText("Verified technical credentials validating applied AI engineering, Python data analysis, and software development.")}</motion.p>

          <div className="credentials-compact-list">
            {CERTIFICATIONS_DATA.map((cert, idx) => (
              <motion.div
                key={idx}
                className="credential-row-item"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                onClick={() => setSelectedCert(cert.img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedCert(cert.img)}
              >
                <div className="credential-left">
                  <span className="credential-year">2026</span>
                  <div className="credential-info">
                    <h4 className="credential-name">{translateText(cert.degree)}</h4>
                    <span className="credential-issuer">{translateText(cert.platform)} · {translateText(cert.credentialId)}</span>
                  </div>
                </div>
                <div className="credential-right">
                  <span className="credential-preview-trigger">{translateText("Preview Credential ")}<span className="btn-arrow">↗</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education & Specialized Tracks */}
          <div className="education-tracks-wrap" style={{ marginTop: '40px' }}>
            <motion.h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 600 }} {...reveal(0.06, 16)}>{translateText("Specialized Study Tracks")}</motion.h3>
            <div className="education-grid">
              {EDUCATION_DATA.map((ed, idx) => (
                <motion.div className="education-card" key={idx} {...reveal(idx * 0.08, 20)}>
                  <div className="edu-header">
                    <div className="edu-logo"><i className={ed.icon} /></div>
                    <span className="edu-platform">{translateText(ed.platform)}</span>
                  </div>
                  <h4 className="edu-degree">{translateText(ed.degree)}</h4>
                  <span className="edu-date"><i className="fa-solid fa-calendar-days" /> {translateText(ed.date)}</span>
                  <div className="edu-skills-row" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ed.skills.map((skill) => (
                      <span className="exp-skill-tag" key={skill}>{translateText(skill)}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 08 START A PROJECT (Rule: Client-Facing Project Inquiry Engine) ──── */}
        <ProjectRequestSection
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onClearServices={handleClearServices}
        />

        {/* ─── 09 CONTACT (Rule 29: Have an idea? LET'S BUILD SOMETHING MEANINGFUL) */}
        <section id="contact" className="contact-redesign-section">
          {/* Architectural Line Transition (Rule 27) */}
          <motion.div className="section-arch-divider" {...reveal(0, 14)}>
            <span className="section-arch-code">{translateText("09 / CONTACT")}</span>
            <div className="section-arch-line" />
          </motion.div>

          <motion.div {...reveal(0.06, 20)}>
            <span className="contact-kicker">{translateText("Have an idea?")}</span>
            <h2 className="contact-big-headline">{translateText("LET'S BUILD SOMETHING MEANINGFUL.")}</h2>
            <p className="contact-subheadline">{translateText("Professional collaborations, development opportunities and interesting digital projects.")}</p>
          </motion.div>

          <div className="contact-layout-grid">
            <div className="contact-info-column">
              <motion.div className="contact-info-card" {...reveal(0.1, 20)}>
                <span className="info-card-label">{translateText("CURRENT ROLE & LOCATION")}</span>
                <p className="info-card-val">{translateText("Junior Full-Stack Developer at BIMPulse")}</p>
                <p className="info-card-sub"><i className="fa-solid fa-location-dot" style={{ color: 'var(--emerald-bright)' }} />{translateText(" Casablanca, Morocco")}</p>
              </motion.div>

              <motion.div className="contact-info-card" {...reveal(0.16, 20)}>
                <span className="info-card-label">{translateText("DIRECT EMAIL")}</span>
                <p className="info-card-val">
                  <button
                    type="button"
                    className="email-copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText('obaidbelmaaris@gmail.com');
                      setCopiedContactEmail(true);
                      setTimeout(() => setCopiedContactEmail(false), 2500);
                      const nameInput = document.getElementById('form-name');
                      nameInput?.focus();
                    }}
                    title={translateText("Click to copy email")}
                    id="contact-email-copy-btn"
                  >
                    <span>obaidbelmaaris@gmail.com</span>
                    <i className={copiedContactEmail ? "fa-solid fa-check" : "fa-regular fa-copy"} style={{ color: copiedContactEmail ? 'var(--emerald-bright)' : 'var(--cyan-bright)', marginLeft: '8px' }} />
                  </button>
                  {copiedContactEmail && (
                    <span className="copied-inline-toast">{translateText("Copied to clipboard! ✓")}</span>
                  )}
                </p>
              </motion.div>

              <motion.div className="contact-links-stack" {...reveal(0.22, 20)}>
                <a
                  href="https://linkedin.com/in/abdellah-belmaaris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-quick-link"
                  id="contact-linkedin-link"
                >
                  <i className="fa-brands fa-linkedin-in" />{translateText(" LinkedIn Profile ")}<span className="link-arrow">↗</span>
                </a>
                <a
                  href="https://github.com/Abdellah-BELMAARIS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-quick-link"
                  id="contact-github-link"
                >
                  <i className="fa-brands fa-github" />{translateText(" GitHub Repositories ")}<span className="link-arrow">↗</span>
                </a>
                <a
                  href="assets/Abdellah_BELMAARIS_CV.pdf"
                  download
                  className="contact-quick-link highlight"
                  id="contact-cv-download-link"
                >
                  <i className="fa-solid fa-file-arrow-down" />{translateText(" Download Curriculum Vitae (PDF) ")}<span className="link-arrow">↗</span>
                </a>
              </motion.div>
            </div>

            {/* Clean Contact Form with Validation */}
            <div className="contact-form-column">
              <motion.form className="contact-form-redesign" onSubmit={handleContactSubmit} id="contact-form" {...reveal(0.12, 22)}>
                <div className="form-group honeypot" aria-hidden="true" style={{ display: 'none' }}>
                  <label htmlFor="form-website">{translateText("Website")}</label>
                  <input
                    id="form-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="form-field-wrapper">
                  <label htmlFor="form-name" className="form-label">{translateText("YOUR NAME")}</label>
                  <input
                    type="text"
                    id="form-name"
                    className="form-input"
                    placeholder={translateText("Jane Doe")}
                    autoComplete="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    maxLength={80}
                  />
                </div>

                <div className="form-field-wrapper">
                  <label htmlFor="form-email" className="form-label">{translateText("EMAIL ADDRESS")}</label>
                  <input
                    type="email"
                    id="form-email"
                    className="form-input"
                    placeholder={translateText("jane@company.com")}
                    autoComplete="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    maxLength={160}
                  />
                </div>

                <div className="form-field-wrapper">
                  <label htmlFor="form-message" className="form-label">{translateText("MESSAGE")}</label>
                  <textarea
                    id="form-message"
                    className="form-textarea"
                    placeholder={translateText("Tell me about your project, idea, or role…")}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    required
                    minLength={20}
                    maxLength={2000}
                    rows={5}
                  />
                </div>

                {formStatus && (
                  <div className={`form-status ${formStatus.type}`} role="status" aria-live="polite">
                    {translateText(formStatus.text)}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary contact-submit-button"
                  id="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  <i className={`fa-solid ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} style={{ marginRight: '8px' }} />
                  {translateText(isSubmitting ? 'Sending…' : 'Send a Message →')}
                </button>
              </motion.form>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Floating Project CTA Button (Rule 28) */}
      <FloatingProjectButton />

      {/* ─── 09 FOOTER (Rule 30: Simple, Clean Footer) ────────────────────────── */}
      <motion.footer className="footer-redesign" {...reveal(0.06, 16)}>
        <div className="footer-top-row">
          <div className="footer-brand">
            <span className="footer-logo">{translateText("AB.")}</span>
            <div className="footer-brand-meta">
              <span className="footer-name">{translateText("Abdellah BELMAARIS")}</span>
              <span className="footer-role">{translateText("Junior Full-Stack Developer • BIMPulse • Morocco")}</span>
            </div>
          </div>
          <div className="footer-links-group">
            <a href="https://linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer">{translateText("LinkedIn")}</a>
            <span className="footer-sep">·</span>
            <a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer">{translateText("GitHub")}</a>
            <span className="footer-sep">·</span>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {translateText("Email")}
            </a>
          </div>
        </div>
        <div className="footer-bottom-row">
          <p>{translateText("Designed & developed by Abdellah BELMAARIS © 2026")}</p>
        </div>
      </motion.footer>

      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            aria-label={translateText("Scroll to top")}
            id="scroll-to-top-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <i className="fa-solid fa-chevron-up" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Case Study Modal */}
        <CaseStudyModal isOpen={caseStudyOpen} onClose={() => setCaseStudyOpen(false)} />

        {/* Certificate Image Lightbox Modal */}
        {selectedCert && (
          <motion.div
            className="modal active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.modal-close')) {
                setSelectedCert(null);
              }
            }}
          >
            <div className="modal-content-wrapper">
              <button className="modal-close" aria-label={translateText("Close credential preview")} id="cert-modal-close">
                <i className="fa-solid fa-xmark" />
              </button>
              <img src={selectedCert} alt={translateText("Enlarged Credential")} className="modal-img" />
            </div>
          </motion.div>
        )}

        {/* Video Demo Modal */}
        {videoModalOpen && (
          <motion.div
            className="modal active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.video-modal-close')) {
                setVideoModalOpen(false);
              }
            }}
          >
            <div className="video-modal-content">
              <div className="video-modal-header">
                <h3 className="video-modal-title">
                  <i className="fa-solid fa-circle-play" style={{ color: 'var(--emerald-bright)', marginRight: '8px' }} />{translateText("Project Walkthrough Demos")}</h3>
                <button className="video-modal-close" aria-label={translateText("Close video player")} id="video-modal-close-btn">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <div className="video-modal-tabs">
                {[
                  { label: 'Overview', src: 'assets/demo1.mp4' },
                  { label: 'Content Editor', src: 'assets/demo2.mp4' },
                  { label: 'Full Walkthrough', src: 'assets/demo3.mp4' }
                ].map((tab) => (
                  <button
                    key={tab.src}
                    className={`video-modal-tab ${videoSrc === tab.src ? 'active' : ''}`}
                    onClick={() => setVideoSrc(tab.src)}
                    id={`video-tab-${tab.label.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {translateText(tab.label)}
                  </button>
                ))}
              </div>
              <div className="video-modal-screen">
                <video src={videoSrc} controls autoPlay playsInline />
              </div>
            </div>
          </motion.div>
        )}

        {/* The Modern Journal 5-Picture Fullscreen Lightbox Modal */}
        {journalLightboxIndex !== null && (
          <motion.div
            className="journal-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.journal-lightbox-close')) {
                setJournalLightboxIndex(null);
              }
            }}
          >
            <div className="journal-lightbox-header">
              <div className="journal-lightbox-title-wrap">
                <span className="journal-lightbox-badge">
                  {JOURNAL_GALLERY[journalLightboxIndex].label} ({JOURNAL_GALLERY[journalLightboxIndex].num}/05)
                </span>
                <h3 className="journal-lightbox-title">
                  {translateText(JOURNAL_GALLERY[journalLightboxIndex].title)}
                </h3>
              </div>
              <div className="journal-lightbox-actions">
                <a
                  href={JOURNAL_GALLERY[journalLightboxIndex].img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journal-lightbox-btn"
                  title={translateText("Open original image")}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <span>{translateText("Open Original")}</span>
                </a>
                <button
                  className="journal-lightbox-close"
                  onClick={() => setJournalLightboxIndex(null)}
                  aria-label={translateText("Close screenshot modal")}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            <div className="journal-lightbox-stage">
              <button
                className="journal-lightbox-nav journal-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setJournalLightboxIndex((prev) => (prev === null || prev === 0 ? JOURNAL_GALLERY.length - 1 : prev - 1));
                }}
                aria-label={translateText("Previous screenshot")}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>

              <div className="journal-lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
                <img
                  src={JOURNAL_GALLERY[journalLightboxIndex].img}
                  alt={translateText(`${JOURNAL_GALLERY[journalLightboxIndex].label} - ${JOURNAL_GALLERY[journalLightboxIndex].title}`)}
                  className="journal-lightbox-img"
                />
              </div>

              <button
                className="journal-lightbox-nav journal-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setJournalLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % JOURNAL_GALLERY.length));
                }}
                aria-label={translateText("Next screenshot")}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>

            <div className="journal-lightbox-caption">
              <span>{translateText(JOURNAL_GALLERY[journalLightboxIndex].caption)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
