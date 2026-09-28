import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Deterministic pseudo-random generator to ensure stable visual results
const seededValue = (index: number, channel: number) => {
  const value = Math.sin(index * 12.9898 + channel * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

// ─── Glowing Texture Helper ───────────────────────────────────────────────────
function createGlowTexture(color1 = 'rgba(255, 255, 255, 1)', color2 = 'rgba(100, 255, 218, 0.8)', color3 = 'rgba(10, 25, 47, 0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, color1);
    grad.addColorStop(0.25, color2);
    grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.2)');
    grad.addColorStop(1, color3);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ─── Neural Constellation (Nodes + Dynamic Connecting Synaptic Lines) ─────────
function NeuralConstellation({ count = 90, speedMultiplier = 1.0 }: { count?: number; speedMultiplier?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport, mouse } = useThree();

  // Maximum possible line connections between nearby nodes
  const maxConnections = 300;
  const connectionDistance = 2.4;

  const [positions, velocities, depths, , linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const dep = new Float32Array(count);
    const linePos = new Float32Array(maxConnections * 2 * 3);
    const lineCols = new Float32Array(maxConnections * 2 * 3);

    for (let i = 0; i < count; i++) {
      const x = (seededValue(i, 0) - 0.5) * 18;
      const y = (seededValue(i, 1) - 0.5) * 16;
      const z = (seededValue(i, 2) - 0.5) * 6;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      vel[i * 3] = (seededValue(i, 3) - 0.5) * 0.007;
      vel[i * 3 + 1] = (seededValue(i, 4) - 0.5) * 0.007;
      vel[i * 3 + 2] = (seededValue(i, 5) - 0.5) * 0.003;

      dep[i] = seededValue(i, 6) * 0.7 + 0.3;
    }
    return [pos, vel, dep, basePos, linePos, lineCols];
  }, [count]);

  const scrollRef = useRef({ y: 0, speed: 0 });
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const curY = window.scrollY;
      scrollRef.current.speed = (curY - lastY) * 0.015;
      lastY = curY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pointTexture = useMemo(() => createGlowTexture(), []);

  useFrame((_state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    const geoPoints = pointsRef.current.geometry;
    const posArr = geoPoints.attributes.position.array as Float32Array;

    const geoLines = linesRef.current.geometry;
    const linePosArr = geoLines.attributes.position.array as Float32Array;
    const lineColArr = geoLines.attributes.color.array as Float32Array;

    scrollRef.current.speed *= 0.94;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    const speedFactor = delta * 60 * speedMultiplier;

    // 1. Update nodes positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const depth = depths[i];

      posArr[i3] += velocities[i3] * speedFactor;
      posArr[i3 + 1] += velocities[i3 + 1] * speedFactor;
      posArr[i3 + 2] += velocities[i3 + 2] * speedFactor;

      // Scroll pull
      posArr[i3 + 1] += scrollRef.current.speed * depth * 0.35;

      // Mouse repulsion / magnetic field
      const dx = mouseX - posArr[i3];
      const dy = mouseY - posArr[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0 && dist < 4.0) {
        const force = (4.0 - dist) / 4.0;
        const push = force * 0.012 * depth;
        posArr[i3] -= (dx / dist) * push * speedFactor;
        posArr[i3 + 1] -= (dy / dist) * push * speedFactor;
      }

      // Restorative pull towards boundary
      const boundX = 10;
      const boundY = 9;
      if (posArr[i3] > boundX) posArr[i3] = -boundX;
      else if (posArr[i3] < -boundX) posArr[i3] = boundX;

      if (posArr[i3 + 1] > boundY) posArr[i3 + 1] = -boundY;
      else if (posArr[i3 + 1] < -boundY) posArr[i3 + 1] = boundY;
    }
    geoPoints.attributes.position.needsUpdate = true;

    // 2. Connect nearby nodes with synaptic lines
    let connectionIdx = 0;
    const maxLineVerts = maxConnections * 2;

    for (let i = 0; i < count; i++) {
      if (connectionIdx >= maxLineVerts) break;
      const i3 = i * 3;
      const x1 = posArr[i3];
      const y1 = posArr[i3 + 1];
      const z1 = posArr[i3 + 2];

      for (let j = i + 1; j < count; j++) {
        if (connectionIdx >= maxLineVerts) break;
        const j3 = j * 3;
        const dx = x1 - posArr[j3];
        const dy = y1 - posArr[j3 + 1];
        const dz = z1 - posArr[j3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < connectionDistance * connectionDistance) {
          const dist = Math.sqrt(distSq);
          const alpha = 1.0 - dist / connectionDistance;

          // Vertex A
          linePosArr[connectionIdx * 3] = x1;
          linePosArr[connectionIdx * 3 + 1] = y1;
          linePosArr[connectionIdx * 3 + 2] = z1;

          lineColArr[connectionIdx * 3] = 0.39 * alpha;      // R (cyan/purple mix)
          lineColArr[connectionIdx * 3 + 1] = 1.0 * alpha;   // G (#64ffda)
          lineColArr[connectionIdx * 3 + 2] = 0.85 * alpha;  // B

          // Vertex B
          linePosArr[(connectionIdx + 1) * 3] = posArr[j3];
          linePosArr[(connectionIdx + 1) * 3 + 1] = posArr[j3 + 1];
          linePosArr[(connectionIdx + 1) * 3 + 2] = posArr[j3 + 2];

          lineColArr[(connectionIdx + 1) * 3] = 0.55 * alpha;     // R (violet shift)
          lineColArr[(connectionIdx + 1) * 3 + 1] = 0.75 * alpha; // G
          lineColArr[(connectionIdx + 1) * 3 + 2] = 1.0 * alpha;  // B

          connectionIdx += 2;
        }
      }
    }

    geoLines.setDrawRange(0, connectionIdx);
    geoLines.attributes.position.needsUpdate = true;
    geoLines.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={pointTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// ─── 3D AI Neural Core (Wireframe Polyhedron Floating in Hero Zone) ───────────
function AINeuralCore() {
  const outerGroup = useRef<THREE.Group>(null);
  const innerMesh = useRef<THREE.Mesh>(null);
  const ringMesh = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state, _delta) => {
    const t = state.clock.getElapsedTime();

    if (outerGroup.current) {
      // Smooth float and cursor tracking
      outerGroup.current.rotation.y = t * 0.18;
      outerGroup.current.rotation.x = Math.sin(t * 0.12) * 0.2 + mouse.y * 0.2;
      outerGroup.current.rotation.z = Math.cos(t * 0.1) * 0.15 + mouse.x * 0.2;
      outerGroup.current.position.y = 1.2 + Math.sin(t * 0.6) * 0.25;
    }

    if (innerMesh.current) {
      innerMesh.current.rotation.y = -t * 0.35;
      innerMesh.current.rotation.x = t * 0.25;
    }

    if (ringMesh.current) {
      ringMesh.current.rotation.z = t * 0.2;
      ringMesh.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group ref={outerGroup} position={[4.2, 1.2, -2.5]}>
      {/* Outer Icosahedron Wireframe */}
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#64ffda"
          wireframe
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Octahedron Core with Violet Accent */}
      <mesh ref={innerMesh}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshBasicMaterial
          color="#a78bfa"
          wireframe
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Equatorial Cyber Ring */}
      <mesh ref={ringMesh}>
        <torusGeometry args={[1.9, 0.02, 16, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── Ambient Aurora Nebula Orbs ───────────────────────────────────────────────
function GlowingAuroraOrbs() {
  const group = useRef<THREE.Group>(null);

  const orbs = useMemo(() => [
    { pos: new THREE.Vector3(-5, 3, -7), size: 10, color: '#00f0ff', speed: 0.15 },
    { pos: new THREE.Vector3(6, -2, -8), size: 12, color: '#8b5cf6', speed: 0.18 },
    { pos: new THREE.Vector3(0, -4, -6), size: 9, color: '#10b981', speed: 0.12 },
    { pos: new THREE.Vector3(-4, -2, -7.5), size: 8, color: '#3b82f6', speed: 0.14 },
  ], []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();

    group.current.children.forEach((mesh, i) => {
      const orb = orbs[i];
      mesh.position.x = orb.pos.x + Math.sin(t * orb.speed + i) * 1.5;
      mesh.position.y = orb.pos.y + Math.cos(t * orb.speed * 0.9 + i) * 1.2;
      const s = orb.size + Math.sin(t * 0.4 + i) * 0.6;
      mesh.scale.set(s, s, 1);
    });
  });

  return (
    <group ref={group}>
      {orbs.map((orb, idx) => (
        <mesh key={idx} position={orb.pos}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.055}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main Moving Background Component ─────────────────────────────────────────
export default function ThreeBackground() {
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  const [bgMode, setBgMode] = useState<'neural' | 'calm'>('neural');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const particleCount = reduceMotion ? 25 : bgMode === 'calm' ? 50 : 100;
  const speed = bgMode === 'calm' ? 0.5 : 1.0;

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
        backgroundColor: 'var(--bg-base)',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        {!reduceMotion && <GlowingAuroraOrbs />}
        {!reduceMotion && <AINeuralCore />}
        <NeuralConstellation count={particleCount} speedMultiplier={speed} />
      </Canvas>

      {/* Cybernetic Radial Vignette & Grid Depth Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 90% 70% at 50% 30%, transparent 20%, var(--bg-base) 85%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Background HUD Status Pill (Non-intrusive interactive indicator) */}
      <div
        style={{
          position: 'fixed',
          bottom: '18px',
          left: '20px',
          zIndex: 10,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(10, 25, 47, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          borderRadius: '20px',
          padding: '5px 12px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s ease',
        }}
        className="bg-hud-badge"
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: bgMode === 'neural' ? 'var(--accent)' : '#a78bfa',
            boxShadow: `0 0 8px ${bgMode === 'neural' ? 'var(--accent)' : '#a78bfa'}`,
            display: 'inline-block',
          }}
        />
        <span>AI Neural Mesh</span>
        <button
          type="button"
          onClick={() => setBgMode(prev => prev === 'neural' ? 'calm' : 'neural')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            padding: '0 2px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            textDecoration: 'underline',
          }}
          title="Toggle animation intensity"
        >
          [{bgMode === 'neural' ? 'Dynamic' : 'Calm'}]
        </button>
      </div>
    </div>
  );
}
