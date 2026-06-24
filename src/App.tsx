import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import CaseStudyModal from './components/CaseStudyModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  title: string;
  desc: string;
  icon: string;
}

interface EdCard {
  platform: string;
  degree: string;
  date: string;
  skills: string[];
  icon: string;
}

interface CertCard {
  platform: string;
  degree: string;
  date: string;
  credentialId: string;
  img: string;
  skills?: string[];
  icon: string;
}

interface OtherProject {
  title: string;
  desc: string;
  tech: string[];
  icon: string;
  github?: string;
  live?: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const SKILLS_DATA: Skill[] = [
  { title: "Python Programming", desc: "Writing clean, asynchronous, and PEP-8 compliant OOP scripts.", icon: "fa-brands fa-python" },
  { title: "Django & DRF", desc: "Building secure, scalable RESTful API environments and content platforms.", icon: "fa-solid fa-server" },
  { title: "Backend Development", desc: "Designing secure API routing, token authorization systems, and server logics.", icon: "fa-solid fa-globe" },
  { title: "SQL & Databases", desc: "Designing database schemas, managing relational tables, and optimizing queries.", icon: "fa-solid fa-database" },
  { title: "Data Analysis", desc: "Cleaning, filtering, and performing statistical operations using Pandas.", icon: "fa-solid fa-magnifying-glass-chart" },
  { title: "Data Visualization", desc: "Transforming complex datasets into clean dashboards using Matplotlib.", icon: "fa-solid fa-chart-line" },
  { title: "AI Fundamentals", desc: "Understanding machine learning, LLM systems, and prompt engineering logic.", icon: "fa-solid fa-brain" },
  { title: "Cybersecurity", desc: "Implementing security fundamentals to protect systems and data architectures.", icon: "fa-solid fa-shield-halved" },
  { title: "Algorithms & Structures", desc: "Applying optimal data configurations to solve computational problems.", icon: "fa-solid fa-code-fork" },
  { title: "Software Engineering", desc: "Designing software patterns, modular modules, and clean-code architectures.", icon: "fa-solid fa-microchip" },
  { title: "Problem Solving", desc: "Breaking down complex tasks into functional, testable code routines.", icon: "fa-solid fa-lightbulb" },
  { title: "Web App Development", desc: "Executing product blueprints from system structure to live integration.", icon: "fa-solid fa-laptop-code" },
  { title: "Bootstrap & Integration", desc: "Translating dynamic templates and responsive layouts to functional frontends.", icon: "fa-brands fa-bootstrap" },
  { title: "Continuous Research", desc: "Constantly investigating emerging frameworks, patterns, and development tools.", icon: "fa-solid fa-graduation-cap" }
];

const STATS_DATA: Stat[] = [
  { value: 6, suffix: '+', label: 'Years Coding', icon: 'fa-solid fa-calendar-days' },
  { value: 4, suffix: '+', label: 'GitHub Projects', icon: 'fa-solid fa-folder-open' },
  { value: 4, suffix: '', label: 'Certifications', icon: 'fa-solid fa-award' },
  { value: 14, suffix: '+', label: 'Skills Acquired', icon: 'fa-solid fa-code' },
];

const EDUCATION_DATA: EdCard[] = [
  {
    platform: "DataCamp",
    degree: "Data Science & Analytics Foundations",
    date: "Self-Paced Learning",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python (Programming Language)", "SQL", "Data Analysis", "Pandas", "NumPy", "Data Visualization"]
  },
  {
    platform: "Self-taught",
    degree: "Specialized Track, Backend Architecture & Systems",
    date: "Jan 2023 – May 2026",
    icon: "fa-solid fa-user-gear",
    skills: ["Python (Programming Language)", "Deep Learning Fundamentals", "Neural Networks", "Machine Learning", "Git & GitHub", "Docker", "Backend Architecture"]
  },
  {
    platform: "DataCamp",
    degree: "Career Track, Backend Developer",
    date: "Self-Paced Learning",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python (Programming Language)", "SQL", "PostgreSQL", "FastAPI", "Git", "API Development"]
  },
  {
    platform: "Self-taught",
    degree: "Specialized Curriculum, Django REST Framework",
    date: "Jan 2026 – Jun 2026",
    icon: "fa-solid fa-user-gear",
    skills: ["Django", "Django REST Framework"]
  }
];

const CERTIFICATIONS_DATA: CertCard[] = [
  {
    platform: "DataCamp",
    degree: "AI Engineer for Developers Associate",
    date: "Issued Apr 2026 · Expires Apr 2026",
    credentialId: "AIEDA0011678564836",
    img: "assets/certificate_ai_engineer.png",
    icon: "fa-solid fa-graduation-cap"
  },
  {
    platform: "المدرسة - Almdrasa",
    degree: "Cybersecurity Fundamentals",
    date: "Issued Feb 2026 · Expires Apr 2026",
    credentialId: "77F16BFF2A-77EB48CD64-1451D2521",
    img: "assets/cybersecurity_fundamentals.jpg",
    icon: "fa-solid fa-shield-halved",
    skills: ["Cybersecurity Fundamentals"]
  },
  {
    platform: "DataCamp",
    degree: "Python Data Associate",
    date: "Issued Feb 2026 · Expires Feb 2026",
    credentialId: "PDA0019412806212",
    img: "assets/python_data_associate.jpg",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python Data Associate"]
  },
  {
    platform: "Self-Taught",
    degree: "Associate Python Developer",
    date: "Jan 2026 – Jun 2026",
    credentialId: "30 HR · Professional Track, Django Developer",
    img: "assets/certificate.png",
    icon: "fa-solid fa-award",
    skills: ["Django", "Django REST Framework"]
  }
];

const PROJECT_IMAGES = [
  "assets/journal1.png",
  "assets/journal2.png",
  "assets/journal3.png",
  "assets/journal4.png",
  "assets/journal5.png"
];

const OTHER_PROJECTS: OtherProject[] = [
  {
    title: "django_rest",
    desc: "Designed and optimized a RESTful API with token authentication and role-based permissions. Utilized prefetching (select_related/prefetch_related) to minimize database roundtrips and prevent N+1 query bottlenecks.",
    tech: ["Django", "Django REST Framework", "Python", "SQLite"],
    icon: "fa-solid fa-server",
    github: "https://github.com/Abdellah-BELMAARIS/django_rest",
  },
  {
    title: "Dev-Pulse",
    desc: "Built a local developer activity pipeline that parses and aggregates system log files. Utilized Pandas to clean and process high-dimensional activity data, generating performance reports with Matplotlib in under 200ms.",
    tech: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
    icon: "fa-solid fa-chart-line",
    github: "https://github.com/Abdellah-BELMAARIS/Dev-Pulse",
  },
  {
    title: "school_project",
    desc: "Developed a school administration backend featuring modular relational schemas, secure forms, custom middleware, and session authentication to demonstrate MVC architecture best practices.",
    tech: ["Django", "Python", "SQL", "Bootstrap"],
    icon: "fa-solid fa-graduation-cap",
    github: "https://github.com/Abdellah-BELMAARIS/school_project",
  },
  {
    title: "O-O-P",
    desc: "Designed a modular library demonstrating advanced Object-Oriented Programming (OOP) principles. Integrated creational, structural, and behavioral design patterns (Factory, Strategy, Singleton) to ensure a highly testable codebase.",
    tech: ["Python", "OOP", "Design Patterns", "Software Engineering"],
    icon: "fa-solid fa-cube",
    github: "https://github.com/Abdellah-BELMAARIS/O-O-P",
  },
];

// ─── Loading Screen Component ─────────────────────────────────────────────────

function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    const steps = [10, 25, 40, 60, 75, 90, 100];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        setProgress(steps[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setPhase('done');
        setTimeout(onFinish, 600);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'done' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-content">
        <motion.div
          className="loading-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="loading-logo-ab">AB</span>
          <span className="loading-logo-dot" />
        </motion.div>
        <motion.p
          className="loading-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Abdellah BELMAARIS
        </motion.p>
        <div className="loading-bar-wrapper">
          <motion.div
            className="loading-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <motion.p
          className="loading-percent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, isVisible: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    const steps = 50;
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

// ─── Stat Card Component ──────────────────────────────────────────────────────

function StatCard({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useAnimatedCounter(stat.value, isVisible);
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={stat.icon} />
      </div>
      <div className="stat-number">
        {count}{stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}


// ─── Main App Component ───────────────────────────────────────────────────────

export default function App() {
  // Loading screen
  const [isLoading, setIsLoading] = useState(true);

  // Mobile Nav Active State
  const [menuActive, setMenuActive] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Toggle body class to lock scroll when mobile menu is active
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

  // Typewriter Text states
  const [welcomeText, setWelcomeText] = useState('');
  const [nameText, setNameText] = useState('');
  const [headlineText, setHeadlineText] = useState('');
  const [typingLine, setTypingLine] = useState<'welcome' | 'name' | 'headline' | 'done'>('welcome');

  // Custom project screenshots carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal control states
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('assets/demo1.mp4');

  // Contact form submission states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);

  // Stats visibility (for animated counters)
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Scroll-to-top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Typewriter Animation logic (only starts after loading)
  useEffect(() => {
    if (isLoading) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fullWelcome = "Hi, my name is";
    const fullName = "Abdellah BELMAARIS.";
    const fullHeadline = "Backend & Software Engineer specializing in Python, Django, and Scalable API Architectures. Focused on secure database modeling, system design, and clean code principles.";

    if (prefersReducedMotion) {
      setWelcomeText(fullWelcome);
      setNameText(fullName);
      setHeadlineText(fullHeadline);
      setTypingLine('done');
      return;
    }

    let active = true;

    const typeText = async () => {
      // 1. Type welcome
      setTypingLine('welcome');
      for (let i = 0; i <= fullWelcome.length; i++) {
        if (!active) return;
        setWelcomeText(fullWelcome.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 35));
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      // 2. Type name
      setTypingLine('name');
      for (let i = 0; i <= fullName.length; i++) {
        if (!active) return;
        setNameText(fullName.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 55));
      }

      await new Promise((resolve) => setTimeout(resolve, 250));

      // 3. Type headline
      setTypingLine('headline');
      for (let i = 0; i <= fullHeadline.length; i++) {
        if (!active) return;
        setHeadlineText(fullHeadline.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 12));
      }

      if (active) {
        setTypingLine('done');
      }
    };

    typeText();

    return () => {
      active = false;
    };
  }, [isLoading]);

  // 2. Navigation Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'skills', 'project', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 200;

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

      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Project Carousel Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROJECT_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 4. Stats intersection observer (trigger animated counters when in view)
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

  // 5. Contact Form Handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setFormStatus({ type: 'info', text: 'Sending message...' });

    try {
      const response = await fetch('https://formsubmit.co/ajax/obaidbelmaaris@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage
        })
      });

      if (response.ok) {
        setFormStatus({ type: 'success', text: 'Message sent successfully!' });
        setFormName('');
        setFormEmail('');
        setFormMessage('');
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (err) {
      console.error(err);
      setFormStatus({
        type: 'error',
        text: 'Oops! Failed to send message. Please contact me directly at obaidbelmaaris@gmail.com.'
      });
    }
  };

  // 6. Scroll-to-top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuActive(false);
        setSelectedCert(null);
        setVideoModalOpen(false);
        setCaseStudyOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      {/* Loading Splash Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onFinish={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* 3D WebGL Background Canvas */}
      <ThreeBackground />

      {/* Mobile Menu Backdrop Overlay */}
      <div
        className={`nav-overlay ${menuActive ? 'active' : ''}`}
        onClick={() => setMenuActive(false)}
      />

      {/* Header Navigation */}
      <header className="header">
        <a href="#hero" className="logo" aria-label="Abdellah BELMAARIS Homepage">
          Abdellah <span style={{ color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.5px' }}>BELMAARIS</span>
        </a>
        <button
          className={`hamburger ${menuActive ? 'active' : ''}`}
          onClick={() => setMenuActive(!menuActive)}
          aria-label="Toggle menu"
          aria-expanded={menuActive}
          id="hamburger-btn"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
        <nav>
          <ul className={`nav-list ${menuActive ? 'active' : ''}`}>
            {[
              { id: 'hero', label: 'Home', idx: '01.' },
              { id: 'about', label: 'About', idx: '02.' },
              { id: 'experience', label: 'Experience', idx: '03.' },
              { id: 'skills', label: 'Skills', idx: '04.' },
              { id: 'project', label: 'Projects', idx: '05.' },
              { id: 'certifications', label: 'Education', idx: '06.' },
              { id: 'contact', label: 'Contact', idx: '07.' }
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setMenuActive(false)}
                  id={`nav-link-${item.id}`}
                >
                  <span>{item.idx}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <span className={`hero-welcome ${typingLine === 'welcome' ? 'typing-active' : ''}`}>
          {welcomeText}
        </span>
        <h1 className={`hero-name ${typingLine === 'name' ? 'typing-active' : ''}`}>
          {nameText}
        </h1>
        <p className={`hero-headline ${typingLine === 'headline' ? 'typing-active' : ''}`}>
          {headlineText}
        </p>
        <div className="hero-location">
          <i className="fa-solid fa-location-dot"></i> Casablanca, Morocco
        </div>
        <div className="hero-buttons">
          <a href="#project" className="btn btn-primary" id="hero-view-work-btn">View My Work</a>
          <a href="#contact" className="btn btn-secondary" id="hero-connect-btn">Let's Connect</a>
          <a
            href="assets/Abdellah_BELMAARIS_CV.pdf"
            download
            className="btn btn-resume"
            id="hero-resume-btn"
            aria-label="Download Resume PDF"
          >
            <i className="fa-solid fa-file-arrow-down" style={{ marginRight: '8px' }}></i>
            Resume
          </a>
          <div className="hero-social-links">
            <a
              href="https://linkedin.com/in/abdellah-belmaaris"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-icon"
              aria-label="Visit LinkedIn Profile"
              id="hero-linkedin-link"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a
              href="https://github.com/Abdellah-BELMAARIS"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-icon"
              aria-label="Visit GitHub Profile"
              id="hero-github-link"
            >
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <span className="section-overline">02. Bio Summary</span>
        <h2 className="section-title">About Me</h2>
        <div className="about-layout">
          <div className="about-text">
            <p>
              Hello! I'm <span className="highlight">Abdellah BELMAARIS</span>, a self-taught Backend and Web Developer from <span className="highlight">Casablanca, Morocco</span>, with a strong passion for software development, artificial intelligence, data analysis, and emerging technologies. Through years of independent learning, online courses, certifications, and hands-on projects, I've built a solid technical foundation in programming and modern web development.
            </p>
            <p>
              My primary expertise lies in <span className="highlight">Python development</span> — backend programming, data analysis, software engineering principles, and web application architecture. I work with <span className="highlight">Django, Django REST Framework, SQL, Pandas, Matplotlib, and Bootstrap</span> to build scalable applications and analyze real-world data. I also have a strong understanding of algorithms, data structures, OOP, and problem-solving techniques.
            </p>
            <p>
              I've earned multiple certifications from <span className="highlight">DataCamp, Boot.dev, and Almdrasa</span>, covering AI, Python Development, Data Analysis, Cybersecurity, Software Engineering, Functional Programming, and Data Structures. Currently I'm focused on deepening my backend expertise while building increasingly complex projects that solve real-world problems — eager to gain professional experience and contribute to meaningful software.
            </p>
            <div className="about-cta-row">
              <a
                href="assets/Abdellah_BELMAARIS_CV.pdf"
                download
                className="btn btn-primary"
                id="about-resume-btn"
                aria-label="Download Resume PDF"
              >
                <i className="fa-solid fa-file-arrow-down" style={{ marginRight: '8px' }}></i>
                Download Resume
              </a>
              <a
                href="https://github.com/Abdellah-BELMAARIS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                id="about-github-btn"
              >
                <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i>
                GitHub Profile
              </a>
            </div>
          </div>
          <div className="about-avatar-container">
            <div className="about-avatar-frame"></div>
            <div className="about-avatar-img-placeholder">
              <img
                src="assets/avatar.jpg"
                alt="Abdellah BELMAARIS Profile Avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300/0a192f/64ffda?text=AB';
                }}
              />
            </div>
          </div>
        </div>

        {/* Animated Stats Row */}
        <div className="stats-row" ref={statsRef}>
          {STATS_DATA.map((stat, idx) => (
            <StatCard key={idx} stat={stat} isVisible={statsVisible} />
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience">
        <span className="section-overline">03. Work History</span>
        <h2 className="section-title">Experience</h2>
        <div className="experience-timeline">

          {/* Role 1 */}
          <motion.div
            className="exp-card spotlight-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="exp-header">
              <div className="exp-role-info">
                <h3 className="exp-role">Back End Developer</h3>
                <span className="exp-company">Self-employed · Remote</span>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> May 2021 – Jun 2026 · 5 yrs 2 mos</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Designed and built secure RESTful APIs and backend architectures using Django and Django REST Framework. Implemented token-based authentication, role-based permissions, database schema design, and server-side business logic across multiple web application projects.
            </p>
            <div className="exp-skills">
              {["Django", "DRF", "Python", "SQL", "Bootstrap", "AI", "Git", "REST APIs", "PostgreSQL", "OOP", "Algorithms", "Software Engineering"].map(s => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Role 2 */}
          <motion.div
            className="exp-card spotlight-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="exp-header">
              <div className="exp-role-info">
                <h3 className="exp-role">Web Developer</h3>
                <span className="exp-company">Self-employed · Remote</span>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> Feb 2023 – Present · 3 yrs 5 mos</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Casablanca-Settat, Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Developed full-stack web applications, translating product requirements into structured backends and responsive frontends. Focused on web application architecture, Bootstrap integration, and delivering clean, maintainable codebases aligned with modern development standards.
            </p>
            <div className="exp-skills">
              {["Web Application Development", "WebDev", "Django", "Bootstrap"].map(s => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Role 3 */}
          <motion.div
            className="exp-card spotlight-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="exp-header">
              <div className="exp-role-info">
                <h3 className="exp-role">Python Developer</h3>
                <span className="exp-company">Self-employed · Full-time</span>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> Jan 2020 – Present · 6 yrs 6 mos</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Built Python programs, automation scripts, data analysis pipelines, and software utilities since 2020. Continuously growing expertise across Python's ecosystem — from scripting and OOP to machine learning fundamentals and AI engineering.
            </p>
            <div className="exp-skills">
              {["Python", "Program Development", "OOP", "Data Analysis", "Automation"].map(s => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <span className="section-overline">04. Stack &amp; Skills</span>
        <h2 className="section-title">Key Areas of Expertise</h2>
        <div className="skills-grid">
          {SKILLS_DATA.map((skill, index) => (
            <motion.div
              className="skill-card spotlight-card"
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="skill-icon">
                <i className={skill.icon}></i>
              </div>
              <div className="skill-info">
                <h3>{skill.title}</h3>
                <p>{skill.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="project">
        <span className="section-overline">05. Showcase</span>
        <h2 className="section-title">Featured Project</h2>

        {/* Main Featured Project Card */}
        <div className="project-card">
          {/* Custom Carousel */}
          <div className="project-carousel">
            <div className="project-carousel-slides">
              {PROJECT_IMAGES.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className={`project-slide ${currentSlide === idx ? 'active' : ''}`}
                  alt={`The Modern Journal - Showcase ${idx + 1}`}
                />
              ))}
            </div>
            <button
              className="project-carousel-btn project-carousel-prev"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? PROJECT_IMAGES.length - 1 : prev - 1))}
              aria-label="Previous screenshot"
              id="carousel-prev-btn"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className="project-carousel-btn project-carousel-next"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % PROJECT_IMAGES.length)}
              aria-label="Next screenshot"
              id="carousel-next-btn"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <div className="project-carousel-dots">
              {PROJECT_IMAGES.map((_, idx) => (
                <span
                  key={idx}
                  className={`project-carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  role="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  id={`carousel-dot-${idx}`}
                ></span>
              ))}
            </div>
          </div>

          <div className="project-content">
            <span className="project-badge">Featured Content Management Platform</span>
            <h3 className="project-title">The Modern Journal</h3>
            <p className="project-desc">
              A secure, high-performance content management platform built with Django. Features role-based access control (RBAC), database query optimizations (N+1 resolution), session security, custom search indexing, and automated email workflows. Formulated structured relational schemas to support multi-model interactions.
            </p>
            <ul className="project-tech-list">
              {["Django", "Django REST Framework", "SQL", "Bootstrap", "JavaScript"].map((tech) => (
                <li className="project-tech-item" key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="project-links">
              <button
                className="btn btn-primary"
                onClick={() => setCaseStudyOpen(true)}
                id="featured-case-study-btn"
              >
                <i className="fa-solid fa-gears" style={{ marginRight: '8px' }}></i> Technical Case Study
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setVideoModalOpen(true)}
                style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                id="featured-demo-btn"
              >
                <i className="fa-solid fa-circle-play" style={{ marginRight: '8px' }}></i> Video Demo
              </button>
              <a
                href="https://github.com/Abdellah-BELMAARIS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                id="featured-github-btn"
              >
                <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Other Projects Grid */}
        <div className="other-projects-header">
          <h3 className="other-projects-title">
            <i className="fa-solid fa-folder-open" style={{ color: 'var(--accent)', marginRight: '10px' }}></i>
            Other Noteworthy Projects
          </h3>
          <a
            href="https://github.com/Abdellah-BELMAARIS"
            target="_blank"
            rel="noopener noreferrer"
            className="other-projects-link"
            id="view-all-projects-link"
          >
            View All on GitHub <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        <div className="other-projects-grid">
          {OTHER_PROJECTS.map((proj, idx) => (
            <motion.div
              key={idx}
              className="other-project-card spotlight-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="other-project-top">
                <div className="other-project-icon">
                  <i className={proj.icon}></i>
                </div>
                <div className="other-project-actions">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${proj.title} GitHub repository`}
                      id={`proj-github-${idx}`}
                    >
                      <i className="fa-brands fa-github"></i>
                    </a>
                  )}
                  {proj.live && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${proj.title} live demo`}
                      id={`proj-live-${idx}`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                  )}
                </div>
              </div>
              <h4 className="other-project-title">{proj.title}</h4>
              <p className="other-project-desc">{proj.desc}</p>
              <ul className="other-project-tech">
                {proj.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section id="certifications">
        <span className="section-overline">06. Academics</span>
        <h2 className="section-title">Education & Certifications</h2>

        {/* Education Subsection */}
        <h3 className="subsection-title" style={{ fontSize: '1.3rem', marginTop: '30px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent)' }}></i> Education
        </h3>
        <div className="education-grid" style={{ marginTop: '20px', marginBottom: '50px' }}>
          {EDUCATION_DATA.map((ed, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
              className="education-card spotlight-card"
            >
              <div className="edu-header">
                <div className="edu-logo"><i className={ed.icon}></i></div>
                <span className="edu-platform">{ed.platform}</span>
              </div>
              <h4 className="edu-degree">{ed.degree}</h4>
              <span className="edu-date"><i className="fa-solid fa-calendar-days"></i> {ed.date}</span>
              <div className="edu-details-title">Skills</div>
              <ul className="edu-details-list">
                {ed.skills.map((skill) => (
                  <li className="edu-detail-tag" key={skill}>{skill}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Licenses & Certifications Subsection */}
        <h3 className="subsection-title" style={{ fontSize: '1.3rem', marginTop: '40px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-award" style={{ color: 'var(--accent)' }}></i> Licenses & Certifications
        </h3>
        <div className="education-grid" style={{ marginTop: '20px' }}>
          {CERTIFICATIONS_DATA.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
              className="education-card spotlight-card"
            >
              <div className="edu-header">
                <div className="edu-logo"><i className={cert.icon}></i></div>
                <span className="edu-platform">{cert.platform}</span>
              </div>
              <h4 className="edu-degree">{cert.degree}</h4>
              <span className="edu-date"><i className="fa-solid fa-calendar-days"></i> {cert.date}</span>
              <div className="edu-details-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
                Credential ID: {cert.credentialId}
              </div>
              {cert.skills && (
                <>
                  <div className="edu-details-title" style={{ marginTop: '10px' }}>Skills</div>
                  <ul className="edu-details-list">
                    {cert.skills.map((skill) => (
                      <li className="edu-detail-tag" key={skill}>{skill}</li>
                    ))}
                  </ul>
                </>
              )}
              <div
                className="edu-cert-preview"
                title={`View ${cert.degree} Certification`}
                onClick={() => setSelectedCert(cert.img)}
                id={`cert-preview-${idx}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedCert(cert.img)}
              >
                <img
                  src={cert.img}
                  alt={`${cert.degree} Certification`}
                  className="edu-cert-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/320/0b1329/64ffda?text=${encodeURIComponent(cert.degree.slice(0, 15))}`;
                  }}
                />
                <div className="edu-cert-overlay">
                  <span><i className="fa-solid fa-magnifying-glass-plus"></i> Show Credential</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Connect & Contact Section */}
      <section id="contact">
        <span className="section-overline">07. Next Steps</span>
        <h2 className="section-title">Connect / Contact</h2>
        <div className="contact-layout">
          <div className="contact-info">
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '10px' }}>
              Let's work together or just say hello! I'm always open to talking about backend system designs, Python scripting, or learning loops.
            </p>
            <div className="contact-card">
              <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div className="contact-details">
                <h4>Location</h4>
                <p>Casablanca, Morocco</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
              <div className="contact-details">
                <h4>Email</h4>
                <p><a href="mailto:obaidbelmaaris@gmail.com" id="contact-email-link">obaidbelmaaris@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fa-brands fa-linkedin-in"></i></div>
              <div className="contact-details">
                <h4>LinkedIn</h4>
                <p><a href="https://linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer" id="contact-linkedin-link">Abdellah BELMAARIS</a></p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fa-brands fa-github"></i></div>
              <div className="contact-details">
                <h4>GitHub</h4>
                <p><a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer" id="contact-github-link">Abdellah-BELMAARIS</a></p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit} id="contact-form">
            <div className="form-group">
              <label htmlFor="form-name">Name</label>
              <input
                type="text"
                id="form-name"
                className="form-control"
                placeholder="Your Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-email">Email</label>
              <input
                type="email"
                id="form-email"
                className="form-control"
                placeholder="Your Email Address"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-message">Message</label>
              <textarea
                id="form-message"
                className="form-control"
                placeholder="Write your message here..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                required
              ></textarea>
            </div>
            {formStatus && (
              <div className={`form-status ${formStatus.type}`}>
                {formStatus.text}
              </div>
            )}
            <button type="submit" className="btn btn-primary" id="contact-submit-btn" style={{ width: 'fit-content', alignSelf: 'flex-start' }}>
              <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <ul className="footer-socials">
          <li>
            <a
              href="https://linkedin.com/in/abdellah-belmaaris"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Visit LinkedIn Profile"
              id="footer-linkedin-link"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Abdellah-BELMAARIS"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Visit GitHub Profile"
              id="footer-github-link"
            >
              <i className="fa-brands fa-github"></i>
            </a>
          </li>
          <li>
            <a
              href="mailto:obaidbelmaaris@gmail.com"
              className="footer-social-link"
              aria-label="Send Email"
              id="footer-email-link"
            >
              <i className="fa-solid fa-envelope"></i>
            </a>
          </li>
        </ul>
        <p className="footer-copy">
          Designed & Built by{' '}
          <a href="#hero" style={{ color: 'var(--accent)' }}>Abdellah BELMAARIS</a>
          {' '}· © {new Date().getFullYear()}
        </p>
      </footer>

      {/* Scroll-to-top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            id="scroll-to-top-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-chevron-up"></i>
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
              <button className="modal-close" aria-label="Close modal" id="cert-modal-close"><i className="fa-solid fa-xmark"></i></button>
              <img src={selectedCert} alt="Enlarged Certificate" className="modal-img" />
            </div>
          </motion.div>
        )}

        {/* Video Walkthrough Modal */}
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
                  <i className="fa-solid fa-circle-play" style={{ color: 'var(--accent)', marginRight: '8px' }}></i>
                  Project Walkthrough Demos
                </h3>
                <button className="video-modal-close" aria-label="Close video player" id="video-modal-close-btn"><i className="fa-solid fa-xmark"></i></button>
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
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="video-modal-screen">
                <video src={videoSrc} controls autoPlay playsInline></video>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
