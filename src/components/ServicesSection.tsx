import { motion, useReducedMotion } from 'framer-motion';
import { t as translateText } from '../i18n';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Professional responsive websites and business websites',
    icon: 'fa-solid fa-globe',
    tags: ['Python', 'Django', 'HTML5 & CSS3', 'Responsive Design', 'SEO Optimized']
  },
  {
    id: 'web-application-development',
    title: 'Web Application Development',
    description: 'Custom web apps, portals, dashboards and management systems',
    icon: 'fa-solid fa-laptop-code',
    tags: ['Python', 'Django', 'SQL', 'RESTful APIs', 'Full-Stack Architecture']
  },
  {
    id: 'web-design',
    title: 'Web Design',
    description: 'Modern UI design, responsive layouts and website redesign',
    icon: 'fa-solid fa-pen-ruler',
    tags: ['Modern UI', 'Responsive Layouts', 'Design Systems', 'Mobile-First', 'Redesign']
  },
  {
    id: 'blog-cms-development',
    title: 'Blog & CMS Development',
    description: 'Blogs, publishing platforms and content-management systems',
    icon: 'fa-solid fa-newspaper',
    tags: ['Publishing Platforms', 'Content Management', 'Markdown & Rich Text', 'Admin Dashboards']
  },
  {
    id: 'custom-software-development',
    title: 'Custom Software Development',
    description: 'Software built around specific business requirements',
    icon: 'fa-solid fa-gears',
    tags: ['Python', 'Custom Business Logic', 'OOP Architecture', 'Modular Clean Code']
  },
  {
    id: 'database-development',
    title: 'Database Development',
    description: 'Database design, integration, forms, filtering and data management',
    icon: 'fa-solid fa-database',
    tags: ['PostgreSQL', 'SQLite', 'Database Design', 'Query Optimization', 'Data Models']
  },
  {
    id: 'saas-development',
    title: 'SaaS Development',
    description: 'Web-based subscription/business software platforms',
    icon: 'fa-solid fa-cloud',
    tags: ['Multi-Tenant', 'Role-Based Access', 'API Integration', 'Subscription Systems']
  },
  {
    id: 'information-management-systems',
    title: 'Information Management Systems',
    description: 'Systems for managing users, records, documents and workflows',
    icon: 'fa-solid fa-network-wired',
    tags: ['User Accounts', 'Record Filtering', 'Document Workflows', 'Audit Logs', 'RBAC']
  },
  {
    id: 'business-analytics-dashboards',
    title: 'Business Analytics & Dashboards',
    description: 'Reporting interfaces, charts and business-data dashboards',
    icon: 'fa-solid fa-chart-line',
    tags: ['Python', 'Pandas', 'Data Dashboards', 'Statistical Reports', 'KPI Tracking']
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'User-focused interfaces and improvements to usability',
    icon: 'fa-solid fa-wand-magic-sparkles',
    tags: ['User-Centered Design', 'Wireframing', 'UX Usability', 'Micro-Interactions']
  }
];

interface ServicesSectionProps {
  selectedServices: string[];
  onToggleService: (serviceTitle: string) => void;
  onRequestService: (serviceTitle: string) => void;
}

export default function ServicesSection({
  selectedServices,
  onToggleService,
  onRequestService
}: ServicesSectionProps) {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0, y = 18) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }
        };

  return (
    <section id="services" className="services-section">
      {/* Architectural Line Transition */}
      <motion.div className="section-arch-divider" {...reveal(0, 14)}>
        <span className="section-arch-code">{translateText("02 / SERVICES")}</span>
        <div className="section-arch-line" />
      </motion.div>

      <motion.div className="services-header-row" {...reveal(0.06, 20)}>
        <div>
          <span className="services-kicker">{translateText("WHAT I CAN BUILD FOR YOU")}</span>
          <h2 className="section-title">{translateText("Services & Technical Solutions")}</h2>
        </div>
        <p className="services-lead-text">
          {translateText(
            "Client-focused web development, custom software, and digital platforms. Select one or more services to receive a tailored project proposal."
          )}
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="services-cards-grid">
        {SERVICES_DATA.map((service, idx) => {
          const isSelected = selectedServices.includes(service.title);

          return (
            <motion.div
              key={service.id}
              className={`service-card ${isSelected ? 'service-card-selected' : ''}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              onClick={() => onToggleService(service.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleService(service.title);
                }
              }}
              aria-pressed={isSelected}
            >
              <div className="service-card-header">
                <div className="service-icon-box">
                  <i className={service.icon} />
                </div>
                {isSelected ? (
                  <span className="service-selected-pill">
                    <i className="fa-solid fa-check" /> {translateText("Selected ✓")}
                  </span>
                ) : (
                  <span className="service-card-index">{String(idx + 1).padStart(2, '0')}</span>
                )}
              </div>

              <h3 className="service-card-title">{translateText(service.title)}</h3>
              <p className="service-card-desc">{translateText(service.description)}</p>

              <div className="service-tech-tags">
                {service.tags.map((tag) => (
                  <span className="service-tech-pill" key={tag}>
                    {translateText(tag)}
                  </span>
                ))}
              </div>

              <div className="service-card-footer">
                <button
                  type="button"
                  className={`service-request-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestService(service.title);
                  }}
                  id={`service-btn-${service.id}`}
                >
                  {isSelected ? (
                    <>
                      <span>{translateText("Selected ✓")}</span>
                      <span className="btn-arrow">↓</span>
                    </>
                  ) : (
                    <>
                      <span>{translateText("Request this service")}</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Services Fast-Track Bar */}
      {selectedServices.length > 0 && (
        <motion.div
          className="services-selected-bar"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="selected-bar-info">
            <span className="selected-bar-count">
              <i className="fa-solid fa-layer-group" style={{ marginRight: '8px', color: 'var(--emerald-bright)' }} />
              {translateText("Selected Services")}: <strong>{selectedServices.length}</strong>
            </span>
            <div className="selected-bar-tags">
              {selectedServices.map((title) => (
                <span key={title} className="selected-bar-chip">
                  {translateText(title)}
                  <button
                    type="button"
                    aria-label={`Remove ${title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleService(title);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary selected-bar-btn"
            onClick={() => {
              const formEl = document.getElementById('request-project');
              formEl?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {translateText("Continue to Project Form ")}<span className="btn-arrow">↓</span>
          </button>
        </motion.div>
      )}
    </section>
  );
}
