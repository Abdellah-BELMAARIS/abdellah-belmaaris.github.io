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
    gridOpacity: 0.16,
    lineOpacity: 0.24,
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
    gridOpacity: 0.16,
    lineOpacity: 0.24,
    useAdditive: true,
  },
  light: {
    primary: '#00768a',
    secondary: '#0284c7',
    grid: '#0369a1',
    glass: '#bae6fd',
    node: '#0f766e',
    wireOpacity: 0.28,
    slabOpacity: 0.08,
    gridOpacity: 0.14,
    lineOpacity: 0.18,
    useAdditive: false,
  },
};

// ─── 1. 3D Architectural BIM / IFC Wireframe Tower + Structural Blueprint Grid ─
function BimArchitecturalTwin({
  isMobile,
  palette,
}: {
  isMobile: boolean;
  palette: ThemePalette;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const towerRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  const blending = palette.useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

  // Build structural IFC tower geometry: floor slabs, perimeter columns, podium & blueprint grid
  const {
    slabConfigs,
    columnPositions,
    ifcNodePositions,
    blueprintGridPositions,
  } = useMemo(() => {
    const slabs = [
      { y: -1.45, w: 2.35, d: 1.85, h: 0.08 }, // Podium / Ground Slab
      { y: -1.0,  w: 1.9,  d: 1.5,  h: 0.06 }, // Level 01
      { y: -0.55, w: 1.9,  d: 1.5,  h: 0.06 }, // Level 02
      { y: -0.1,  w: 1.7,  d: 1.38, h: 0.06 }, // Level 03 (Setback)
      { y:  0.35, w: 1.7,  d: 1.38, h: 0.06 }, // Level 04
      { y:  0.8,  w: 1.48, d: 1.22, h: 0.06 }, // Level 05 (Cantilever Terrace)
      { y:  1.25, w: 1.22, d: 1.05, h: 0.07 }, // Roof Deck
    ];

    const cols: [number, number, number, number][] = [
      // [x, z, height, yCenter]
      [-0.86, -0.68, 2.7, -0.1],
      [ 0.86, -0.68, 2.7, -0.1],
      [-0.86,  0.68, 2.7, -0.1],
      [ 0.86,  0.68, 2.7, -0.1],
      [ 0.0,  -0.68, 2.25, -0.32],
      [ 0.0,   0.68, 2.25, -0.32],
      [-0.68,  0.0,  2.7, -0.1],
      [ 0.68,  0.0,  2.7, -0.1],
    ];

    // IFC Structural Joint Nodes at slab corners
    const nodes: number[] = [];
    slabs.forEach((s) => {
      const hw = s.w / 2;
      const hd = s.d / 2;
      nodes.push(
        -hw, s.y, -hd,
         hw, s.y, -hd,
         hw, s.y,  hd,
        -hw, s.y,  hd
      );
    });

    // Architectural Blueprint Site Grid below podium
    const gridLines: number[] = [];
    const size = 3.2;
    const step = 0.4;
    const gridY = -1.56;
    for (let x = -size; x <= size + 0.001; x += step) {
      gridLines.push(x, gridY, -size, x, gridY, size);
    }
    for (let z = -size; z <= size + 0.001; z += step) {
      gridLines.push(-size, gridY, z, size, gridY, z);
    }

    return {
      slabConfigs: slabs,
      columnPositions: cols,
      ifcNodePositions: new Float32Array(nodes),
      blueprintGridPositions: new Float32Array(gridLines),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      const targetX = mouse.x * 0.4;
      const targetY = mouse.y * 0.28;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        (isMobile ? 0 : 2.95) + targetX,
        0.03
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        (isMobile ? 1.25 : 0.05) + targetY,
        0.03
      );
    }

    if (towerRef.current) {
      towerRef.current.rotation.y = t * 0.14 + 0.55;
      towerRef.current.rotation.x = 0.24 + Math.sin(t * 0.35) * 0.03;
    }

    // Vertical BIM Elevation Scanner Ring sweeping the IFC building
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(t * 0.7) * 1.35;
      scanRingRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[isMobile ? 0 : 2.95, isMobile ? 1.25 : 0.05, -2.1]}
      scale={isMobile ? 0.76 : 1.0}
    >
      <group ref={towerRef}>
        {/* Architectural Blueprint Coordinate Grid */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[blueprintGridPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={palette.grid}
            transparent
            opacity={palette.gridOpacity}
            blending={blending}
            depthWrite={false}
          />
        </lineSegments>

        {/* Multi-Storey IFC Floor Slabs (Translucent Glass + Crisp Structural Edges) */}
        {slabConfigs.map((s, idx) => (
          <group key={idx} position={[0, s.y, 0]}>
            <mesh>
              <boxGeometry args={[s.w, s.h, s.d]} />
              <meshBasicMaterial
                color={palette.glass}
                transparent
                opacity={palette.slabOpacity}
                blending={blending}
                depthWrite={false}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(s.w, s.h, s.d)]} />
              <lineBasicMaterial
                color={idx % 2 === 0 ? palette.primary : palette.secondary}
                transparent
                opacity={palette.wireOpacity}
                blending={blending}
                depthWrite={false}
              />
            </lineSegments>
          </group>
        ))}

        {/* Structural Perimeter Columns */}
        {columnPositions.map(([x, z, h, yCenter], idx) => (
          <mesh key={`col-${idx}`} position={[x, yCenter, z]}>
            <boxGeometry args={[0.045, h, 0.045]} />
            <meshBasicMaterial
              color={palette.primary}
              transparent
              opacity={palette.wireOpacity * 0.85}
              blending={blending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Central Elevator / MEP Core Shaft */}
        <group position={[0, 0.05, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.56, 3.0, 0.56)]} />
            <lineBasicMaterial
              color={palette.secondary}
              transparent
              opacity={palette.wireOpacity * 1.15}
              blending={blending}
              depthWrite={false}
            />
          </lineSegments>
        </group>

        {/* Rooftop Crown / Mechanical Penthouse Wireframe */}
        <group position={[0, 1.48, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.74, 0.36, 0.62)]} />
            <lineBasicMaterial
              color={palette.primary}
              transparent
              opacity={palette.wireOpacity}
              blending={blending}
              depthWrite={false}
            />
          </lineSegments>
        </group>

        {/* Glowing IFC Structural Node Vertices */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[ifcNodePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.075}
            color={palette.node}
            transparent
            opacity={0.8}
            blending={blending}
            depthWrite={false}
          />
        </points>

        {/* Active Elevation Section Plane / Scanner Ring */}
        <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 1.5, 48]} />
          <meshBasicMaterial
            color={palette.primary}
            side={THREE.DoubleSide}
            transparent
            opacity={0.28}
            blending={blending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── 2. Subtle Architectural BIM Spatial Mesh (Connected Nodes) ──────────────
function BimSpatialNetwork({
  count = 42,
  palette,
}: {
  count?: number;
  palette: ThemePalette;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();
  const blending = palette.useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending;

  const [positions, velocities, linePos] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const maxLines = 95;
    const lPos = new Float32Array(maxLines * 2 * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = Math.sin(i * 91.23) * 0.5 * 20;
      pos[i * 3 + 1] = Math.cos(i * 47.81) * 0.5 * 14;
      pos[i * 3 + 2] = Math.sin(i * 13.57) * 0.5 * 7 - 3.5;

      vel[i * 3] = (Math.sin(i * 5.31) - 0.5) * 0.0025;
      vel[i * 3 + 1] = (Math.cos(i * 7.19) - 0.5) * 0.0025;
      vel[i * 3 + 2] = 0;
    }
    return [pos, vel, lPos];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const lPosArr = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];

      if (posArr[i * 3] > 11) posArr[i * 3] = -11;
      if (posArr[i * 3] < -11) posArr[i * 3] = 11;
      if (posArr[i * 3 + 1] > 7.5) posArr[i * 3 + 1] = -7.5;
      if (posArr[i * 3 + 1] < -7.5) posArr[i * 3 + 1] = 7.5;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    let lineIdx = 0;
    const maxLines = 95;
    const thresholdSq = 3.1 * 3.1;

    for (let i = 0; i < count && lineIdx < maxLines; i++) {
      for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < thresholdSq) {
          const offset = lineIdx * 6;
          lPosArr[offset] = posArr[i * 3];
          lPosArr[offset + 1] = posArr[i * 3 + 1];
          lPosArr[offset + 2] = posArr[i * 3 + 2];
          lPosArr[offset + 3] = posArr[j * 3];
          lPosArr[offset + 4] = posArr[j * 3 + 1];
          lPosArr[offset + 5] = posArr[j * 3 + 2];
          lineIdx++;
        }
      }
    }

    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, mouse.x * 0.04, 0.02);
    linesRef.current.rotation.y = pointsRef.current.rotation.y;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color={palette.node}
          transparent
          opacity={palette.useAdditive ? 0.55 : 0.4}
          blending={blending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.primary}
          transparent
          opacity={palette.lineOpacity}
          blending={blending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ─── 3. Main Component with Multi-Theme OpenBIM 3D Telemetry Tag ────────────
export default function ThreeBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<PortfolioTheme>(() => {
    if (typeof document === 'undefined') return 'dark';
    const t = document.documentElement.getAttribute('data-theme');
    return t === 'light' || t === 'violet' ? t : 'dark';
  });
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', listener);

    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme');
      setTheme(t === 'light' || t === 'violet' ? t : 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('resize', checkMobile);
      media.removeEventListener('change', listener);
      observer.disconnect();
    };
  }, []);

  const palette = THEME_PALETTES[theme];
  const particleCount = reduceMotion ? 10 : isMobile ? 18 : 42;

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
        camera={{ position: [0, 0, 5.2], fov: 56 }}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.45} />
        {!reduceMotion && <BimArchitecturalTwin isMobile={isMobile} palette={palette} />}
        {!reduceMotion && <BimSpatialNetwork count={particleCount} palette={palette} />}
      </Canvas>

      {/* Subtle Architectural Blueprint Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, var(--border-subtle, rgba(255,255,255,0.03)) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle, rgba(255,255,255,0.03)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: theme === 'light' ? 0.35 : 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Cinematic Radial Depth Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--scene-vignette)',
          pointerEvents: 'none',
        }}
      />

      {/* OpenBIM 3D Engine Live Telemetry Pill */}
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
          borderRadius: '999px',
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
        title="Real-time WebGL 3D Architectural OpenBIM / IFC Twin"
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: palette.primary,
            boxShadow: `0 0 8px ${palette.primary}`,
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }}
        />
        <span>OpenBIM 3D Twin</span>
        <span style={{ color: palette.secondary, fontWeight: 600 }}>[IFC · WebGL]</span>
      </div>
    </div>
  );
}
