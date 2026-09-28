import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Subtle Architectural BIM & IFC Wireframe Geometry ───────────────────────
// Represents IFC structural grids, building axes, and engineering perspective
function ArchitecturalBimGrid() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Procedurally generate architectural structural columns and floor planes
  const { gridLines, nodePositions } = useMemo(() => {
    const lines: number[] = [];
    const nodes: number[] = [];

    // Floor perspective grid lines (subtle ground plane)
    const gridSize = 12;
    const step = 2.0;
    const yFloor = -3.2;

    for (let x = -gridSize; x <= gridSize; x += step) {
      lines.push(x, yFloor, -gridSize);
      lines.push(x, yFloor, gridSize);
    }
    for (let z = -gridSize; z <= gridSize; z += step) {
      lines.push(-gridSize, yFloor, z);
      lines.push(gridSize, yFloor, z);
    }

    // Structural columns (vertical BIM wireframe members)
    const columns = [
      [3.0, -1.0], [5.5, -3.0], [7.0, 1.0], [4.5, 3.5],
      [-5.0, 1.5], [-7.5, -2.0], [1.5, -4.5], [-3.5, -3.5]
    ];

    columns.forEach(([cx, cz]) => {
      lines.push(cx, -3.2, cz);
      lines.push(cx, 3.8, cz);

      // Node joints at floor and ceiling levels
      nodes.push(cx, -3.2, cz);
      nodes.push(cx, 3.8, cz);
      nodes.push(cx, 0.3, cz);

      // Horizontal beam connection between adjacent structural columns
      lines.push(cx, 0.3, cz);
      lines.push(cx + 1.2, 0.3, cz - 0.8);
    });

    return {
      gridLines: new Float32Array(lines),
      nodePositions: new Float32Array(nodes),
    };
  }, []);

  useFrame((_state) => {
    if (!groupRef.current) return;
    // Ultra subtle parallax (2 to 6px maximum)
    const targetX = (mouse.x * 0.35);
    const targetY = (mouse.y * 0.25);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
  });

  return (
    <group ref={groupRef} position={[2.5, 0, -4.5]}>
      {/* Structural IFC Beam Wireframe Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[gridLines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#10b981"
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </lineSegments>

      {/* BIM Structural Joint Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#34d399"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─── Restrained Cinematic Particles (Rule 5: 30-50 desktop, 12 mobile) ────────
function RestrainedParticles({ count = 40 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();

  const [positions, velocities, linePos, lineCols] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const maxLines = 80;
    const lPos = new Float32Array(maxLines * 2 * 3);
    const lCol = new Float32Array(maxLines * 2 * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.sin(i * 91.23) * 0.5) * 16;
      pos[i * 3 + 1] = (Math.cos(i * 47.81) * 0.5) * 12;
      pos[i * 3 + 2] = (Math.sin(i * 13.57) * 0.5) * 6 - 2;

      vel[i * 3] = (Math.sin(i * 5.31) - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.cos(i * 7.19) - 0.5) * 0.003;
      vel[i * 3 + 2] = 0;
    }
    return [pos, vel, lPos, lCol];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const lPosArr = linesRef.current.geometry.attributes.position.array as Float32Array;
    const lColArr = linesRef.current.geometry.attributes.color.array as Float32Array;

    // Slow drifting particle update
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];

      // Screen boundary wraps
      if (posArr[i * 3] > 10) posArr[i * 3] = -10;
      if (posArr[i * 3] < -10) posArr[i * 3] = 10;
      if (posArr[i * 3 + 1] > 7) posArr[i * 3 + 1] = -7;
      if (posArr[i * 3 + 1] < -7) posArr[i * 3 + 1] = 7;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Connect close neighbors with faint lines
    let lineIdx = 0;
    const maxLines = 80;
    const connDistSq = 2.8 * 2.8;

    for (let i = 0; i < count && lineIdx < maxLines; i++) {
      for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < connDistSq) {
          const alpha = (1 - Math.sqrt(dSq) / 2.8) * 0.07;
          const p = lineIdx * 6;

          lPosArr[p] = posArr[i * 3];
          lPosArr[p + 1] = posArr[i * 3 + 1];
          lPosArr[p + 2] = posArr[i * 3 + 2];

          lPosArr[p + 3] = posArr[j * 3];
          lPosArr[p + 4] = posArr[j * 3 + 1];
          lPosArr[p + 5] = posArr[j * 3 + 2];

          // Emerald tint
          lColArr[p] = 0.06; lColArr[p + 1] = 0.72; lColArr[p + 2] = 0.50;
          lColArr[p + 3] = 0.06; lColArr[p + 4] = 0.72; lColArr[p + 5] = 0.50;

          // Scale alpha via vertex color
          lColArr[p] *= alpha; lColArr[p + 1] *= alpha; lColArr[p + 2] *= alpha;
          lColArr[p + 3] *= alpha; lColArr[p + 4] *= alpha; lColArr[p + 5] *= alpha;

          lineIdx++;
        }
      }
    }

    // Zero out unused lines
    for (let k = lineIdx * 6; k < maxLines * 6; k++) {
      lPosArr[k] = 0;
      lColArr[k] = 0;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;

    // Ultra soft cursor parallax
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * 0.2, 0.03);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.y * 0.2, 0.03);
    linesRef.current.position.x = pointsRef.current.position.x;
    linesRef.current.position.y = pointsRef.current.position.y;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#10b981"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineCols, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// ─── Cinematic Emerald Volumetric Glow (Rule 4: Opacity 8-15%, duration 18-25s) ───
function CinematicEmeraldGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Ultra slow, calm oscillation: 18-25s period
    const cycle = t * 0.28;
    meshRef.current.position.x = 3.5 + Math.sin(cycle) * 0.8;
    meshRef.current.position.y = 0.5 + Math.cos(cycle * 0.8) * 0.6;
    const pulse = 1.0 + Math.sin(cycle * 0.5) * 0.08;
    meshRef.current.scale.set(pulse * 7.5, pulse * 7.5, 1);
  });

  return (
    <mesh ref={meshRef} position={[3.5, 0.5, -5]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#087F5B"
        transparent
        opacity={0.095}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Main Moving Background Component ─────────────────────────────────────────
export default function ThreeBackground() {
  const [isMobile, setIsMobile] = useState(false);
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

    return () => {
      window.removeEventListener('resize', checkMobile);
      media.removeEventListener('change', listener);
    };
  }, []);

  const particleCount = reduceMotion ? 10 : isMobile ? 14 : 38;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #070B0F 0%, #0B1117 100%)',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        {!reduceMotion && <CinematicEmeraldGlow />}
        {!isMobile && !reduceMotion && <ArchitecturalBimGrid />}
        {!reduceMotion && <RestrainedParticles count={particleCount} />}
      </Canvas>

      {/* Cinematic Radial Depth Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 75% at 50% 35%, transparent 25%, #070B0F 90%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
