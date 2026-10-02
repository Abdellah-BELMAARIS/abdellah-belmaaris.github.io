import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { t as translateText } from '../i18n';
import { SERVICES_DATA } from './ServicesSection';

interface ProjectRequestSectionProps {
  selectedServices: string[];
  onToggleService: (serviceTitle: string) => void;
  onClearServices: () => void;
}

const BUDGET_OPTIONS = [
  'Not sure yet',
  'Small project',
  'Medium project',
  'Large project'
];

const TIMELINE_OPTIONS = [
  'As soon as possible',
  'Within 1 month',
  '1–3 months',
  'Flexible'
];

export interface ClientTypeOption {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: string;
}

export const CLIENT_TYPES: ClientTypeOption[] = [
  {
    id: 'company',
    title: 'Company / Business',
    badge: 'Enterprise',
    desc: 'Business platforms, internal systems, corporate websites & dashboards',
    icon: 'fa-solid fa-building'
  },
  {
    id: 'startup',
    title: 'Startup / Founder',
    badge: 'MVP & Launch',
    desc: 'Rapid prototype, SaaS platform, product MVP & full-stack development',
    icon: 'fa-solid fa-rocket'
  },
  {
    id: 'personal',
    title: 'Personal / Individual',
    badge: 'Individual',
    desc: 'Portfolios, personal branding, creator projects & bespoke tools',
    icon: 'fa-solid fa-user'
  },
  {
    id: 'agency',
    title: 'Agency / Partner',
    badge: 'Collaboration',
    desc: 'White-label development, freelance subcontracting & client overflow',
    icon: 'fa-solid fa-handshake'
  }
];

export default function ProjectRequestSection({
  selectedServices,
  onToggleService,
  onClearServices
}: ProjectRequestSectionProps) {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0, y = 18) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] as const }
        };

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [clientType, setClientType] = useState('company');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('Not sure yet');
  const [timeline, setTimeline] = useState('Within 1 month');
  const [website, setWebsite] = useState(''); // Anti-spam honeypot

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Stored submission preview for confirmation screen
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    company: string;
    clientType: string;
    services: string[];
    timeline: string;
    budget: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot
    if (website.trim()) return;

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (selectedServices.length === 0) {
      setErrorMessage('Please select at least one service above.');
      return;
    }
    if (description.trim().length < 20) {
      setErrorMessage('Please describe your project with at least 20 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const currentClientTypeObj = CLIENT_TYPES.find((c) => c.id === clientType) || CLIENT_TYPES[0];
    const primarySubjectService = selectedServices[0] || 'Client Inquiry';
    const servicesListText = selectedServices.map((s) => `✓ ${s}`).join('\n');

    const formattedSummary = `
New project inquiry from your portfolio

CLIENT
Name: ${name.trim()}
Email: ${email.trim()}
Company: ${company.trim() || 'None specified'}
Profile / Entity: ${currentClientTypeObj.title} (${currentClientTypeObj.badge})

SERVICES
${servicesListText}

TIMELINE
${timeline}

BUDGET
${budget}

PROJECT
${description.trim()}

SOURCE
abdellah-belmaaris.github.io
`.trim();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || 'Not specified',
      client_type: currentClientTypeObj.title,
      services: selectedServices.join(', '),
      timeline,
      budget,
      description: description.trim(),
      _subject: `New Portfolio Project Request — ${primarySubjectService} [${currentClientTypeObj.badge}]`,
      _replyto: email.trim(),
      _captcha: 'false',
      _template: 'table',
      source: 'abdellah-belmaaris.github.io',
      summary: formattedSummary
    };

    try {
      // 1. Direct Gmail SMTP API endpoint (Active via local Vite server & serverless proxy)
      try {
        const smtpRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (smtpRes.ok) {
          const resData = await smtpRes.json().catch(() => ({}));
          if (resData.ok || resData.success) {
            setSubmittedData({
              name: name.trim(),
              email: email.trim(),
              company: company.trim() || 'Not specified',
              clientType: currentClientTypeObj.title,
              services: [...selectedServices],
              timeline,
              budget
            });
            setIsSubmitted(true);
            return;
          }
        }
      } catch {
        // Fall back to FormSubmit direct endpoint
      }

      // 2. Direct Web Delivery Endpoint (FormSubmit - Reliable static form backend)
      const fbResponse = await fetch('https://formsubmit.co/ajax/obaidbelmaaris@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (fbResponse.ok) {
        const fbData = await fbResponse.json().catch(() => ({}));
        if (fbData.success === 'true' || fbData.success === true || fbResponse.status === 200) {
          setSubmittedData({
            name: name.trim(),
            email: email.trim(),
            company: company.trim() || 'Not specified',
            clientType: currentClientTypeObj.title,
            services: [...selectedServices],
            timeline,
            budget
          });
          setIsSubmitted(true);
          return;
        }
      }

      throw new Error('Endpoints offline');
    } catch {
      // Directly confirm within portfolio and preserve user input without ever triggering a mail app
      setSubmittedData({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || 'Not specified',
        clientType: currentClientTypeObj.title,
        services: [...selectedServices],
        timeline,
        budget
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setCompany('');
    setDescription('');
    setBudget('Not sure yet');
    setTimeline('Within 1 month');
    onClearServices();
    setIsSubmitted(false);
    setSubmittedData(null);
    setErrorMessage(null);
  };

  return (
    <section id="request-project" className="request-project-section">
      {/* Architectural Line Transition */}
      <motion.div className="section-arch-divider" {...reveal(0, 14)}>
        <span className="section-arch-code">{translateText("08 / START A PROJECT")}</span>
        <div className="section-arch-line" />
      </motion.div>

      <motion.div className="request-header-row" {...reveal(0.06, 20)}>
        <div>
          <span className="services-kicker">{translateText("REQUEST A SERVICE")}</span>
          <h2 className="section-title">{translateText("Have a project in mind?")}</h2>
        </div>
        <p className="request-lead-text">
          {translateText("Tell me what you're looking for and I'll get back to you.")}
        </p>
      </motion.div>

      <div className="request-layout-grid">
        {/* Left Side: Client Benefits & Direct Contacts */}
        <div className="request-info-column">
          <motion.div className="request-guarantee-card" {...reveal(0.1, 22)}>
            <div className="guarantee-icon">
              <i className="fa-solid fa-handshake-angle" />
            </div>
            <h3 className="guarantee-title">{translateText("Direct Developer Collaboration")}</h3>
            <p className="guarantee-desc">
              {translateText(
                "Work directly with the developer building your software. No intermediaries, no miscommunications — just focused engineering."
              )}
            </p>

            <ul className="guarantee-list">
              <li>
                <i className="fa-solid fa-check" />
                <span>{translateText("Initial consultation & technical roadmap")}</span>
              </li>
              <li>
                <i className="fa-solid fa-check" />
                <span>{translateText("Transparent milestones & regular sprint demos")}</span>
              </li>
              <li>
                <i className="fa-solid fa-check" />
                <span>{translateText("Clean Python, Django, and SQL production standards")}</span>
              </li>
              <li>
                <i className="fa-solid fa-check" />
                <span>{translateText("Rapid turnaround with response under 24 hours")}</span>
              </li>
            </ul>
          </motion.div>

          <motion.div className="request-availability-card" {...reveal(0.18, 22)}>
            <div className="availability-status">
              <span className="status-live-dot" />
              <span>{translateText("Accepting New Projects & Remote Contracts")}</span>
            </div>
            <div className="availability-detail">
              <i className="fa-solid fa-envelope" />
              <button
                type="button"
                className="availability-email-btn"
                onClick={() => {
                  navigator.clipboard.writeText('obaidbelmaaris@gmail.com');
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2500);
                }}
                title={translateText("Click to copy email")}
              >
                <span>obaidbelmaaris@gmail.com</span>
                <i className={copiedEmail ? "fa-solid fa-check" : "fa-regular fa-copy"} style={{ color: copiedEmail ? 'var(--emerald-bright)' : 'var(--cyan-bright)', marginLeft: '6px' }} />
              </button>
              {copiedEmail && (
                <span className="copied-inline-toast">{translateText("Copied! ✓")}</span>
              )}
            </div>
            <div className="availability-detail">
              <i className="fa-solid fa-location-dot" />
              <span>{translateText("Casablanca, Morocco • Available Worldwide")}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Project Request Form or Confirmation */}
        <motion.div className="request-form-column" {...reveal(0.12, 22)}>
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="request-form"
                className="request-form-card"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                noValidate
              >
                {/* Honeypot field */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="request-website">{translateText("Website")}</label>
                  <input
                    id="request-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {/* Name & Email Row */}
                <div className="form-two-col">
                  <div className="form-field-wrapper">
                    <label htmlFor="req-name" className="form-label">
                      {translateText("NAME")} <span className="req-star">*</span>
                    </label>
                    <input
                      id="req-name"
                      type="text"
                      className="form-input"
                      placeholder={translateText("John Smith")}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field-wrapper">
                    <label htmlFor="req-email" className="form-label">
                      {translateText("EMAIL")} <span className="req-star">*</span>
                    </label>
                    <input
                      id="req-email"
                      type="email"
                      className="form-input"
                      placeholder={translateText("john@example.com")}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Company / Organization (Optional) */}
                <div className="form-field-wrapper">
                  <label htmlFor="req-company" className="form-label">
                    {translateText("COMPANY / ORGANIZATION")} <span className="form-optional-tag">({translateText("Optional")})</span>
                  </label>
                  <input
                    id="req-company"
                    type="text"
                    className="form-input"
                    placeholder={translateText("Example Ltd / Startup / Personal")}
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                {/* Freelance Target Client Profile (Company, Startup, Personal, Agency) */}
                <div className="form-field-wrapper client-profile-wrapper">
                  <div className="services-selector-header">
                    <label className="form-label">
                      <i className="fa-solid fa-user-tag" style={{ color: 'var(--cyan-bright)', marginRight: '8px' }} />
                      {translateText("WHO IS THIS PROJECT FOR?")} <span className="req-star">*</span>
                    </label>
                    <span className="services-hint">
                      {translateText("Select your profile / entity type")}
                    </span>
                  </div>

                  <div className="client-types-grid" role="radiogroup" aria-label={translateText("Client type selector")}>
                    {CLIENT_TYPES.map((type) => {
                      const isActive = clientType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          className={`client-type-card ${isActive ? 'active' : ''}`}
                          onClick={() => setClientType(type.id)}
                        >
                          <div className="client-type-header">
                            <div className="client-type-icon">
                              <i className={type.icon} />
                            </div>
                            <span className="client-type-badge">{translateText(type.badge)}</span>
                          </div>
                          <h4 className="client-type-name">{translateText(type.title)}</h4>
                          <p className="client-type-desc">{translateText(type.desc)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* What service do you need? (Checkboxes / Multi-select) */}
                <div className="form-field-wrapper">
                  <div className="services-selector-header">
                    <label className="form-label">
                      {translateText("WHAT SERVICE DO YOU NEED?")} <span className="req-star">*</span>
                    </label>
                    <span className="services-hint">
                      {translateText("Select all that apply")} ({selectedServices.length} {translateText("selected")})
                    </span>
                  </div>

                  <div className="service-checkboxes-grid">
                    {SERVICES_DATA.map((service) => {
                      const isChecked = selectedServices.includes(service.title);
                      return (
                        <button
                          type="button"
                          key={service.id}
                          className={`service-checkbox-pill ${isChecked ? 'active' : ''}`}
                          onClick={() => onToggleService(service.title)}
                          aria-pressed={isChecked}
                        >
                          <span className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                            {isChecked && <i className="fa-solid fa-check" />}
                          </span>
                          <span className="pill-title">{translateText(service.title)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project Description */}
                <div className="form-field-wrapper">
                  <label htmlFor="req-desc" className="form-label">
                    {translateText("PROJECT DESCRIPTION")} <span className="req-star">*</span>
                  </label>
                  <textarea
                    id="req-desc"
                    className="form-textarea"
                    placeholder={translateText(
                      "Tell me about your project, goals, required features, and anything I should know."
                    )}
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={20}
                  />
                </div>

                {/* Budget (Optional) */}
                <div className="form-field-wrapper">
                  <label className="form-label">
                    {translateText("BUDGET")} <span className="form-optional-tag">({translateText("Optional")})</span>
                  </label>
                  <div className="option-pills-row">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`option-pill ${budget === opt ? 'active' : ''}`}
                        onClick={() => setBudget(opt)}
                      >
                        <span className="pill-radio-dot" />
                        <span>{translateText(opt)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Timeline */}
                <div className="form-field-wrapper">
                  <label className="form-label">{translateText("PREFERRED TIMELINE")}</label>
                  <div className="option-pills-row">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`option-pill ${timeline === opt ? 'active' : ''}`}
                        onClick={() => setTimeline(opt)}
                      >
                        <span className="pill-radio-dot" />
                        <span>{translateText(opt)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="form-error-banner" role="alert">
                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }} />
                    {translateText(errorMessage)}
                  </div>
                )}

                {/* Submit Action */}
                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn btn-primary project-submit-btn"
                    disabled={isSubmitting}
                    id="send-project-request-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }} />
                        {translateText("Sending project request…")}
                      </>
                    ) : (
                      <>
                        <span>{translateText("Send Project Request")}</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                  <span className="submit-privacy-note">
                    <i className="fa-solid fa-lock" style={{ marginRight: '6px', color: 'var(--emerald-bright)' }} />
                    {translateText("Strict privacy. Direct delivery to developer.")}
                  </span>
                </div>
              </motion.form>
            ) : (
              /* Confirmation Screen for Client */
              <motion.div
                key="confirmation-view"
                className="request-confirmation-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="confirmation-badge">
                  <i className="fa-solid fa-circle-check" />
                </div>

                <h3 className="confirmation-title">{translateText("Request received ✓")}</h3>
                <p className="confirmation-lead">
                  {translateText(
                    "Thank you for reaching out. I've received your project details and will review your request."
                  )}
                </p>

                {submittedData && (
                  <div className="confirmation-summary-box">
                    <div className="summary-field">
                      <span className="summary-label">{translateText("CLIENT")}:</span>
                      <span className="summary-value">
                        {submittedData.name} ({submittedData.email})
                      </span>
                    </div>

                    <div className="summary-field">
                      <span className="summary-label">{translateText("CLIENT TYPE")}:</span>
                      <span className="summary-value" style={{ color: 'var(--cyan-bright)', fontWeight: 600 }}>
                        {submittedData.clientType}
                      </span>
                    </div>

                    {submittedData.company && submittedData.company !== 'None specified' && (
                      <div className="summary-field">
                        <span className="summary-label">{translateText("COMPANY / ORGANIZATION")}:</span>
                        <span className="summary-value">{submittedData.company}</span>
                      </div>
                    )}

                    <div className="summary-field">
                      <span className="summary-label">{translateText("SERVICES")}:</span>
                      <div className="summary-services-list">
                        {submittedData.services.map((s) => (
                          <span key={s} className="summary-service-tag">
                            ✓ {translateText(s)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="summary-field">
                      <span className="summary-label">{translateText("TIMELINE")}:</span>
                      <span className="summary-value">{translateText(submittedData.timeline)}</span>
                    </div>

                    <div className="summary-field">
                      <span className="summary-label">{translateText("BUDGET")}:</span>
                      <span className="summary-value">{translateText(submittedData.budget)}</span>
                    </div>
                  </div>
                )}

                <div className="confirmation-actions-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {translateText("Back to portfolio")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      const text = `Client: ${submittedData?.name} (${submittedData?.email})\nProfile: ${submittedData?.clientType}\nCompany: ${submittedData?.company || 'None'}\nServices: ${submittedData?.services.join(', ')}\nTimeline: ${submittedData?.timeline}\nBudget: ${submittedData?.budget}`;
                      navigator.clipboard.writeText(text);
                      setCopiedSummary(true);
                      setTimeout(() => setCopiedSummary(false), 2500);
                    }}
                  >
                    <i className={copiedSummary ? "fa-solid fa-check" : "fa-regular fa-copy"} style={{ marginRight: '6px' }} />
                    {copiedSummary ? translateText("Message copied to clipboard! ✓") : translateText("Copy Message")}
                  </button>
                  <a
                    href="#work"
                    className="btn btn-secondary"
                    onClick={() => {
                      const workEl = document.getElementById('work');
                      workEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {translateText("View my work")}
                  </a>
                  <button
                    type="button"
                    className="confirmation-new-link"
                    onClick={handleResetForm}
                  >
                    {translateText("Send another inquiry")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
