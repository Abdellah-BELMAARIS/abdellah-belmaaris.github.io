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
    label: 'BIM & Full-Stack',
    roleName: 'BIM & Full-Stack Developer',
    company: 'BIMPulse • BIM & Software',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.45)',
    techSpec: 'TypeScript · React · Three.js · IFC · Python · Django',
    statusBadge: 'BIMPULSE · CASABLANCA',
    location: 'Casablanca, Morocco',
    credentials: 'Master BIM Software Certified (That Open Company) & BIMPulse'
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

export default function HolographicIdBadge(_props: HolographicIdBadgeProps) {
  return (
    <div className="hero-clean-portrait-wrap">
      <div className="hero-clean-portrait-frame">
        <img
          src="assets/avatar.jpg"
          alt="Abdellah BELMAARIS — BIM & Full-Stack Software Developer"
          className="hero-clean-portrait-img"
        />
      </div>
    </div>
  );
}
