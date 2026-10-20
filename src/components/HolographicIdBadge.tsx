import { useState, useRef, useCallback, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { t as translateText } from '../i18n';

export interface RoleConfig {
  id: 'fullstack' | 'django' | 'data_ai';
  label: string;
  roleName: string;
  company: string;
  accentColor: string;
  glowColor: string;
  techSpec: string;
  statusBadge: string;
  location: string;
  credentials: string;
}

export const ROLES: RoleConfig[] = [
  {
    id: 'fullstack',
    label: 'Full-Stack Dev',
    roleName: 'Junior Full-Stack Developer',
    company: 'BIMPulse • AEC & Software',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.45)',
    techSpec: 'Python · Django · SQL · Web Development',
    statusBadge: 'BIMPULSE · CASABLANCA',
    location: 'Casablanca, Morocco',
    credentials: 'BIMPulse Academy & AEC Digital Solutions'
  },
  {
    id: 'django',
    label: 'Django Developer',
    roleName: 'Django & Backend Developer',
    company: 'Self-directed & Production Web Work',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    techSpec: 'Django · Django REST · PostgreSQL · 14 RBAC Roles',
    statusBadge: '14 RBAC ROLES BUILT',
    location: 'May 2026 – Present',
    credentials: '30 HR Professional Track, Django Developer'
  },
  {
    id: 'data_ai',
    label: 'Data & AI (DataCamp)',
    roleName: 'Certified AI Engineer & Data Associate',
    company: 'DataCamp & Almdrasa Certified',
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    techSpec: 'Pandas · Matplotlib · LLMs · RAG Concepts',
    statusBadge: 'DATACAMP CERTIFIED',
    location: 'PDA0019412806212 · AIEDA0011678564836',
    credentials: 'Python Data Associate & AI Engineer for Developers'
  }
];

interface HolographicIdBadgeProps {
  activeRoleId?: 'fullstack' | 'django' | 'data_ai';
  onRoleSelect?: (role: RoleConfig) => void;
}

export default function HolographicIdBadge({
  activeRoleId = 'fullstack',
  onRoleSelect
}: HolographicIdBadgeProps) {
  const [currentRole, setCurrentRole] = useState<RoleConfig>(
    ROLES.find(r => r.id === activeRoleId) || ROLES[0]
  );
  
  // 3D Parallax tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glintX: 50, glintY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle capped at ±10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;
    
    const glintX = (x / rect.width) * 100;
    const glintY = (y / rect.height) * 100;
    
    setTilt({ rotateX, rotateY, glintX, glintY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glintX: 50, glintY: 50 });
  };

  const handleRoleClick = (role: RoleConfig) => {
    setCurrentRole(role);
    if (onRoleSelect) onRoleSelect(role);
  };

  return (
    <div className="holo-badge-container">
      {/* Dynamic Role Switcher Controls */}
      <div className="holo-role-selector" role="tablist" aria-label={translateText('Select Engineering Discipline')}>
        {ROLES.map((role) => {
          const isActive = role.id === currentRole.id;
          return (
            <button
              key={role.id}
              role="tab"
              aria-selected={isActive}
              className={`holo-role-pill ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? role.accentColor : undefined,
                boxShadow: isActive ? `0 0 16px -2px ${role.glowColor}` : undefined,
                color: isActive ? role.accentColor : undefined
              }}
              onClick={() => handleRoleClick(role)}
            >
              <span
                className="holo-role-dot"
                style={{
                  backgroundColor: role.accentColor,
                  boxShadow: isActive ? `0 0 8px ${role.accentColor}` : 'none'
                }}
              />
              <span className="holo-role-label">{translateText(role.label)}</span>
            </button>
          );
        })}
      </div>

      {/* Holographic 3D ID Card */}
      <div
        ref={cardRef}
        className="holo-card-perspective-frame"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1200
        }}
      >
        <motion.div
          className="holo-card-inner"
          animate={{
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          style={{
            boxShadow: `0 24px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px ${currentRole.glowColor}`
          }}
        >
          {/* Laser Border Beam (Conic Gradient Spin) */}
          <div
            className="holo-laser-beam"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, ${currentRole.accentColor} 325deg, #ffffff 360deg)`
            }}
          />

          {/* Interactive Dynamic Glint Overlay */}
          <div
            className="holo-glint-surface"
            style={{
              background: `radial-gradient(circle at ${tilt.glintX}% ${tilt.glintY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`
            }}
          />

          {/* Card Body */}
          <div className="holo-card-content">
            {/* Corner HUD Brackets */}
            <div className="hud-corner top-left" style={{ borderColor: currentRole.accentColor }} />
            <div className="hud-corner top-right" style={{ borderColor: currentRole.accentColor }} />
            <div className="hud-corner bottom-left" style={{ borderColor: currentRole.accentColor }} />
            <div className="hud-corner bottom-right" style={{ borderColor: currentRole.accentColor }} />

            {/* Ambient Background Aura */}
            <div
              className="holo-ambient-aura top"
              style={{ backgroundColor: currentRole.accentColor }}
            />
            <div
              className="holo-ambient-aura bottom"
              style={{ backgroundColor: currentRole.accentColor }}
            />

            {/* Top Bar: Online Status & Terminal Badge */}
            <div className="holo-card-top-bar">
              <div className="holo-status-indicator">
                <span className="holo-status-radar">
                  <span
                    className="holo-radar-ping"
                    style={{ backgroundColor: currentRole.accentColor }}
                  />
                  <span
                    className="holo-radar-core"
                    style={{ backgroundColor: currentRole.accentColor }}
                  />
                </span>
                <span className="holo-status-text">{translateText(currentRole.statusBadge)}</span>
              </div>

              <div
                className="holo-hud-id-tag"
                style={{ borderColor: `${currentRole.accentColor}40`, color: currentRole.accentColor }}
              >
                <i className="fa-solid fa-location-dot" style={{ fontSize: '10px' }} />
                <span>Casablanca, Morocco</span>
              </div>
            </div>

            {/* Portrait Container */}
            <div className="holo-portrait-wrapper">
              <img
                src="assets/avatar.jpg"
                alt="Abdellah BELMAARIS — Junior Full-Stack Developer at BIMPulse"
                className="holo-portrait-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/450x520/101820/10B981?text=Abdellah+BELMAARIS';
                }}
              />
              <div className="holo-portrait-vignette" />
            </div>

            {/* Bottom Info HUD Card */}
            <div className="holo-card-info-hud">
              <div className="holo-identity-row">
                <div className="holo-name-block">
                  <span
                    className="holo-role-subline"
                    style={{ color: currentRole.accentColor }}
                  >
                    {translateText(currentRole.roleName)}
                  </span>
                  <h3 className="holo-full-name">
                    Abdellah BELMAARIS
                    <i
                      className="fa-solid fa-circle-check holo-verified-icon"
                      style={{ color: currentRole.accentColor }}
                      title="Verified Full-Stack Developer"
                    />
                  </h3>
                </div>
                <div className="holo-badge-tag-group" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div
                    className="holo-badge-tag"
                    style={{
                      backgroundColor: `${currentRole.accentColor}20`,
                      borderColor: `${currentRole.accentColor}60`,
                      color: currentRole.accentColor
                    }}
                  >
                    BIMPulse
                  </div>
                  <a
                    href="assets/Abdellah_BELMAARIS_CV.pdf"
                    download="Abdellah_BELMAARIS_CV.pdf"
                    className="holo-badge-tag holo-cv-pill"
                    title={translateText("Download Abdellah BELMAARIS CV (PDF)")}
                    style={{
                      backgroundColor: `${currentRole.accentColor}25`,
                      borderColor: `${currentRole.accentColor}80`,
                      color: currentRole.accentColor,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-file-arrow-down" style={{ fontSize: '10px' }} />
                    <span style={{ fontWeight: 700 }}>CV</span>
                  </a>
                </div>
              </div>

              {/* Dynamic Real Tech Spec Bar */}
              <div
                className="holo-tech-spec-bar"
                style={{
                  borderColor: `${currentRole.accentColor}35`,
                  boxShadow: `0 0 16px -4px ${currentRole.glowColor}`
                }}
              >
                <span>{translateText(currentRole.techSpec)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
