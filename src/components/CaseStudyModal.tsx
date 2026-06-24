import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'architecture' | 'performance' | 'workflow';

export default function CaseStudyModal({ isOpen, onClose }: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal active case-study-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.case-study-close')) {
              onClose();
            }
          }}
        >
          <motion.div
            className="case-study-content-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
          {/* Header */}
          <div className="case-study-header">
            <div className="case-study-title-area">
              <span className="case-study-overline">Featured Project Deep Dive</span>
              <h3 className="case-study-title">
                <i className="fa-solid fa-gears" style={{ color: 'var(--accent)', marginRight: '10px' }}></i>
                The Modern Journal — Engineering Case Study
              </h3>
            </div>
            <button className="case-study-close" aria-label="Close case study" id="case-study-close-btn">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="case-study-tabs">
            {[
              { id: 'architecture', label: 'System & Data Architecture', icon: 'fa-solid fa-sitemap' },
              { id: 'performance', label: 'Security & Performance', icon: 'fa-solid fa-shield-halved' },
              { id: 'workflow', label: 'CI/CD & DevOps Workflow', icon: 'fa-solid fa-terminal' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`case-study-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as TabType)}
                id={`case-study-tab-${tab.id}`}
              >
                <i className={`${tab.icon}`} style={{ marginRight: '8px' }}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="case-study-body">
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="case-study-tab-pane"
              >
                <div className="pane-section">
                  <h4 className="pane-section-title">
                    <i className="fa-solid fa-network-wired" style={{ color: 'var(--accent)' }}></i> System Architecture Flow
                  </h4>
                  <p className="pane-section-desc">
                    The platform follows a secure, decoupled monolithic pattern powered by Django. Below is the request-response lifecycle illustrating authorization verification, query optimization, and background tasks.
                  </p>

                  {/* SVG Architecture Flowchart */}
                  <div className="architecture-diagram-container">
                    <svg className="architecture-svg" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="glow-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#112240" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="var(--accent)" floodOpacity="0.15" />
                        </filter>
                      </defs>

                      {/* Nodes */}
                      {/* Client */}
                      <rect x="20" y="80" width="100" height="60" rx="6" fill="#112240" stroke="var(--text-secondary)" strokeWidth="1" filter="url(#shadow)" />
                      <text x="70" y="110" fill="var(--text-primary)" fontSize="12" fontWeight="600" textAnchor="middle">Client App</text>
                      <text x="70" y="128" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">(Web / API)</text>

                      {/* Security Middleware */}
                      <rect x="180" y="80" width="110" height="60" rx="6" fill="#112240" stroke="var(--accent)" strokeWidth="1" filter="url(#shadow)" />
                      <text x="235" y="110" fill="var(--text-primary)" fontSize="12" fontWeight="600" textAnchor="middle">Security Layer</text>
                      <text x="235" y="128" fill="var(--accent)" fontSize="9" textAnchor="middle">CSRF, Auth, CORS</text>

                      {/* Views & Serializers */}
                      <rect x="350" y="80" width="120" height="60" rx="6" fill="#112240" stroke="var(--text-secondary)" strokeWidth="1" filter="url(#shadow)" />
                      <text x="410" y="110" fill="var(--text-primary)" fontSize="12" fontWeight="600" textAnchor="middle">Django Core</text>
                      <text x="410" y="128" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">Views & Serializers</text>

                      {/* ORM Optimizer */}
                      <rect x="530" y="80" width="110" height="60" rx="6" fill="#112240" stroke="var(--accent)" strokeWidth="1" filter="url(#shadow)" />
                      <text x="585" y="110" fill="var(--text-primary)" fontSize="11" fontWeight="600" textAnchor="middle">ORM Optimizer</text>
                      <text x="585" y="128" fill="var(--accent)" fontSize="8.5" textAnchor="middle">select_related / prefetch</text>

                      {/* Database */}
                      <rect x="690" y="80" width="90" height="60" rx="6" fill="#112240" stroke="var(--text-secondary)" strokeWidth="1" filter="url(#shadow)" />
                      <text x="735" y="110" fill="var(--text-primary)" fontSize="12" fontWeight="600" textAnchor="middle">RDBMS</text>
                      <text x="735" y="128" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">(SQLite / Postgres)</text>

                      {/* Connecting Arrows */}
                      {/* Client -> Security */}
                      <path d="M 120 110 L 180 110" stroke="var(--text-secondary)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                      <path className="animated-flow" d="M 120 110 L 180 110" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6, 6" />

                      {/* Security -> Django */}
                      <path d="M 290 110 L 350 110" stroke="var(--accent)" strokeWidth="1.5" />
                      <path className="animated-flow" d="M 290 110 L 350 110" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6, 6" />

                      {/* Django -> ORM */}
                      <path d="M 470 110 L 530 110" stroke="var(--text-secondary)" strokeWidth="1.5" />
                      <path className="animated-flow" d="M 470 110 L 530 110" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6, 6" />

                      {/* ORM -> DB */}
                      <path d="M 640 110 L 690 110" stroke="var(--accent)" strokeWidth="1.5" />
                      <path className="animated-flow" d="M 640 110 L 690 110" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6, 6" />

                      {/* Return Flows */}
                      <path d="M 690 125 L 120 125" stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="2, 4" opacity="0.4" />
                    </svg>
                  </div>
                </div>

                <div className="pane-section" style={{ marginTop: '25px' }}>
                  <h4 className="pane-section-title">
                    <i className="fa-solid fa-database" style={{ color: 'var(--accent)' }}></i> Database Relational Schema
                  </h4>
                  <p className="pane-section-desc">
                    The relational schema is structured to guarantee referential integrity and support advanced query filtering. Indexes are placed on search vectors, slug fields, and foreign keys.
                  </p>

                  <div className="schema-grid">
                    {[
                      {
                        name: 'User',
                        fields: ['id (PK)', 'username (Unique)', 'email', 'password (Hashed)', 'is_staff'],
                        relations: ['One-to-Many with Post', 'One-to-Many with Comment']
                      },
                      {
                        name: 'Post',
                        fields: ['id (PK)', 'author_id (FK)', 'title', 'slug (Indexed)', 'content', 'created_at'],
                        relations: ['Many-to-One with User', 'Many-to-Many with Tag', 'One-to-Many with Comment']
                      },
                      {
                        name: 'Comment',
                        fields: ['id (PK)', 'post_id (FK)', 'author_id (FK)', 'body', 'created_at'],
                        relations: ['Many-to-One with Post', 'Many-to-One with User']
                      },
                      {
                        name: 'Tag',
                        fields: ['id (PK)', 'name (Unique)', 'slug (Indexed)'],
                        relations: ['Many-to-Many with Post']
                      }
                    ].map((model) => (
                      <div className="schema-card" key={model.name}>
                        <div className="schema-card-header">
                          <i className="fa-solid fa-table" style={{ color: 'var(--accent)', marginRight: '8px' }}></i>
                          <span>{model.name}</span>
                        </div>
                        <div className="schema-card-body">
                          <div className="schema-subtitle">Attributes</div>
                          <ul className="schema-list">
                            {model.fields.map((f) => (
                              <li key={f} className={f.includes('(PK)') || f.includes('(FK)') ? 'highlight-attribute' : ''}>{f}</li>
                            ))}
                          </ul>
                          <div className="schema-subtitle" style={{ marginTop: '8px' }}>Relations</div>
                          <ul className="schema-list-relations">
                            {model.relations.map((r) => (
                              <li key={r}><i className="fa-solid fa-link" style={{ fontSize: '0.65rem', marginRight: '4px' }}></i> {r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="case-study-tab-pane"
              >
                <div className="pane-section">
                  <h4 className="pane-section-title">
                    <i className="fa-solid fa-gauge-high" style={{ color: 'var(--accent)' }}></i> Resolving the N+1 Query Problem
                  </h4>
                  <p className="pane-section-desc">
                    In database-driven applications, a common performance bottleneck is fetching related objects inside a loop, which executes $N$ extra queries for $N$ records. In Django, this was optimized using Eager Loading to execute exactly 1 query.
                  </p>

                  <div className="code-comparison-grid">
                    <div className="code-box naive">
                      <div className="code-box-header">
                        <span className="bullet red"></span> Naive Approach (Produces N+1 Queries)
                      </div>
                      <pre className="code-content">
{`# Retrieves posts, but triggers a database hit
# for every single author and category in a loop.
posts = Post.objects.filter(status="published")

for post in posts:
    author_name = post.author.username  # Hit DB!
    cat_title = post.category.title     # Hit DB!
    # Total Queries: 1 + 2N`}
                      </pre>
                    </div>

                    <div className="code-box optimized">
                      <div className="code-box-header">
                        <span className="bullet green"></span> Optimized Approach (Constant O(1) Queries)
                      </div>
                      <pre className="code-content">
{`# Executes a SQL JOIN (select_related) and
# an ID-in-list query (prefetch_related) upfront.
posts = Post.objects.filter(
    status="published"
).select_related(
    'author', 'category'
).prefetch_related(
    'tags'
)
# Total Queries: exactly 2 (regardless of N)`}
                      </pre>
                    </div>
                  </div>
                  <div className="performance-metric-callout">
                    <i className="fa-solid fa-chart-line" style={{ marginRight: '8px' }}></i>
                    <strong>Performance Benefit:</strong> Reduced database roundtrips by <strong>70%</strong> and decreased server response time from 350ms to <strong>85ms</strong> on lists containing 20+ posts.
                  </div>
                </div>

                <div className="pane-section" style={{ marginTop: '25px' }}>
                  <h4 className="pane-section-title">
                    <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent)' }}></i> Security Architecture
                  </h4>
                  <p className="pane-section-desc">
                    Integrating security best practices into the core development flow ensures data confidentiality and protection against common OWASP Top 10 vulnerabilities.
                  </p>

                  <div className="security-cards-grid">
                    {[
                      {
                        title: 'Authentication & RBAC',
                        desc: 'Role-Based Access Control limits post modifications to authors and staff, enforced via Django permission classes and decorator-level middleware checking session states.',
                        icon: 'fa-solid fa-user-shield'
                      },
                      {
                        title: 'SQL Injection Safeguards',
                        desc: 'Completely avoided raw SQL queries. Django ORM automatically parameterizes all queries, rendering SQL injection attempts harmless by treating user inputs strictly as literals.',
                        icon: 'fa-solid fa-database'
                      },
                      {
                        title: 'XSS & CSRF Mitigation',
                        desc: 'Enforced CSRF token validations on all modifying requests (POST/PUT/DELETE). Django template auto-escaping prevents Cross-Site Scripting by sterilizing user text.',
                        icon: 'fa-solid fa-lock'
                      },
                      {
                        title: 'Session & Data Safety',
                        desc: 'Configured secure cookie parameters (`SESSION_COOKIE_SECURE = True`, `HTTPONLY`) preventing client-side script access. Passwords hashed using PBKDF2 with SHA256.',
                        icon: 'fa-solid fa-key'
                      }
                    ].map((sec) => (
                      <div className="security-detail-card" key={sec.title}>
                        <div className="security-detail-header">
                          <i className={sec.icon} style={{ color: 'var(--accent)', marginRight: '10px' }}></i>
                          <h5>{sec.title}</h5>
                        </div>
                        <p>{sec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'workflow' && (
              <motion.div
                key="workflow"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="case-study-tab-pane"
              >
                <div className="pane-section">
                  <h4 className="pane-section-title">
                    <i className="fa-solid fa-repeat" style={{ color: 'var(--accent)' }}></i> CI/CD Pipelines (GitHub Actions)
                  </h4>
                  <p className="pane-section-desc">
                    Automated integration pipelines run tests, check formatting compliance, and execute security vulnerability audits on every branch push.
                  </p>

                  <div className="code-box">
                    <div className="code-box-header">
                      <i className="fa-brands fa-github" style={{ marginRight: '6px' }}></i> .github/workflows/backend-test.yml
                    </div>
                    <pre className="code-content" style={{ fontSize: '0.8rem' }}>
{`name: Python Backend CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-django flake8 ruff
      - name: Run Linting Checks
        run: ruff check .
      - name: Execute Test Suite
        run: pytest --ds=config.settings.test`}
                    </pre>
                  </div>
                </div>

                <div className="pane-section" style={{ marginTop: '25px' }}>
                  <h4 className="pane-section-title">
                    <i className="fa-brands fa-docker" style={{ color: 'var(--accent)' }}></i> Containerization (Docker)
                  </h4>
                  <p className="pane-section-desc">
                    Docker isolates the Django application, database, and caching layers to guarantee consistency between local development and production environments.
                  </p>

                  <div className="code-comparison-grid">
                    <div className="code-box">
                      <div className="code-box-header">
                        <i className="fa-brands fa-docker" style={{ marginRight: '6px' }}></i> Dockerfile
                      </div>
                      <pre className="code-content" style={{ fontSize: '0.75rem' }}>
{`FROM python:3.11-slim-buster

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/
EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]`}
                      </pre>
                    </div>

                    <div className="code-box">
                      <div className="code-box-header">
                        <i className="fa-brands fa-docker" style={{ marginRight: '6px' }}></i> docker-compose.yml
                      </div>
                      <pre className="code-content" style={{ fontSize: '0.75rem' }}>
{`version: '3.8'

services:
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=journal_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret

volumes:
  postgres_data:`}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
