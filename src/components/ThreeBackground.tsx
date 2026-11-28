import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type PortfolioTheme = 'dark' | 'violet' | 'light';

interface ThemePalette {
  primary: string;
  secondary: string;
  grid: string;
  glass: string;
  node: string;
  wireOpacity: number;
  slabOpacity: number;
  gridOpacity: number;
  lineOpacity: number;
  useAdditive: boolean;
}

const THEME_PALETTES: Record<PortfolioTheme, ThemePalette> = {
  dark: {
    primary: '#00e5ff',
    secondary: '#10b981',
    grid: '#0ea5e9',
    glass: '#062438',
    node: '#38bdf8',
    wireOpacity: 0.34,
    slabOpacity: 0.1,
    gridOpacity: 0.15,
    lineOpacity: 0.22,
    useAdditive: true,
  },
  violet: {
    primary: '#c084fc',
    secondary: '#38bdf8',
    grid: '#a855f7',
    glass: '#22103d',
    node: '#f472b6',
    wireOpacity: 0.34,
    slabOpacity: 0.11,
    gridOpacity: 0.15,
    lineOpacity: 0.22,
    useAdditive: true,
  },
  light: {
    primary: '#00768a',
    secondary: '#0284c7',
    grid: '#0369a1',
    glass: '#bae6fd',
    node: '#0f766e',
    wireOpacity: 0.26,
    slabOpacity: 0.08,
    gridOpacity: 0.13,
    lineOpacity: 0.16,
    useAdditive: false,
  },
};

const SCENE_LABELS = [
  { title: 'IFC High-Rise Twin', tag: 'ARCH · 3D' },
  { title: '3D BIM Bridge Span', tag: 'STRUCT · IFC4' },
  { title: 'Parametric Arch Dome', tag: 'BIM · PAVILION' },
  { title: 'Urban GIS Masterplan', tag: 'CESIUM · 3D' },
];

// ─── Scene 0: Architectural IFC High-Rise Tower ──────────────────────────────
function IfcHighRiseTower({ palette, active }: { palette: ThemePalette; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const blending = palette.useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

  const { slabs, cols, nodes, grid } = useMemo(() => {
    const s = [
      { y: -1.45, w: 2.35, d: 1.85, h: 0.08 },
      { y: -1.0,  w: 1.9,  d: 1.5,  h: 0.06 },
      { y: -0.55, w: 1.9,  d: 1.5,  h: 0.06 },
      { y: -0.1,  w: 1.7,  d: 1.38, h: 0.06 },
      { y:  0.35, w: 1.7,  d: 1.38, h: 0.06 },
      { y:  0.8,  w: 1.48, d: 1.22, h: 0.06 },
      { y:  1.25, w: 1.22, d: 1.05, h: 0.07 },
    ];
    const c: [number, number, number, number][] = [
      [-0.86, -0.68, 2.7, -0.1], [0.86, -0.68, 2.7, -0.1],
      [-0.86,  0.68, 2.7, -0.1], [0.86,  0.68, 2.7, -0.1],
      [0.0,   -0.68, 2.25, -0.32], [0.0, 0.68, 2.25, -0.32],
    ];
    const n: number[] = [];
    s.forEach((sl) => {
      const hw = sl.w / 2, hd = sl.d / 2;
      n.push(-hw, sl.y, -hd, hw, sl.y, -hd, hw, sl.y, hd, -hw, sl.y, hd);
    });
    const g: number[] = [];
    for (let x = -3.0; x <= 3.01; x += 0.5) g.push(x, -1.56, -3.0, x, -1.56, 3.0);
    for (let z = -3.0; z <= 3.01; z += 0.5) g.push(-3.0, -1.56, z, 3.0, -1.56, z);
    return { slabs: s, cols: c, nodes: new Float32Array(n), grid: new Float32Array(g) };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const targetScale = active ? 1 : 0.001;
      const cur = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.07);
      ref.current.scale.setScalar(cur);
      ref.current.visible = cur > 0.015;
      ref.current.rotation.y = t * 0.14 + 0.55;
      ref.current.rotation.x = 0.24;
    }
    if (scanRef.current && active) {
      scanRef.current.position.y = Math.sin(t * 0.7) * 1.35;
    }
  });

  return (
    <group ref={ref}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[grid, 3]} /></bufferGeometry>
        <lineBasicMaterial color={palette.grid} transparent opacity={palette.gridOpacity} blending={blending} depthWrite={false} />
      </lineSegments>
      {slabs.map((s, idx) => (
        <group key={idx} position={[0, s.y, 0]}>
          <mesh>
            <boxGeometry args={[s.w, s.h, s.d]} />
            <meshBasicMaterial color={palette.glass} transparent opacity={palette.slabOpacity} blending={blending} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(s.w, s.h, s.d)]} />
            <lineBasicMaterial color={idx % 2 === 0 ? palette.primary : palette.secondary} transparent opacity={palette.wireOpacity} blending={blending} depthWrite={false} />
          </lineSegments>
        </group>
      ))}
      {cols.map(([x, z, h, yc], i) => (
        <mesh key={i} position={[x, yc, z]}>
          <boxGeometry args={[0.045, h, 0.045]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={palette.wireOpacity * 0.85} blending={blending} depthWrite={false} />
        </mesh>
      ))}
      <lineSegments position={[0, 0.05, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.56, 3.0, 0.56)]} />
        <lineBasicMaterial color={palette.secondary} transparent opacity={palette.wireOpacity * 1.1} blending={blending} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[nodes, 3]} /></bufferGeometry>
        <pointsMaterial size={0.075} color={palette.node} transparent opacity={0.8} blending={blending} depthWrite={false} />
      </points>
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.5, 48]} />
        <meshBasicMaterial color={palette.primary} side={THREE.DoubleSide} transparent opacity={0.26} blending={blending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── Scene 1: 3D Cable-Stayed Structural BIM Bridge Span ─────────────────────
function BimCableStayedBridge({ palette, active }: { palette: ThemePalette; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const blending = palette.useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

  const cableLines = useMemo(() => {
    const pts: number[] = [];
    const pylonXs = [-1.25, 1.25];
    pylonXs.forEach((px) => {
      for (let i = 1; i <= 6; i++) {
        const dx = i * 0.32;
        const topY = 1.55 - i * 0.1;
        // Left & right stays on both bridge sides
        [-0.36, 0.36].forEach((z) => {
          pts.push(px, topY, z, px - dx, -0.35, z);
          pts.push(px, topY, z, px + dx, -0.35, z);
        });
      }
    });
    return new Float32Array(pts);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const targetScale = active ? 0.92 : 0.001;
      const cur = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.07);
      ref.current.scale.setScalar(cur);
      ref.current.visible = cur > 0.015;
      ref.current.rotation.y = Math.sin(t * 0.22) * 0.45 + 0.4;
      ref.current.rotation.x = 0.28;
    }
  });

  return (
    <group ref={ref}>
      {/* Main Bridge Deck Box Girder */}
      <group position={[0, -0.4, 0]}>
        <mesh>
          <boxGeometry args={[5.6, 0.14, 0.82]} />
          <meshBasicMaterial color={palette.glass} transparent opacity={palette.slabOpacity * 1.1} blending={blending} depthWrite={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(5.6, 0.14, 0.82)]} />
          <lineBasicMaterial color={palette.primary} transparent opacity={palette.wireOpacity * 1.1} blending={blending} depthWrite={false} />
        </lineSegments>
      </group>
      {/* Twin H-Pylons */}
      {[-1.25, 1.25].map((px, idx) => (
        <group key={idx} position={[px, 0.2, 0]}>
          {[-0.36, 0.36].map((pz, j) => (
            <lineSegments key={j} position={[0, 0, pz]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.14, 3.0, 0.14)]} />
              <lineBasicMaterial color={palette.primary} transparent opacity={palette.wireOpacity * 1.15} blending={blending} depthWrite={false} />
            </lineSegments>
          ))}
          <lineSegments position={[0, 0.9, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.12, 0.12, 0.84)]} />
            <lineBasicMaterial color={palette.secondary} transparent opacity={palette.wireOpacity} blending={blending} depthWrite={false} />
          </lineSegments>
          <lineSegments position={[0, -0.9, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.16, 0.16, 0.88)]} />
            <lineBasicMaterial color={palette.secondary} transparent opacity={palette.wireOpacity} blending={blending} depthWrite={false} />
          </lineSegments>
        </group>
      ))}
      {/* Stay Cables */}
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[cableLines, 3]} /></bufferGeometry>
        <lineBasicMaterial color={palette.secondary} transparent opacity={palette.wireOpacity * 0.95} blending={blending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

// ─── Scene 2: 3D Parametric Architectural BIM Dome / Pavilion ────────────────
function BimParametricDome({ palette, active }: { palette: ThemePalette; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const blending = palette.useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

  const { domeNodes } = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.85, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.52);
    return { domeNodes: new Float32Array(geo.attributes.position.array) };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const targetScale = active ? 1 : 0.001;
      const cur = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.07);
      ref.current.scale.setScalar(cur);
      ref.current.visible = cur > 0.015;
      ref.current.rotation.y = t * 0.12;
      ref.current.rotation.x = 0.32;
    }
  });

  return (
    <group ref={ref} position={[0, -0.55, 0]}>
      {/* Structural Geodesic Roof Shell */}
      <mesh>
        <sphereGeometry args={[1.85, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshBasicMaterial color={palette.primary} wireframe transparent opacity={palette.wireOpacity} blending={blending} depthWrite={false} />
      </mesh>
      {/* Inner Structural Truss Shell */}
      <mesh>
        <sphereGeometry args={[1.55, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color={palette.secondary} wireframe transparent opacity={palette.wireOpacity * 0.7} blending={blending} depthWrite={false} />
      </mesh>
      {/* Base Ring Beam */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[1.95, 0.035, 10, 48]} />
        <meshBasicMaterial color={palette.primary} transparent opacity={palette.wireOpacity * 1.15} blending={blending} depthWrite={false} />
      </mesh>
      {/* Structural Joint Nodes */}
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[domeNodes, 3]} /></bufferGeometry>
        <pointsMaterial size={0.065} color={palette.node} transparent opacity={0.75} blending={blending} depthWrite={false} />
      </points>
    </group>
  );
}

// ─── Scene 3: 3D Urban GIS / Cesium City Masterplan ──────────────────────────
function BimUrbanMasterplan({ palette, active }: { palette: ThemePalette; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const blending = palette.useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

  const { buildings, cityGrid } = useMemo(() => {
    const b = [
      { x: 0.0,  z: 0.0,  w: 0.72, h: 2.35, d: 0.72 },
      { x: -1.0, z: -0.4, w: 0.65, h: 1.65, d: 0.65 },
      { x: 0.95, z: 0.35, w: 0.68, h: 1.85, d: 0.62 },
      { x: -0.6, z: 0.95, w: 0.82, h: 1.15, d: 0.58 },
      { x: 0.75, z: -0.95, w: 0.6, h: 1.35, d: 0.68 },
      { x: -1.55, z: 0.55, w: 0.55, h: 0.95, d: 0.55 },
      { x: 1.55, z: -0.35, w: 0.58, h: 1.1, d: 0.55 },
      { x: -0.1, z: -1.35, w: 0.75, h: 0.9, d: 0.52 },
      { x: 0.25, z: 1.3,  w: 0.62, h: 0.85, d: 0.55 },
    ];
    const g: number[] = [];
    for (let x = -2.8; x <= 2.81; x += 0.4) g.push(x, -1.15, -2.8, x, -1.15, 2.8);
    for (let z = -2.8; z <= 2.81; z += 0.4) g.push(-2.8, -1.15, z, 2.8, -1.15, z);
    return { buildings: b, cityGrid: new Float32Array(g) };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const targetScale = active ? 0.98 : 0.001;
      const cur = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.07);
      ref.current.scale.setScalar(cur);
      ref.current.visible = cur > 0.015;
      ref.current.rotation.y = t * 0.11 + 0.75;
      ref.current.rotation.x = 0.38;
    }
  });

  return (
    <group ref={ref}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[cityGrid, 3]} /></bufferGeometry>
        <lineBasicMaterial color={palette.grid} transparent opacity={palette.gridOpacity} blending={blending} depthWrite={false} />
      </lineSegments>
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.x, -1.15 + b.h / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshBasicMaterial color={palette.glass} transparent opacity={palette.slabOpacity} blending={blending} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
            <lineBasicMaterial color={idx % 2 === 0 ? palette.primary : palette.secondary} transparent opacity={palette.wireOpacity} blending={blending} depthWrite={false} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

// ─── Scroll-Reactive Stage Wrapper ───────────────────────────────────────────
function BimStageRig({
  sceneIndex,
  palette,
}: {
  sceneIndex: number;
  palette: ThemePalette;
}) {
  const rigRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!rigRef.current) return;
    // Alternate left/right balance subtly across sections so content remains super legible
    const baseX = sceneIndex % 2 === 0 ? 2.95 : -2.65;
    rigRef.current.position.x = THREE.MathUtils.lerp(rigRef.current.position.x, baseX + mouse.x * 0.35, 0.035);
    rigRef.current.position.y = THREE.MathUtils.lerp(rigRef.current.position.y, mouse.y * 0.25, 0.035);
  });

  return (
    <group ref={rigRef} position={[2.95, 0, -2.2]}>
      <IfcHighRiseTower palette={palette} active={sceneIndex === 0} />
      <BimCableStayedBridge palette={palette} active={sceneIndex === 1} />
      <BimParametricDome palette={palette} active={sceneIndex === 2} />
      <BimUrbanMasterplan palette={palette} active={sceneIndex === 3} />
    </group>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ThreeBackground() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [theme, setTheme] = useState<PortfolioTheme>(() => {
    if (typeof document === 'undefined') return 'dark';
    const t = document.documentElement.getAttribute('data-theme');
    return t === 'light' || t === 'violet' ? t : 'dark';
  });
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = window.scrollY / maxScroll;
      if (ratio < 0.24) setSceneIndex(0);
      else if (ratio < 0.5) setSceneIndex(1);
      else if (ratio < 0.74) setSceneIndex(2);
      else setSceneIndex(3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', listener);

    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme');
      setTheme(t === 'light' || t === 'violet' ? t : 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('scroll', onScroll);
      media.removeEventListener('change', listener);
      observer.disconnect();
    };
  }, []);

  const palette = THEME_PALETTES[theme];
  const currentScene = SCENE_LABELS[sceneIndex];

  return (
    <div
      className="portfolio-scene"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--scene-background)',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 54 }}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.45} />
        {!reduceMotion && <BimStageRig sceneIndex={sceneIndex} palette={palette} />}
      </Canvas>

      {/* Architectural CAD Blueprint Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, var(--border-subtle, rgba(255,255,255,0.035)) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle, rgba(255,255,255,0.035)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: theme === 'light' ? 0.35 : 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Cinematic Depth Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--scene-vignette)',
          pointerEvents: 'none',
        }}
      />

      {/* Active Section 3D BIM Scene Telemetry Pill */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '28px',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '4px',
          background: 'var(--surface-glass)',
          border: `1px solid ${palette.primary}45`,
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
          fontSize: '0.72rem',
          color: 'var(--accent)',
          letterSpacing: '0.5px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
        title="Scroll-reactive 3D BIM / IFC Architectural Background"
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '2px',
            background: palette.primary,
            boxShadow: `0 0 8px ${palette.primary}`,
            display: 'inline-block',
          }}
        />
        <span>{currentScene.title}</span>
        <span style={{ color: palette.secondary, fontWeight: 600 }}>[{currentScene.tag}]</span>
      </div>
    </div>
  );
}
