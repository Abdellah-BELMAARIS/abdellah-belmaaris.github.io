import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t as translateText } from '../i18n';

interface SkillNode {
  id: string;
  name: string;
  category: 'dev' | 'data' | 'exploring';
  level: number; // percentage
  icon: string;
  spec: string;
  credentialBadge?: string;
  x: number;
  y: number;
}

interface CircuitConnection {
  id: string;
  from: string;
  to: string;
  path: string;
  color: string;
  dur: string;
}

const SKILL_NODES: SkillNode[] = [
  // ─── 01 CORE DISCIPLINE: Development (Cyan / Mint) ─────────────────────────
  {
    id: 'python-core',
    name: 'Python (OOP & Clean Code)',
    category: 'dev',
    level: 98,
    icon: 'fa-brands fa-python',
    spec: 'Advanced OOP, Design Patterns, PEP-8, 6+ Years Experience',
    credentialBadge: 'Self-directed Foundation · 2020 – Present',
    x: 120,
    y: 70
  },
  {
    id: 'django-framework',
    name: 'Django & Django REST',
    category: 'dev',
    level: 96,
    icon: 'fa-solid fa-server',
    spec: '14 RBAC Roles, Relational Schemas, RESTful APIs, N+1 Optimization',
    credentialBadge: '30 HR Professional Track, Django Developer',
    x: 290,
    y: 110
  },
  {
    id: 'sql-postgres',
    name: 'SQL & PostgreSQL / SQLite',
    category: 'dev',
    level: 95,
    icon: 'fa-solid fa-database',
    spec: 'Relational Schemas, Indexing, Query Optimization, ACID Transactions',
    credentialBadge: 'DataCamp Backend Career Track',
    x: 210,
    y: 220
  },
  {
    id: 'flask-school',
    name: 'Flask & SQLAlchemy',
    category: 'dev',
    level: 94,
    icon: 'fa-solid fa-school',
    spec: 'Multilingual Administration Platform, 4 Dedicated Role Dashboards',
    credentialBadge: 'School Management System Production',
    x: 380,
    y: 230
  },
  {
    id: 'web-threejs-wasm',
    name: 'Three.js & WebAssembly (WASM)',
    category: 'dev',
    level: 95,
    icon: 'fa-solid fa-cubes',
    spec: '16 Python PyGame Classics in WebAssembly via Pygbag, Locked 60 FPS',
    credentialBadge: 'PyGame 3D Web Arcade Console',
    x: 120,
    y: 340
  },

  // ─── 02 DATA DISCIPLINE: Data (Sky Blue / Amber) ───────────────────────────
  {
    id: 'pandas-pipelines',
    name: 'Pandas & High-Speed Pipelines',
    category: 'data',
    level: 96,
    icon: 'fa-solid fa-chart-line',
    spec: 'Log Parsing, Vectorized Transformations, Sub-200ms Reports',
    credentialBadge: 'Dev-Pulse & DataCamp PDA0019412806212',
    x: 540,
    y: 80
  },
  {
    id: 'matplotlib-viz',
    name: 'Matplotlib & Data Analysis',
    category: 'data',
    level: 94,
    icon: 'fa-solid fa-chart-pie',
    spec: 'Automated Statistical Visuals, System Activity Telemetry',
    credentialBadge: 'Python Data Associate Verified',
    x: 690,
    y: 130
  },
  {
    id: 'sql-analytics',
    name: 'SQL Analytics & Aggregations',
    category: 'data',
    level: 95,
    icon: 'fa-solid fa-table',
    spec: 'Data Modeling, Analytical Reporting, Multi-Table Joins',
    credentialBadge: 'DataCamp Certified PDA0019412806212',
    x: 580,
    y: 240
  },

  // ─── 03 HORIZONS: Exploring / Foundations (Violet & Emerald) ───────────────
  {
    id: 'ai-llm-rag',
    name: 'Associate AI Engineer (LLMs & RAG)',
    category: 'exploring',
    level: 95,
    icon: 'fa-solid fa-brain',
    spec: 'Applied AI, Prompt Engineering, LLMs, Vector RAG Concepts',
    credentialBadge: 'DataCamp Certified · ID: AIEDA0011678564836',
    x: 820,
    y: 90
  },
  {
    id: 'cyber-security',
    name: 'Cybersecurity Fundamentals',
    category: 'exploring',
    level: 93,
    icon: 'fa-solid fa-shield-halved',
    spec: 'Session Security, Access Control, Vulnerability Auditing',
    credentialBadge: 'Almdrasa Certified · ID: 77F16BFF2A',
    x: 920,
    y: 220
  },
  {
    id: 'cs-algorithms',
    name: 'Algorithms & Clean Architecture',
    category: 'dev',
    level: 96,
    icon: 'fa-solid fa-laptop-code',
    spec: 'Gang of Four Patterns, PEP-8 Strict Standards, Complete Test Suites',
    credentialBadge: 'OOP Architecture Library',
    x: 760,
    y: 330
  }
];

const CONNECTIONS: CircuitConnection[] = [
  // Development Internal Connections
  { id: 'c1', from: 'python-core', to: 'django-framework', path: 'M 120 70 Q 200 40 290 110', color: '#00E5FF', dur: '2.4s' },
  { id: 'c2', from: 'django-framework', to: 'sql-postgres', path: 'M 290 110 Q 260 170 210 220', color: '#00E5FF', dur: '2.1s' },
  { id: 'c3', from: 'django-framework', to: 'flask-school', path: 'M 290 110 Q 340 170 380 230', color: '#00E5FF', dur: '2.5s' },
  { id: 'c4', from: 'python-core', to: 'web-threejs-wasm', path: 'M 120 70 Q 80 200 120 340', color: '#00E5FF', dur: '2.7s' },
  { id: 'c5', from: 'sql-postgres', to: 'web-threejs-wasm', path: 'M 210 220 Q 150 280 120 340', color: '#00E5FF', dur: '2.3s' },

  // Development to Data Bridge
  { id: 'c6', from: 'python-core', to: 'pandas-pipelines', path: 'M 120 70 Q 330 40 540 80', color: '#38BDF8', dur: '2.2s' },
  { id: 'c7', from: 'sql-postgres', to: 'sql-analytics', path: 'M 210 220 Q 400 240 580 240', color: '#38BDF8', dur: '2.5s' },

  // Data Internal Connections
  { id: 'c8', from: 'pandas-pipelines', to: 'matplotlib-viz', path: 'M 540 80 Q 620 70 690 130', color: '#38BDF8', dur: '2.1s' },
  { id: 'c9', from: 'matplotlib-viz', to: 'sql-analytics', path: 'M 690 130 Q 640 190 580 240', color: '#38BDF8', dur: '2.4s' },

  // Data to AI & Exploring Bridge
  { id: 'c10', from: 'matplotlib-viz', to: 'ai-llm-rag', path: 'M 690 130 Q 750 90 820 90', color: '#C084FC', dur: '2.0s' },
  { id: 'c11', from: 'ai-llm-rag', to: 'cyber-security', path: 'M 820 90 Q 890 150 920 220', color: '#C084FC', dur: '2.3s' },
  { id: 'c12', from: 'flask-school', to: 'cyber-security', path: 'M 380 230 Q 650 260 920 220', color: '#10B981', dur: '2.8s' },
  { id: 'c13', from: 'cyber-security', to: 'cs-algorithms', path: 'M 920 220 Q 840 280 760 330', color: '#10B981', dur: '2.4s' }
];

export default function SynapticSkillsMesh() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dev' | 'data' | 'exploring'>('all');
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);

  const filteredNodes = SKILL_NODES.filter(
    (n) => activeCategory === 'all' || n.category === activeCategory
  );

  return (
    <div className="synaptic-mesh-container">
      {/* Top Header & Real Engineering Status Bar */}
      <div className="synaptic-mesh-header">
        <div className="synaptic-title-group">
          <div className="synaptic-status-chip">
            <span className="synaptic-pulse-dot" />
            <span className="synaptic-chip-text">{translateText("BIO-NEURAL ARCHITECTURE MESH")}</span>
          </div>
          <h3 className="synaptic-heading">{translateText("Interactive Synaptic Engineering Graph")}</h3>
          <p className="synaptic-subtext">
            {translateText("Real-time visual node mesh linking Full-Stack web foundations, applied AI vector pipelines, and verified data analytics.")}
          </p>
        </div>

        {/* Real Disciplines Filter Tabs */}
        <div className="synaptic-filter-bar" role="tablist" aria-label="Filter skill disciplines">
          {[
            { id: 'all', label: 'All Disciplines', color: '#00E5FF' },
            { id: 'dev', label: 'Core: Development', color: '#00E5FF' },
            { id: 'data', label: 'Data & Telemetry', color: '#38BDF8' },
            { id: 'exploring', label: 'AI & Cybersecurity', color: '#C084FC' }
          ].map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`synaptic-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              style={{
                borderColor: activeCategory === cat.id ? cat.color : 'rgba(255, 255, 255, 0.1)',
                color: activeCategory === cat.id ? '#FFFFFF' : '#94A3B8'
              }}
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
            >
              <span
                className="synaptic-filter-indicator"
                style={{ backgroundColor: cat.color }}
              />
              {translateText(cat.label)}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Circuit Canvas Area */}
      <div className="synaptic-svg-wrapper">
        <svg
          viewBox="0 0 1020 420"
          className="synaptic-circuit-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="synapticGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Circuit Connection Lines & Animated Flowing Ion Particles */}
          {CONNECTIONS.map((conn) => {
            const isRelevant =
              activeCategory === 'all' ||
              (SKILL_NODES.find((n) => n.id === conn.from)?.category === activeCategory &&
                SKILL_NODES.find((n) => n.id === conn.to)?.category === activeCategory);

            return (
              <g key={conn.id} opacity={isRelevant ? 0.9 : 0.18} style={{ transition: 'opacity 0.4s ease' }}>
                {/* Circuit Track Path */}
                <path
                  d={conn.path}
                  fill="none"
                  stroke={conn.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                  strokeDasharray="4 3"
                />
                {/* Pulsating Flowing Ion Head */}
                <circle r="3.2" fill="#FFFFFF" stroke={conn.color} strokeWidth="1.5" filter="url(#synapticGlow)">
                  <animateMotion path={conn.path} dur={conn.dur} repeatCount="indefinite" rotate="auto" />
                </circle>
                {/* Ion Tail Halo */}
                <circle r="2.2" fill={conn.color} filter="url(#intenseGlow)">
                  <animateMotion path={conn.path} dur={conn.dur} begin="0.25s" repeatCount="indefinite" rotate="auto" />
                </circle>
              </g>
            );
          })}

          {/* Interactive Real Skill Nodes */}
          {filteredNodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const nodeColor =
              node.category === 'dev' ? '#00E5FF' : node.category === 'exploring' ? '#C084FC' : '#38BDF8';

            return (
              <g
                key={node.id}
                className="synaptic-node-group"
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Pulsing Halo when hovered */}
                {isHovered && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                    filter="url(#intenseGlow)"
                  >
                    <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node Target Ring */}
                <circle
                  className="synaptic-node-ring"
                  r="17"
                  fill="#060D17"
                  stroke={nodeColor}
                  strokeWidth={isHovered ? 2.5 : 1.8}
                  filter="url(#synapticGlow)"
                />

                {/* Node Center Dot */}
                <circle
                  r="6"
                  fill={nodeColor}
                />

                {/* Node Label */}
                <text
                  className="synaptic-node-label"
                  x="0"
                  y="34"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.2px"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.name.split(' (')[0]}
                </text>

                {/* Percentage Badge */}
                <text
                  x="0"
                  y="47"
                  textAnchor="middle"
                  fill={nodeColor}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.level}% SYNAPSE
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Telemetry HUD Tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              className="synaptic-tooltip-hud"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tooltip-hud-header">
                <span className="tooltip-cat-pill" data-cat={hoveredNode.category}>
                  {hoveredNode.category.toUpperCase()}
                </span>
                <span className="tooltip-verified-badge">
                  <i className="fa-solid fa-circle-check" /> VERIFIED {hoveredNode.level}%
                </span>
              </div>
              <h4 className="tooltip-node-name">{hoveredNode.name}</h4>
              <p className="tooltip-node-spec">{hoveredNode.spec}</p>
              {hoveredNode.credentialBadge && (
                <div className="tooltip-credential-tag">
                  <i className="fa-solid fa-award" style={{ marginRight: '6px' }} />
                  {hoveredNode.credentialBadge}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real Synaptic Weights Gauges Row */}
      <div className="synaptic-gauges-section">
        <div className="gauges-status-header">
          <div className="gauges-header-left">
            <span className="gauges-code-badge">{translateText("SYNAPTIC TELEMETRY GAUGES")}</span>
            <span className="gauges-substatus">Verified Credentials · BIMPulse & Production Web Systems</span>
          </div>
          <div className="gauges-legend">
            <span className="legend-item"><span className="legend-dot cyan" /> Development</span>
            <span className="legend-item"><span className="legend-dot sky" /> Data Pipelines</span>
            <span className="legend-item"><span className="legend-dot violet" /> AI & Security</span>
          </div>
        </div>

        <div className="synaptic-metrics-grid">
          {[
            { label: 'Python & Django Development (6+ Years)', score: 98, cat: 'cyan', icon: 'fa-brands fa-python' },
            { label: '14 Granular RBAC Roles Built', score: 96, cat: 'cyan', icon: 'fa-solid fa-shield-halved' },
            { label: 'Pandas & Telemetry Pipelines (DataCamp)', score: 96, cat: 'sky', icon: 'fa-solid fa-chart-line' },
            { label: '16 PyGame WebAssembly Games (Three.js)', score: 95, cat: 'cyan', icon: 'fa-solid fa-cubes' },
            { label: 'Associate AI Engineer (DataCamp AIEDA)', score: 95, cat: 'violet', icon: 'fa-solid fa-brain' },
            { label: 'Cybersecurity Fundamentals (Almdrasa)', score: 93, cat: 'violet', icon: 'fa-solid fa-shield' }
          ].map((metric) => (
            <div className="synaptic-metric-card" key={metric.label}>
              <div className="metric-header">
                <span className="metric-icon-wrap">
                  <i className={metric.icon} />
                </span>
                <span className="metric-label">{translateText(metric.label)}</span>
                <span className="metric-score" data-cat={metric.cat}>{metric.score}%</span>
              </div>
              <div className="metric-track">
                <motion.div
                  className={`metric-fill ${metric.cat}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
