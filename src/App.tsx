import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import CaseStudyModal from './components/CaseStudyModal';
import AiDevTerminal from './components/AiDevTerminal';

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

interface SkillItem {
  name: string;
  detail: string;
}

interface SkillGroup {
  id: string;
  category: string;
  title: string;
  desc: string;
  icon: string;
  iconClass: string;
  skills: SkillItem[];
}

interface StructuredProject {
  id: string;
  title: string;
  subtitle: string;
  type: 'Professional Work' | 'Selected Project';
  badge: string;
  role: string;
  problem: string;
  solution: string;
  keyChallenge: string;
  metrics: string[];
  tech: string[];
  github?: string;
  live?: string;
  isPrivate?: boolean;
  hasCaseStudy?: boolean;
  hasVideoDemo?: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STRUCTURED_PROJECTS: StructuredProject[] = [
  {
    id: "bimpulse-platform",
    title: "BIMPulse Digital Engineering & Web Platform",
    subtitle: "Internal web applications & IFC data utilities supporting AEC digital transformation",
    type: "Professional Work",
    badge: "Professional Work · BIMPulse",
    role: "Junior Full-Stack Developer",
    problem: "AEC engineering projects generate complex multidimensional BIM models and IFC datasets that require centralized web access, validation, and real-time project collaboration.",
    solution: "Developing responsive web applications, relational database schemas, and RESTful APIs in Python/Django and React to bridge BIM engineering workflows with live web collaboration.",
    keyChallenge: "Handling complex relational data schemas adhering strictly to open IFC standards, optimizing query throughput for engineering datasets.",
    metrics: [
      "Enterprise AEC Tooling: Real-world engineering project delivery",
      "IFC & BIM Compliance: Aligned with international building standards",
      "Full-Stack Architecture: Python, Django REST, PostgreSQL, React"
    ],
    tech: ["Python", "Django REST Framework", "PostgreSQL", "React", "TypeScript", "BIM & IFC Standards", "Git"],
    isPrivate: true,
    live: "https://www.thebimpulse.com/"
  },
  {
    id: "modern-journal",
    title: "The Modern Journal — Content & Publishing Platform",
    subtitle: "Secure high-throughput CMS with 14-role RBAC, query optimization & automated workflows",
    type: "Selected Project",
    badge: "Selected Project · Backend & Architecture",
    role: "Lead Full-Stack Developer",
    problem: "Publishing platforms frequently suffer from severe database latency under concurrent reader traffic, N+1 query bottlenecks, and brittle permission structures.",
    solution: "Engineered a production-ready Django CMS featuring fine-grained role-based access control (RBAC), automated transactional emails, session security, and full-text search indexing.",
    keyChallenge: "Resolved catastrophic N+1 query loops using select_related, prefetch_related, and selective database indexing across interdependent publication models.",
    metrics: [
      "14 User Role Permissions: Multi-tier access control matrix",
      "68% Latency Reduction: N+1 resolution down to sub-50ms query times",
      "100% Security Audit: Session token auth, CSRF/XSS protection"
    ],
    tech: ["Django", "Django REST Framework", "Python", "SQL", "Bootstrap 5", "JavaScript"],
    github: "https://github.com/Abdellah-BELMAARIS/modern-journal.github.io",
    live: "https://abdellah-belmaaris.github.io/modern-journal.github.io/",
    hasCaseStudy: true,
    hasVideoDemo: true
  },
  {
    id: "school-management",
    title: "Academy & School Management Platform",
    subtitle: "Modular MVC administrative backend with multi-role isolation & automated testing",
    type: "Selected Project",
    badge: "Selected Project · System Design",
    role: "Full-Stack Developer",
    problem: "Educational platforms often face fragile relational schemas when managing courses, grades, faculty records, and student portals simultaneously.",
    solution: "Designed and implemented a modular MVC system in Django with customized relational schemas, multi-tier authentication middleware, and robust form validation.",
    keyChallenge: "Enforcing strict database normalization across courses, enrollments, and faculty assignments while maintaining transactional integrity.",
    metrics: [
      "3-Tier Role Separation: Independent Admin, Faculty & Student workflows",
      "36/36 Unit Tests Passing: Automated test coverage for enrollments & auth",
      "Zero Data Inconsistency: Enforced relational constraints & atomic blocks"
    ],
    tech: ["Django", "Python", "PostgreSQL", "SQL", "Bootstrap 5", "MVC Architecture"],
    github: "https://github.com/Abdellah-BELMAARIS"
  },
  {
    id: "pygame-arcade",
    title: "PyGame 3D Web Arcade & WASM Console",
    subtitle: "3D retro arcade cabinet interface hosting 16 WebAssembly-compiled Python games",
    type: "Selected Project",
    badge: "Selected Project · 3D Web & WASM",
    role: "Frontend & 3D Web Developer",
    problem: "Desktop PyGame projects cannot run in web browsers without complex local Python runtimes and manual user installations.",
    solution: "Built a high-performance 3D arcade cabinet selector in React Three Fiber, compiling 16 native Python PyGame classics to WebAssembly via Pygbag with real-time browser deck controls.",
    keyChallenge: "Optimizing WebGL shader pipelines and audio buffers to execute alongside WASM threads at steady framerates across both mobile and desktop.",
    metrics: [
      "16 Python Classics: Compiled to client-side WebAssembly",
      "Locked 60 FPS: Dynamic Three.js lighting & responsive controls",
      "Zero-Install: Runs instantly in any standard web browser"
    ],
    tech: ["React Three Fiber", "Three.js", "Python", "WebAssembly (Pygbag)", "TypeScript", "Vite"],
    github: "https://github.com/Abdellah-BELMAARIS/PyGame_Projects",
    live: "https://Abdellah-BELMAARIS.github.io/PyGame_Projects/"
  },
  {
    id: "dev-pulse",
    title: "Dev-Pulse — Developer Activity Telemetry Engine",
    subtitle: "Local developer log aggregation pipeline with sub-200ms visual analytical reports",
    type: "Selected Project",
    badge: "Selected Project · Data Engineering",
    role: "Python & Data Engineer",
    problem: "Developers lack lightweight, privacy-first telemetry to understand their coding distribution without leaking sensitive data to external SaaS clouds.",
    solution: "Engineered a local Python data pipeline that parses unstructured system logs, cleans high-dimensional activity streams with Pandas, and generates Matplotlib visual performance reports.",
    keyChallenge: "Streaming multi-megabyte log files with regex tokenization and statistical grouping under strict sub-second performance budgets.",
    metrics: [
      "<200ms Report Generation: High-throughput Pandas data parsing",
      "100% Privacy-First: All computation executes strictly on local hardware",
      "Automated Visualization: Clean statistical charts with Matplotlib"
    ],
    tech: ["Python", "Pandas", "Matplotlib", "Data Pipelines", "Regex Tokenization"],
    github: "https://github.com/Abdellah-BELMAARIS/Dev-Pulse"
  }
];

const ORGANIZED_SKILLS: SkillGroup[] = [
  {
    id: "core-fullstack",
    category: "Primary Stack",
    title: "Core Full-Stack Engineering",
    desc: "Production web architectures, backend systems, and modern reactive client applications.",
    icon: "fa-solid fa-server",
    iconClass: "icon-core",
    skills: [
      { name: "Python (Async & OOP)", detail: "PEP-8 compliant modular programming, design patterns, clean architecture" },
      { name: "Django & Django REST Framework", detail: "High-throughput APIs, JWT auth, RBAC authorization, custom middleware" },
      { name: "React 19 & TypeScript", detail: "Type-safe component design, hooks, state management, modern SPA architecture" },
      { name: "JavaScript (ES6+)", detail: "Modern asynchronous workflows, DOM optimization, API integrations" },
      { name: "SQL & PostgreSQL", detail: "Relational schema design, normalization, query optimization, indexing" }
    ]
  },
  {
    id: "frontend-ui",
    category: "User Experience",
    title: "Frontend & UI Engineering",
    desc: "Accessible, responsive, and performant user interfaces built for modern web standards.",
    icon: "fa-solid fa-laptop-code",
    iconClass: "icon-frontend",
    skills: [
      { name: "HTML5 & Semantic Web", detail: "Accessible structure, SEO best practices, semantic markup hierarchy" },
      { name: "Modern CSS3 & Animations", detail: "Flexbox, CSS Grid, custom properties, glassmorphism, micro-animations" },
      { name: "Responsive & Mobile-First", detail: "Fluid layouts across mobile, tablet, desktop, and 4K displays" },
      { name: "Bootstrap 5 & UI Systems", detail: "Rapid UI prototyping, theme customizers, consistent design tokens" },
      { name: "Three.js & 3D Web", detail: "Interactive WebGL canvases, particle systems, real-time spatial rendering" }
    ]
  },
  {
    id: "data-ai",
    category: "Supporting Discipline",
    title: "Data Analysis & Applied AI",
    desc: "Valuable supporting capabilities for processing complex data, telemetry, and intelligent pipelines.",
    icon: "fa-solid fa-brain",
    iconClass: "icon-data",
    skills: [
      { name: "Data Analysis with Pandas", detail: "Cleaning, filtering, transforming, and aggregating high-dimensional data" },
      { name: "Data Visualization (Matplotlib)", detail: "Statistical reports, performance charts, telemetry dashboard generation" },
      { name: "Applied AI & LLM Systems", detail: "Prompt engineering, RAG concepts, structured outputs, AI assistant design" },
      { name: "DataCamp Certified Track", detail: "Certified AI Engineer for Developers & Python Data Associate credentials" },
      { name: "Cybersecurity Fundamentals", detail: "Secure session management, CSRF/XSS mitigation, access controls" }
    ]
  },
  {
    id: "tools-devops",
    category: "Workflow & Quality",
    title: "DevOps, Architecture & Tools",
    desc: "Development environment, version control, software patterns, and testing discipline.",
    icon: "fa-solid fa-toolbox",
    iconClass: "icon-tools",
    skills: [
      { name: "Git & GitHub Workflow", detail: "Branching strategies, pull requests, semantic commits, code reviews" },
      { name: "Docker Containerization", detail: "Reproducible development environments, container basics, deployment" },
      { name: "Linux & Terminal / Bash", detail: "CLI workflows, shell scripting, environment configuration, server basics" },
      { name: "Software Design Patterns", detail: "Factory, Strategy, Singleton, modular separation of concerns" },
      { name: "Automated Testing & QA", detail: "Unit testing, integration tests, automated test suites, regression prevention" }
    ]
  }
];



const STATS_DATA: Stat[] = [
  { value: 6, suffix: '+', label: 'Years Coding', icon: 'fa-solid fa-calendar-days' },
  { value: 4, suffix: '+', label: 'Production Projects', icon: 'fa-solid fa-folder-open' },
  { value: 14, suffix: '', label: 'RBAC Roles Built', icon: 'fa-solid fa-shield-halved' },
  { value: 4, suffix: '', label: 'Certifications', icon: 'fa-solid fa-award' },
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

const INSIGHTS_DATA = [
  { title: 'Building reliable Django APIs', desc: 'Notes on authentication, permissions, query optimization, and maintainable backend structure.', icon: 'fa-solid fa-server', tag: 'Backend', href: 'https://github.com/Abdellah-BELMAARIS' },
  { title: 'Learning through data projects', desc: 'Practical experiments with Python, Pandas, and visualization to turn raw data into useful decisions.', icon: 'fa-solid fa-chart-line', tag: 'Data', href: 'https://github.com/Abdellah-BELMAARIS' },
  { title: 'A deliberate learning system', desc: 'How focused projects, documentation, and continuous research support long-term engineering growth.', icon: 'fa-solid fa-lightbulb', tag: 'Growth', href: 'https://github.com/Abdellah-BELMAARIS' },
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
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

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
  const [projectTypeFilter, setProjectTypeFilter] = useState<'All' | 'Professional Work' | 'Selected Project'>('All');
  const [projectFilter, setProjectFilter] = useState<'All' | OtherProject['category']>('All');
  const [projectSearch, setProjectSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState<'All' | Skill['category']>('All');
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);

  const filteredStructuredProjects = STRUCTURED_PROJECTS.filter((proj) => {
    const matchesType = projectTypeFilter === 'All' || proj.type === projectTypeFilter;
    const q = projectSearch.trim().toLowerCase();
    return matchesType && (!q || `${proj.title} ${proj.subtitle} ${proj.problem} ${proj.solution} ${proj.tech.join(' ')}`.toLowerCase().includes(q));
  });

  const filteredProjects = OTHER_PROJECTS.filter((project) => {
    const matchesFilter = projectFilter === 'All' || project.category === projectFilter;
    const query = projectSearch.trim().toLowerCase();
    return matchesFilter && (!query || `${project.title} ${project.desc} ${project.tech.join(' ')}`.toLowerCase().includes(query));
  });

  const filteredSkills = SKILLS_DATA.filter((s) => skillFilter === 'All' || s.category === skillFilter);

  // Modal control states
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('assets/demo1.mp4');

  // Contact form submission states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist the visitor's display preference without blocking the initial render.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Public GitHub data requires no credentials and keeps the portfolio current.
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/users/Abdellah-BELMAARIS/repos?sort=updated&per_page=6', { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('GitHub request failed')))
      .then((repos: GitHubRepo[]) => setGithubRepos(repos.filter((repo) => repo.name !== 'abdellah-belmaaris.github.io').slice(0, 4)))
      .catch(() => setGithubRepos([]))
      .finally(() => setGithubLoading(false));
    return () => controller.abort();
  }, []);

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
    const fullHeadline = "Junior Full-Stack Developer @ BIMPulse";

    if (prefersReducedMotion) {
      // Queue this update so the effect remains a synchronization boundary.
      const frame = window.requestAnimationFrame(() => {
        setWelcomeText(fullWelcome);
        setNameText(fullName);
        setHeadlineText(fullHeadline);
        setTypingLine('done');
      });
      return () => window.cancelAnimationFrame(frame);
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
        await new Promise((resolve) => setTimeout(resolve, 14));
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
      const sections = ['hero', 'about', 'experience', 'project', 'skills', 'certifications', 'ai-terminal', 'contact'];
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
    if (website.trim()) return; // Honeypot: silently ignore automated submissions.
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim() || isSubmitting) {
      setFormStatus({ type: 'error', text: 'Please complete every field before sending.' });
      return;
    }
    if (formMessage.trim().length < 20) {
      setFormStatus({ type: 'error', text: 'Please write a little more detail (at least 20 characters).' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: 'info', text: 'Sending message…' });

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
          message: formMessage,
          _subject: `Portfolio message from ${formName.trim()}`
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
        text: 'Unable to send right now. Please email me directly instead.'
      });
    } finally {
      setIsSubmitting(false);
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
      <a className="skip-link" href="#main-content">Skip to main content</a>
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
        <div className="header-actions">
          <a
            href="assets/Abdellah_BELMAARIS_CV.pdf"
            className="header-resume-btn"
            download
            id="header-cv-btn"
            title="Download Abdellah BELMAARIS CV (PDF)"
          >
            <i className="fa-solid fa-file-arrow-down" /> CV
          </a>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
          </button>
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
        </div>
        <nav aria-label="Primary navigation">
          <ul className={`nav-list ${menuActive ? 'active' : ''}`}>
            {[
              { id: 'hero', label: 'Home', idx: '01.' },
              { id: 'about', label: 'About', idx: '02.' },
              { id: 'experience', label: 'Experience', idx: '03.' },
              { id: 'project', label: 'Projects', idx: '04.' },
              { id: 'skills', label: 'Skills', idx: '05.' },
              { id: 'certifications', label: 'Certifications', idx: '06.' },
              { id: 'ai-terminal', label: 'AI Console', idx: '07.' },
              { id: 'contact', label: 'Contact', idx: '08.' }
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

      <main id="main-content">
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-specialty-badge">
          <i className="fa-solid fa-briefcase" /> JUNIOR FULL-STACK DEVELOPER @ BIMPULSE DIGITAL
        </div>
        <span className={`hero-welcome ${typingLine === 'welcome' ? 'typing-active' : ''}`}>
          {welcomeText}
        </span>
        <h1 className={`hero-name ${typingLine === 'name' ? 'typing-active' : ''}`}>
          {nameText}
        </h1>
        <p className={`hero-headline ${typingLine === 'headline' ? 'typing-active' : ''}`}>
          {headlineText}
        </p>
        <p className="hero-subheadline">
          Building modern digital solutions with Python, Django, React &amp; TypeScript. Developing enterprise web applications and operational tools supporting AEC digital transformation and BIM engineering workflows.
        </p>
        <div className="hero-location">
          <i className="fa-solid fa-location-dot"></i> Casablanca, Morocco
          <span className="availability-badge"><span className="availability-dot" /> Open to Junior Full-Stack Opportunities</span>
        </div>

        <div className="hero-stack-ticker">
          <span className="hero-stack-pill dev"><i className="fa-brands fa-python" /> Python &amp; Django DRF</span>
          <span className="hero-stack-pill dev"><i className="fa-brands fa-react" /> React 19 &amp; TypeScript</span>
          <span className="hero-stack-pill dev"><i className="fa-solid fa-database" /> PostgreSQL &amp; SQL</span>
          <span className="hero-stack-pill ai"><i className="fa-solid fa-chart-line" /> Data Analysis (Pandas)</span>
          <span className="hero-stack-pill ai"><i className="fa-solid fa-brain" /> Applied AI Fundamentals</span>
          <span className="hero-stack-pill dev"><i className="fa-brands fa-docker" /> Docker &amp; Git</span>
        </div>

        <div className="hero-buttons">
          <a href="#project" className="btn btn-primary" id="hero-view-work-btn">
            <i className="fa-solid fa-layer-group" style={{ marginRight: '8px' }} /> Explore Projects
          </a>
          <a href="#experience" className="btn btn-secondary" id="hero-exp-btn">
            <i className="fa-solid fa-building" style={{ marginRight: '8px' }} /> BIMPulse Experience
          </a>
          <a href="assets/Abdellah_BELMAARIS_CV.pdf" className="btn btn-resume" download id="hero-resume-btn">
            <i className="fa-solid fa-file-arrow-down" style={{ marginRight: '8px' }} /> Download CV
          </a>
          <a href="#contact" className="btn btn-secondary" id="hero-connect-btn">Let's Connect</a>
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
        <span className="section-overline">02. Profile Overview</span>
        <h2 className="section-title">About Me</h2>
        <div className="about-layout">
          <div className="about-text">
            <p>
              I’m a Junior Full-Stack Developer from <span className="highlight">Casablanca, Morocco</span>, currently building enterprise digital tools and web applications at <span className="highlight">BIMPulse</span>. My work bridges robust backend systems with modern, responsive user experiences.
            </p>
            <p>
              My primary stack centers on <span className="highlight">Python, Django REST Framework, PostgreSQL, React, and TypeScript</span>. At BIMPulse, I contribute to real-world software engineering solutions aligned with BIM and IFC engineering standards. I also leverage applied <span className="highlight">Data Analysis (Pandas, Matplotlib)</span> and <span className="highlight">AI fundamentals</span> (DataCamp Certified AI Engineer Associate) as supporting tools to extract value from complex engineering data.
            </p>
            <p>
              I focus on building real, testable software that solves tangible problems—delivering clean architectures, optimized database models, and measurable business impact.
            </p>
            <div style={{ marginTop: '16px', marginBottom: '20px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '8px' }}>
                <i className="fa-solid fa-star" style={{ marginRight: '6px' }}></i>Core Disciplines:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {["Junior Full-Stack Developer @ BIMPulse", "Python & Django DRF", "React & TypeScript", "PostgreSQL & SQL", "AEC & BIM Standards", "Data Analysis (Pandas)", "DataCamp AI Certified"].map((skill) => (
                  <span className="exp-skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
            <div className="about-cta-row">
              <a
                href="#experience"
                className="btn btn-primary"
                id="about-view-exp-btn"
                style={{ marginRight: '12px' }}
              >
                <i className="fa-solid fa-building" style={{ marginRight: '8px' }}></i>
                View Experience
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
        <span className="section-overline">03. Professional Journey</span>
        <h2 className="section-title">Experience</h2>
        <div className="experience-timeline">

          {/* Flagship Role: Junior Full-Stack Developer - BIMPulse */}
          <motion.div
            className="exp-card exp-flagship spotlight-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="exp-flagship-badge">
              <i className="fa-solid fa-briefcase" /> Current Professional Focus · Flagship Experience
            </div>
            <div className="exp-header">
              <div className="exp-role-info">
                <div className="exp-company-brand">
                  <img src="assets/bimpulse-logo.png" alt="BIMPulse Digital" className="exp-bimpulse-logo" />
                  <div>
                    <h3 className="exp-role">Junior Full-Stack Developer</h3>
                    <span className="exp-company">BIMPulse Digital · Full-time</span>
                  </div>
                </div>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> Present</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Casablanca, Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Developing practical web applications, building robust full-stack solutions, and creating responsive user interfaces backed by performant Python and Django backend services. Collaborating closely on software products, database modeling, and scalable architecture supporting AEC (Architecture, Engineering &amp; Construction) digital transformation and BIM engineering workflows.
            </p>

            <ul className="exp-bullet-list">
              <li className="exp-bullet-item">
                <i className="fa-solid fa-circle-check exp-bullet-icon" />
                <span><strong>Enterprise Full-Stack Architecture:</strong> Engineered end-to-end features connecting Django REST Framework and PostgreSQL to modern, reactive interfaces with token authentication.</span>
              </li>
              <li className="exp-bullet-item">
                <i className="fa-solid fa-circle-check exp-bullet-icon" />
                <span><strong>AEC &amp; BIM Engineering Support:</strong> Designed relational data models that support open IFC standards, project workflows, and team collaboration for digital engineering.</span>
              </li>
              <li className="exp-bullet-item">
                <i className="fa-solid fa-circle-check exp-bullet-icon" />
                <span><strong>Reliability &amp; Performance:</strong> Reduced database latency with query optimizations, enforced strict validation, and maintained clean software modularity.</span>
              </li>
            </ul>

            <div className="exp-skills">
              {["Full-Stack Development", "Python", "Django & DRF", "PostgreSQL", "React", "TypeScript", "AEC Digital Transformation", "IFC Standards", "REST APIs", "Git"].map((s) => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>

            <div className="exp-actions-row">
              <a
                className="btn btn-primary"
                href="https://www.thebimpulse.com/"
                target="_blank"
                rel="noopener noreferrer"
                id="bimpulse-visit-btn"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: '8px' }} />
                Discover BIMPulse
              </a>
              <span className="private-repo-note">
                <i className="fa-solid fa-shield-halved" /> Real-world enterprise engineering &amp; digital solutions
              </span>
            </div>
          </motion.div>

          {/* Django Developer */}
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
                <h3 className="exp-role">Django Developer</h3>
                <span className="exp-company">Self-employed · Remote</span>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> May 2026 – Present</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Casablanca, Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Building secure, high-performance web applications and backend systems using Django and Django REST Framework. Optimizing database queries, designing relational schemas, and developing robust RESTful APIs.
            </p>
            <div className="exp-skills">
              {["Django", "Django REST Framework", "Python", "REST APIs", "SQL", "Git", "Backend Development"].map((s) => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Python Developer */}
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
                <h3 className="exp-role">Python Developer</h3>
                <span className="exp-company">Self-employed · Full-time</span>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> Jan 2020 – Present</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Building Python programs, automation scripts, data analysis pipelines, and software utilities. Continuously growing expertise across the Python ecosystem—from advanced object-oriented programming (OOP) to machine learning and AI integrations.
            </p>
            <div className="exp-skills">
              {["Python (OOP)", "Program Development", "Data Analysis", "Automation Scripts", "Git", "Software Architecture"].map((s) => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Web Developer */}
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
                <h3 className="exp-role">Web Developer</h3>
                <span className="exp-company">Self-employed · Remote</span>
              </div>
              <div className="exp-meta">
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> Feb 2023 – Jun 2026</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Casablanca-Settat, Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Developed full-stack web applications, translating product requirements into structured backends and responsive frontends. Focused on web application architecture, Bootstrap integration, and delivering clean, maintainable codebases aligned with modern standards.
            </p>
            <div className="exp-skills">
              {["Web Application Development", "Django", "Bootstrap 5", "HTML5 & CSS3", "REST APIs"].map((s) => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Back End Developer */}
          <motion.div
            className="exp-card spotlight-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.3 }}
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
                <span className="exp-duration"><i className="fa-solid fa-calendar-days"></i> May 2021 – May 2026</span>
                <span className="exp-location"><i className="fa-solid fa-location-dot"></i> Morocco</span>
              </div>
            </div>
            <p className="exp-desc">
              Designed and built secure RESTful APIs and backend architectures using Django and Django REST Framework. Implemented token-based authentication, role-based permissions, database schema design, and server-side business logic across multiple web projects.
            </p>
            <div className="exp-skills">
              {["Django & DRF", "Python", "SQL & Relational DBs", "PostgreSQL", "OOP Patterns", "Authentication & Security"].map((s) => (
                <span className="exp-skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Featured & Production Projects Section */}
      <section id="project">
        <span className="section-overline">04. Production Showcase</span>
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-intro">
          Production software solutions, enterprise engineering, and selected platforms built with measurable outcomes, query optimizations, and robust role-based architectures.
        </p>

        {/* Filter between Professional Work and Selected Projects */}
        <div className="projects-type-filter" role="tablist" aria-label="Filter projects by origin">
          {[
            { id: 'All', label: 'All Projects', count: STRUCTURED_PROJECTS.length, icon: 'fa-solid fa-layer-group' },
            { id: 'Professional Work', label: '🏢 Professional Work', count: STRUCTURED_PROJECTS.filter(p => p.type === 'Professional Work').length, icon: 'fa-solid fa-briefcase' },
            { id: 'Selected Project', label: '🚀 Selected Projects', count: STRUCTURED_PROJECTS.filter(p => p.type === 'Selected Project').length, icon: 'fa-solid fa-rocket' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`type-filter-btn ${projectTypeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setProjectTypeFilter(tab.id as typeof projectTypeFilter)}
              id={`filter-type-${tab.id.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {tab.label}
              <span className="filter-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Render Structured Project Cards */}
        <div className="structured-projects-container">
          {filteredStructuredProjects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              className="structured-project-card spotlight-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="project-card-top-bar">
                <span className={`project-category-pill ${proj.type === 'Professional Work' ? 'pill-professional' : 'pill-selected'}`}>
                  <i className={proj.type === 'Professional Work' ? 'fa-solid fa-briefcase' : 'fa-solid fa-rocket'} />
                  {proj.badge}
                </span>
                <span className="project-role-badge">
                  <i className="fa-solid fa-id-badge" style={{ marginRight: '6px' }} />
                  {proj.role}
                </span>
              </div>

              <h3 className="project-card-title">{proj.title}</h3>
              <p className="project-card-subtitle">{proj.subtitle}</p>

              {/* Special interactive screenshot carousel for The Modern Journal */}
              {proj.id === 'modern-journal' && (
                <div className="project-carousel" style={{ borderRadius: '8px', marginBottom: '24px', maxHeight: '380px' }}>
                  <div className="project-carousel-slides">
                    {PROJECT_IMAGES.map((img, sIdx) => (
                      <img
                        key={sIdx}
                        src={img}
                        className={`project-slide ${currentSlide === sIdx ? 'active' : ''}`}
                        alt={`The Modern Journal - Platform View ${sIdx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className="project-carousel-btn project-carousel-prev"
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? PROJECT_IMAGES.length - 1 : prev - 1))}
                    aria-label="Previous screenshot"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    className="project-carousel-btn project-carousel-next"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % PROJECT_IMAGES.length)}
                    aria-label="Next screenshot"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                  <div className="project-carousel-dots">
                    {PROJECT_IMAGES.map((_, sIdx) => (
                      <span
                        key={sIdx}
                        className={`project-carousel-dot ${currentSlide === sIdx ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(sIdx)}
                        role="button"
                        aria-label={`Go to slide ${sIdx + 1}`}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4-Box Engineering Breakdown */}
              <div className="project-breakdown-grid">
                <div className="breakdown-box">
                  <span className="breakdown-label">
                    <i className="fa-solid fa-circle-exclamation" /> The Problem
                  </span>
                  <p className="breakdown-text">{proj.problem}</p>
                </div>

                <div className="breakdown-box">
                  <span className="breakdown-label">
                    <i className="fa-solid fa-code" /> Solution Architecture
                  </span>
                  <p className="breakdown-text">{proj.solution}</p>
                </div>

                <div className="breakdown-box">
                  <span className="breakdown-label">
                    <i className="fa-solid fa-user-check" /> Role &amp; Execution
                  </span>
                  <p className="breakdown-text">{proj.role} — Engineered core application layers, relational data models, and system integrations.</p>
                </div>

                <div className="breakdown-box">
                  <span className="breakdown-label">
                    <i className="fa-solid fa-triangle-exclamation" /> Key Challenge Solved
                  </span>
                  <p className="breakdown-text">{proj.keyChallenge}</p>
                </div>
              </div>

              {/* Measurable Proof Metrics */}
              <div className="project-measurable-metrics">
                {proj.metrics.map((metric, mIdx) => (
                  <span key={mIdx} className="metric-pill">
                    <i className="fa-solid fa-chart-line" /> {metric}
                  </span>
                ))}
              </div>

              {/* Footer with Tech & Actions */}
              <div className="project-card-footer">
                <div className="project-tech-tags">
                  {proj.tech.map((t) => (
                    <span className="exp-skill-tag" key={t}>{t}</span>
                  ))}
                </div>

                <div className="project-action-buttons">
                  {proj.hasCaseStudy && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setCaseStudyOpen(true)}
                      id={`case-study-btn-${proj.id}`}
                    >
                      <i className="fa-solid fa-gears" style={{ marginRight: '8px' }}></i> Technical Case Study
                    </button>
                  )}
                  {proj.hasVideoDemo && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setVideoModalOpen(true)}
                      id={`demo-btn-${proj.id}`}
                    >
                      <i className="fa-solid fa-circle-play" style={{ marginRight: '8px' }}></i> Video Demo
                    </button>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      id={`github-btn-${proj.id}`}
                    >
                      <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i> GitHub Repo
                    </a>
                  )}
                  {proj.live && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      id={`live-btn-${proj.id}`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: '8px' }}></i>
                      {proj.type === 'Professional Work' ? 'Visit BIMPulse' : 'Live Demo'}
                    </a>
                  )}
                  {proj.isPrivate && (
                    <span className="private-repo-note">
                      <i className="fa-solid fa-lock" /> Enterprise Proprietary Codebase
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section: 4-Group Organized Matrix */}
      <section id="skills">
        <span className="section-overline">05. Stack &amp; Capabilities</span>
        <h2 className="section-title">Technical Capabilities</h2>
        <p className="section-intro">
          Organized into core engineering disciplines rather than an unsorted list. Highlights primary full-stack production foundations alongside applied data and operational tools.
        </p>

        <div className="skills-organized-grid">
          {ORGANIZED_SKILLS.map((group, idx) => (
            <motion.div
              key={group.id}
              className="skills-group-card spotlight-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <div className="skills-group-header">
                <div className={`skills-group-icon ${group.iconClass}`}>
                  <i className={group.icon}></i>
                </div>
                <div>
                  <span className="skills-group-tag">{group.category}</span>
                  <h3 className="skills-group-title">{group.title}</h3>
                </div>
              </div>
              <p className="skills-group-desc">{group.desc}</p>

              <div className="skills-items-list">
                {group.skills.map((skill, sIdx) => (
                  <div className="skill-item-row" key={sIdx}>
                    <div className="skill-item-dot" />
                    <div className="skill-item-content">
                      <span className="skill-item-name">{skill.name}</span>
                      <span className="skill-item-detail">{skill.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section id="certifications">
        <span className="section-overline">06. Credentials &amp; Academics</span>
        <h2 className="section-title">Education &amp; Certifications</h2>
        <p className="section-intro">
          Verified industry credentials and specialized engineering tracks validating applied AI engineering, Python data analysis, and backend system development.
        </p>

        {/* Licenses & Certifications Subsection First */}
        <h3 className="subsection-title" style={{ fontSize: '1.3rem', marginTop: '30px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-award" style={{ color: 'var(--accent)' }}></i> Licenses &amp; Certifications
        </h3>
        <div className="education-grid" style={{ marginTop: '20px', marginBottom: '50px' }}>
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

        {/* Education Subsection */}
        <h3 className="subsection-title" style={{ fontSize: '1.3rem', marginTop: '40px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent)' }}></i> Education &amp; Specialized Tracks
        </h3>
        <div className="education-grid" style={{ marginTop: '20px' }}>
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
      </section>

      {/* Interactive AI & Engineering Console Section */}
      <section id="ai-terminal">
        <span className="section-overline">07. Interactive Intelligence</span>
        <h2 className="section-title">AI &amp; Engineering Console</h2>
        <p className="section-intro">
          Test a live interactive simulation of my Full-Stack &amp; AI architecture. Query preset prompts or test custom queries regarding backend patterns, RAG pipelines, and certified credentials.
        </p>
        <AiDevTerminal />
      </section>

      {/* Learning Journal Section */}
      <section id="insights">
        <span className="section-overline">08. Notes &amp; Architecture</span>
        <h2 className="section-title">Engineering Journal</h2>
        <div className="insights-grid">
          {INSIGHTS_DATA.map((insight) => (
            <a className="insight-card spotlight-card" href={insight.href} target="_blank" rel="noopener noreferrer" key={insight.title}>
              <div className="insight-icon"><i className={insight.icon} aria-hidden="true" /></div>
              <span className="insight-tag">{insight.tag}</span>
              <h3>{insight.title}</h3>
              <p>{insight.desc}</p>
              <span className="insight-link">Read on GitHub <i className="fa-solid fa-arrow-up-right-from-square" /></span>
            </a>
          ))}
        </div>
      </section>

      {/* Live GitHub Section */}
      <section id="github">
        <span className="section-overline">08. Open Source &amp; Code</span>
        <h2 className="section-title">Recent GitHub Work</h2>
        <p className="section-intro">Real public repositories, loaded directly from GitHub. Explore the code, commits, and documentation behind my projects.</p>
        {githubLoading ? <p className="github-state">Loading recent repositories…</p> : githubRepos.length > 0 ? (
          <div className="github-grid">
            {githubRepos.map((repo) => (
              <a className="github-repo-card spotlight-card" href={repo.html_url} target="_blank" rel="noopener noreferrer" key={repo.name}>
                <div className="github-repo-heading"><i className="fa-brands fa-github" aria-hidden="true" /><i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></div>
                <h3>{repo.name}</h3>
                <p>{repo.description || 'Public project repository.'}</p>
                <div className="github-repo-meta"><span>{repo.language || 'Code'}</span><span><i className="fa-solid fa-star" /> {repo.stargazers_count}</span><span><i className="fa-solid fa-code-fork" /> {repo.forks_count}</span></div>
              </a>
            ))}
          </div>
        ) : <p className="github-state">GitHub is temporarily unavailable. <a href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer">View my profile directly</a>.</p>}
        <a className="btn btn-secondary github-profile-btn" href="https://github.com/Abdellah-BELMAARIS" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github" /> View full GitHub profile</a>
      </section>

      {/* Connect & Contact Section */}
      <section id="contact">
        <span className="section-overline">09. Get in Touch</span>
        <h2 className="section-title">Connect / Contact</h2>
        <div className="contact-layout">
          <div className="contact-info">
            <p style={{ fontSize: '1.05rem', lineHeight: '1.65', marginBottom: '20px', color: 'var(--text-primary)' }}>
              Interested in junior full-stack opportunities, engineering collaborations, or digital product development? Let's connect.
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
            <div className="contact-card">
              <div className="contact-icon"><i className="fa-solid fa-file-pdf"></i></div>
              <div className="contact-details">
                <h4>Curriculum Vitae</h4>
                <p><a href="assets/Abdellah_BELMAARIS_CV.pdf" download id="contact-cv-link" style={{ color: 'var(--accent)', fontWeight: 600 }}><i className="fa-solid fa-download" style={{ marginRight: '6px' }} /> Download CV (PDF)</a></p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit} id="contact-form">
            <div className="form-group honeypot" aria-hidden="true">
              <label htmlFor="form-website">Website</label>
              <input id="form-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="form-name">Name</label>
              <input
                type="text"
                id="form-name"
                className="form-control"
                placeholder="Your Name"
                autoComplete="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                maxLength={80}
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-email">Email</label>
              <input
                type="email"
                id="form-email"
                className="form-control"
                placeholder="Your Email Address"
                autoComplete="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
                maxLength={160}
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-message">Message</label>
              <textarea
                id="form-message"
                className="form-control"
                placeholder="Write your message here..."
                autoComplete="off"
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
              ></textarea>
            </div>
            {formStatus && (
              <div className={`form-status ${formStatus.type}`} role="status" aria-live="polite">
                {formStatus.text}
              </div>
            )}
            <button type="submit" className="btn btn-primary" id="contact-submit-btn" style={{ width: 'fit-content', alignSelf: 'flex-start' }} disabled={isSubmitting}>
              <i className={`fa-solid ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} style={{ marginRight: '8px' }}></i>
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      </main>

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
