import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';

// Types & Data
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
    degree: "Associate's Degree, Backend developper",
    date: "Jan 2023 – May 2026",
    icon: "fa-solid fa-user-gear",
    skills: ["Python (Programming Language)", "Deep Learning Fundamentals", "Neural Networks", "Machine Learning", "Git & GitHub", "Docker", "Backend Architecture"]
  },
  {
    platform: "DataCamp",
    degree: "Associate's Degree, Backend developper",
    date: "Self-Paced Learning",
    icon: "fa-solid fa-graduation-cap",
    skills: ["Python (Programming Language)", "SQL", "PostgreSQL", "FastAPI", "Git", "API Development"]
  },
  {
    platform: "Self-taught",
    degree: "Associate's Degree, Django developer",
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
    credentialId: "30 HR · Associate's Degree, Django developer",
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

export default function App() {
  // Mobile Nav Active State
  const [menuActive, setMenuActive] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

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
  const [videoSrc, setVideoSrc] = useState('assets/demo1.mp4');

  // Contact form submission states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);

  // 1. Typewriter Animation logic
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fullWelcome = "Hi, my name is";
    const fullName = "Abdellah BELMAARIS.";
    const fullHeadline = "Self‑Taught Backend & Web Developer | Python Developer | Django & REST Framework Enthusiast | AI & Data Analysis Learner | Cybersecurity Fundamentals | Building Real‑World Software Solutions.";

    if (prefersReducedMotion) {
      setWelcomeText(fullWelcome);
      setNameText(fullName);
      setHeadlineText(fullHeadline);
      setTypingLine('done');
      return;
    }

    if (typingLine === 'welcome') {
      let i = 0;
      const interval = setInterval(() => {
        setWelcomeText((prev) => prev + fullWelcome.charAt(i));
        i++;
        if (i >= fullWelcome.length) {
          clearInterval(interval);
          setTimeout(() => setTypingLine('name'), 150);
        }
      }, 35);
      return () => clearInterval(interval);
    }

    if (typingLine === 'name') {
      let i = 0;
      const interval = setInterval(() => {
        setNameText((prev) => prev + fullName.charAt(i));
        i++;
        if (i >= fullName.length) {
          clearInterval(interval);
          setTimeout(() => setTypingLine('headline'), 250);
        }
      }, 55);
      return () => clearInterval(interval);
    }

    if (typingLine === 'headline') {
      let i = 0;
      const interval = setInterval(() => {
        setHeadlineText((prev) => prev + fullHeadline.charAt(i));
        i++;
        if (i >= fullHeadline.length) {
          clearInterval(interval);
          setTypingLine('done');
        }
      }, 12);
      return () => clearInterval(interval);
    }
  }, [typingLine]);

  // 2. Navigation Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'project', 'certifications', 'contact'];
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

  // 4. Contact Form Handler
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

  return (
    <>
      {/* 3D WebGL Background Canvas */}
      <ThreeBackground />

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
              { id: 'skills', label: 'Skills', idx: '03.' },
              { id: 'project', label: 'Projects', idx: '04.' },
              { id: 'certifications', label: 'Education', idx: '05.' },
              { id: 'contact', label: 'Contact', idx: '06.' }
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setMenuActive(false)}
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
          <a href="#project" className="btn btn-primary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Let's Connect</a>
          <div className="hero-social-links">
            <a
              href="https://linkedin.com/in/abdellah-belmaaris"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-icon"
              aria-label="Visit LinkedIn Profile"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a
              href="https://github.com/Abdellah-BELMAARIS"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-icon"
              aria-label="Visit GitHub Profile"
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
              Hello! I'm <span className="highlight">Abdellah BELMAARIS</span>, a self-taught backend developer driven by an insatiable curiosity for how software engineering and technical architecture come together to solve complex, real-world problems. Based in <span className="highlight">Casablanca, Morocco</span>, I specialize in crafting robust, scalable, and secure backend applications.
            </p>
            <p>
              My technical journey centers around <span className="highlight">Python, Django, and Django REST Framework</span>. I thrive on translating functional requirements into structured database designs and efficient endpoints. Over time, I've realized that solid software principles, clean architectures, and well-chosen algorithms are the keys to building long-term systems.
            </p>
            <p>
              Beyond back-end engineering, I am deeply fascinated by <span className="highlight">Artificial Intelligence and Data Analysis</span>. I frequently utilize tools like Pandas and Matplotlib to inspect datasets and draw visual insights, and I continuously study cybersecurity principles to ensure that security is baked into my development cycles from day one.
            </p>
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
      </section>

      {/* Skills Section */}
      <section id="skills">
        <span className="section-overline">03. Stack & Skills</span>
        <h2 className="section-title">Key Areas of Expertise</h2>
        <div className="skills-grid">
          {SKILLS_DATA.map((skill, index) => (
            <motion.div
              className="skill-card"
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
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
        <span className="section-overline">04. Showcase</span>
        <h2 className="section-title">Featured Project</h2>
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
              {PROJECT_IMAGES.map((_, idx) => (
                <span
                  key={idx}
                  className={`project-carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                ></span>
              ))}
            </div>
          </div>

          <div className="project-content">
            <span className="project-badge">Featured Content Management Platform</span>
            <h3 className="project-title">The Modern Journal</h3>
            <p className="project-desc">
              A full‑featured content management and blogging platform built with Django. Includes user authentication, role‑based permissions, rich text publishing, advanced search, categories and tags, comments, likes, analytics, view tracking, and email integration.
            </p>
            <ul className="project-tech-list">
              {["Django", "Django REST Framework", "SQL", "Bootstrap", "JavaScript"].map((tech) => (
                <li className="project-tech-item" key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="project-links">
              <button
                className="btn btn-primary"
                onClick={() => setVideoModalOpen(true)}
                style={{ background: 'transparent', border: '1px solid var(--accent)' }}
              >
                <i className="fa-solid fa-circle-play" style={{ marginRight: '8px' }}></i> Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section id="certifications">
        <span className="section-overline">05. Academics</span>
        <h2 className="section-title">Education & Certifications</h2>

        {/* Education Subsection */}
        <h3 className="subsection-title" style={{ fontSize: '1.3rem', marginTop: '30px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent)' }}></i> Education
        </h3>
        <div className="education-grid" style={{ marginTop: '20px', marginBottom: '50px' }}>
          {EDUCATION_DATA.map((ed, idx) => (
            <motion.div
              className="education-card spotlight-card"
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
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
              className="education-card spotlight-card"
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
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
        <span className="section-overline">06. Next Steps</span>
        <h2 className="section-title">Connect / Contact</h2>
        <div className="contact-layout">
          <div className="contact-info">
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '10px' }}>
              Let’s work together or just say hello! I'm always open to talking about backend system designs, Python scripting, or learning loops.
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
                <p><a href="mailto:obaidbelmaaris@gmail.com">obaidbelmaaris@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fa-brands fa-linkedin-in"></i></div>
              <div className="contact-details">
                <h4>LinkedIn</h4>
                <p><a href="https://linkedin.com/in/abdellah-belmaaris" target="_blank" rel="noopener noreferrer">Abdellah BELMAARIS</a></p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
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
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', alignSelf: 'flex-start' }}>
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
            >
              <i className="fa-brands fa-github"></i>
            </a>
          </li>
        </ul>
        <p className="footer-copy">© 2025 Abdellah BELMAARIS. Built with passion.</p>
      </footer>

      {/* Modals */}
      <AnimatePresence>
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
              <button className="modal-close" aria-label="Close modal"><i className="fa-solid fa-xmark"></i></button>
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
                <button className="video-modal-close" aria-label="Close video player"><i className="fa-solid fa-xmark"></i></button>
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
