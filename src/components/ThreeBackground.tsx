import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── 1. 3D AI Geometric Core with Inner Cube & Dual Orbital Rings ─────────────
// Recreated from the user's reference design: a rotating wireframe geodesic core,
// inner geometric tesseract/cube, and dual tilted elliptical orbital rings.
function AiGeometricCore({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerCubeRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Generate unique vertex positions for glowing nodes on the geodesic sphere
  const sphereVertexPositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 1);
    const pos = geo.attributes.position.array;
    return new Float32Array(pos);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Subtle smooth parallax following cursor
      const targetX = (mouse.x * 0.45);
      const targetY = (mouse.y * 0.35);
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        (isMobile ? 0 : 3.2) + targetX,
        0.03
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        (isMobile ? 1.6 : 0.3) + targetY,
        0.03
      );
    }

    // Outer Geodesic Sphere slow rotation
    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.x = t * 0.07;
      outerSphereRef.current.rotation.y = t * 0.11;
    }

    // Inner Cube counter-rotation
    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.x = -t * 0.15;
      innerCubeRef.current.rotation.y = t * 0.18;
      innerCubeRef.current.rotation.z = t * 0.09;
    }

    // Orbital Ring 1 rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.12;
    }

    // Orbital Ring 2 opposite rotation
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.14;
    }

    // Orbiting Satellite data packet
    if (satelliteRef.current) {
      satelliteRef.current.rotation.z = t * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 3.2, isMobile ? 1.6 : 0.3, -1.8]}>
      {/* Outer Wireframe Geodesic Polyhedron Sphere */}
      <mesh ref={outerSphereRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Vertex Nodes on Geodesic Mesh */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sphereVertexPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#38bdf8"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Inner Geometric Wireframe Cube / Core */}
      <mesh ref={innerCubeRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner Core Vertex Glow Points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -0.45, -0.45, -0.45,  0.45, -0.45, -0.45,
                 0.45,  0.45, -0.45, -0.45,  0.45, -0.45,
                -0.45, -0.45,  0.45,  0.45, -0.45,  0.45,
                 0.45,  0.45,  0.45, -0.45,  0.45,  0.45,
              ]),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#10b981"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Primary Tilted Elliptical Orbital Ring (Cyan) */}
      <mesh ref={ring1Ref} rotation={[1.15, 0.35, 0]}>
        <torusGeometry args={[2.25, 0.014, 16, 120]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary Tilted Elliptical Orbital Ring (Emerald) */}
      <mesh ref={ring2Ref} rotation={[-0.85, 0.65, 0.4]}>
        <torusGeometry args={[2.45, 0.011, 16, 120]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting Satellite Data Packet on Ring 1 */}
      <group ref={satelliteRef} rotation={[1.15, 0.35, 0]}>
        <mesh position={[2.25, 0, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Ambient Core Glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial
          color="#087f5b"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── 2. Floating Holographic Backdrop Panels ─────────────────────────────────
// Translucent glowing glass panels seen behind the wireframe core in the screenshot
function HolographicPanels({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return null;

  return (
    <group position={[3.2, 0.2, -4.5]}>
      {/* Primary Rectangular Backdrop Card */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[5.2, 3.4]} />
        <meshBasicMaterial
          color="#062438"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5.2, 3.4)]} />
        <lineBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </lineSegments>

      {/* Offset Secondary Backdrop Card */}
      <mesh position={[-1.2, -0.6, -0.5]}>
        <planeGeometry args={[4.4, 2.6]} />
        <meshBasicMaterial
          color="#0a1d30"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <lineSegments position={[-1.2, -0.6, -0.49]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(4.4, 2.6)]} />
        <lineBasicMaterial
          color="#10b981"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ─── 3. Dynamic AI Neural Mesh & Synaptic Network Lines ──────────────────────
// Generates drifting constellation nodes that connect with synaptic neon lines
function AiNeuralMesh({ count = 55 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();

  const [positions, velocities, linePos, lineCols] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const maxLines = 120;
    const lPos = new Float32Array(maxLines * 2 * 3);
    const lCol = new Float32Array(maxLines * 2 * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.sin(i * 91.23) * 0.5) * 20;
      pos[i * 3 + 1] = (Math.cos(i * 47.81) * 0.5) * 14;
      pos[i * 3 + 2] = (Math.sin(i * 13.57) * 0.5) * 8 - 3;

      vel[i * 3] = (Math.sin(i * 5.31) - 0.5) * 0.0035;
      vel[i * 3 + 1] = (Math.cos(i * 7.19) - 0.5) * 0.0035;
      vel[i * 3 + 2] = 0;
    }
    return [pos, vel, lPos, lCol];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const lPosArr = linesRef.current.geometry.attributes.position.array as Float32Array;
    const lColArr = linesRef.current.geometry.attributes.color.array as Float32Array;

    // Update drifting positions
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];

      // Screen boundary wrapping
      if (posArr[i * 3] > 12) posArr[i * 3] = -12;
      if (posArr[i * 3] < -12) posArr[i * 3] = 12;
      if (posArr[i * 3 + 1] > 8) posArr[i * 3 + 1] = -8;
      if (posArr[i * 3 + 1] < -8) posArr[i * 3 + 1] = 8;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Connect close neighbors with synaptic lines
    let lineIdx = 0;
    const maxLines = 120;
    const thresholdSq = 3.2 * 3.2;

    for (let i = 0; i < count && lineIdx < maxLines; i++) {
      for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < thresholdSq) {
          const alpha = (1 - Math.sqrt(dSq) / 3.2) * 0.12;
          const p = lineIdx * 6;

          lPosArr[p] = posArr[i * 3];
          lPosArr[p + 1] = posArr[i * 3 + 1];
          lPosArr[p + 2] = posArr[i * 3 + 2];

          lPosArr[p + 3] = posArr[j * 3];
          lPosArr[p + 4] = posArr[j * 3 + 1];
          lPosArr[p + 5] = posArr[j * 3 + 2];

          // Dynamic Cyan to Emerald gradient
          const isCyan = (i + j) % 2 === 0;
          const r = isCyan ? 0.0 : 0.06;
          const g = isCyan ? 0.9 : 0.72;
          const b = isCyan ? 1.0 : 0.5;

          lColArr[p] = r * alpha;
          lColArr[p + 1] = g * alpha;
          lColArr[p + 2] = b * alpha;

          lColArr[p + 3] = r * alpha;
          lColArr[p + 4] = g * alpha;
          lColArr[p + 5] = b * alpha;

          lineIdx++;
        }
      }
    }

    // Zero out unused line segments
    for (let k = lineIdx * 6; k < maxLines * 6; k++) {
      lPosArr[k] = 0;
      lColArr[k] = 0;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;

    // Ultra soft cursor parallax
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * 0.25, 0.03);
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
          size={0.075}
          color="#38bdf8"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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

// ─── 4. Volumetric Cyan-Emerald Atmospheric Glow ──────────────────────────────
function VolumetricAtmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const cycle = t * 0.25;
    meshRef.current.position.x = 3.5 + Math.sin(cycle) * 0.6;
    meshRef.current.position.y = 0.4 + Math.cos(cycle * 0.8) * 0.5;
    const scale = 8.0 + Math.sin(cycle * 0.5) * 0.5;
    meshRef.current.scale.set(scale, scale, 1);
  });

  return (
    <mesh ref={meshRef} position={[3.5, 0.4, -6]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#08384d"
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── 5. Main Component with Live Telemetry Tag ───────────────────────────────
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

  const particleCount = reduceMotion ? 12 : isMobile ? 20 : 50;

  return (
    <div
      id="bg-canvas"
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
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        {!reduceMotion && <VolumetricAtmosphere />}
        {!reduceMotion && <HolographicPanels isMobile={isMobile} />}
        {!reduceMotion && <AiGeometricCore isMobile={isMobile} />}
        {!reduceMotion && <AiNeuralMesh count={particleCount} />}
      </Canvas>

      {/* Cinematic Radial Depth Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--scene-vignette)',
          pointerEvents: 'none',
        }}
      />

      {/* AI Neural Mesh [Dynamic] Live Telemetry Pill (As seen in the screenshot) */}
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
          background: 'var(--telemetry-background)',
          border: '1px solid var(--telemetry-border)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
          fontSize: '0.72rem',
          color: 'var(--telemetry-text)',
          letterSpacing: '0.5px',
          boxShadow: 'var(--telemetry-shadow)',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
        title="Real-time WebGL AI Neural Mesh Simulation"
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--cyan-bright)',
            boxShadow: '0 0 8px var(--cyan-bright)',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }}
        />
        <span>AI Neural Mesh</span>
        <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>[Dynamic]</span>
      </div>
    </div>
  );
}
