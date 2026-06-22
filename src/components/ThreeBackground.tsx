import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// A single particle component group
function Particles({ count = 100 }) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport, mouse } = useThree();

  // Create random positions and velocities
  const [positions, velocities, depths, basePositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const dep = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position spread
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      // Base velocity (very slow floating)
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      // Parallax depth multiplier (between 0.3 and 1.0)
      dep[i] = Math.random() * 0.7 + 0.3;
    }
    return [pos, vel, dep, basePos];
  }, [count]);

  // Track window scroll
  const scrollRef = useRef({ y: 0, speed: 0 });
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const curY = window.scrollY;
      scrollRef.current.speed = (curY - lastY) * 0.02;
      lastY = curY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    const geo = mesh.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;

    // Decay scroll speed
    scrollRef.current.speed *= 0.95;

    // Magnetic mouse settings (pointer in R3F is in range [-1, 1])
    // Convert R3F normalized pointer to viewport units
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const depth = depths[i];

      // 1. Move based on base velocity (zero-gravity drift)
      posArr[i3] += velocities[i3] * (delta * 60);
      posArr[i3 + 1] += velocities[i3 + 1] * (delta * 60);
      posArr[i3 + 2] += velocities[i3 + 2] * (delta * 60);

      // 2. React to scroll (pull particles vertically)
      posArr[i3 + 1] += scrollRef.current.speed * depth * 0.4;

      // 3. Magnetic pull towards mouse cursor
      const dx = mouseX - posArr[i3];
      const dy = mouseY - posArr[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3.5) {
        const force = (3.5 - dist) / 3.5;
        const pull = force * 0.008 * depth;
        // Slowly apply acceleration towards mouse
        posArr[i3] += (dx / dist) * pull * (delta * 60);
        posArr[i3 + 1] += (dy / dist) * pull * (delta * 60);
      }

      // Friction pull towards base position limits
      const baseDistX = posArr[i3] - basePositions[i3];
      const baseDistY = posArr[i3 + 1] - basePositions[i3 + 1];
      if (Math.abs(baseDistX) > 8) posArr[i3] = basePositions[i3] - Math.sign(baseDistX) * 8;
      if (Math.abs(baseDistY) > 8) posArr[i3 + 1] = basePositions[i3 + 1] - Math.sign(baseDistY) * 8;
    }

    geo.attributes.position.needsUpdate = true;
  });

  // Create circular texture for particles so they are nice glowing dots rather than squares
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw radial gradient
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(100, 255, 218, 0.8)');
      grad.addColorStop(1, 'rgba(10, 25, 47, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Sleek large glowing blobs that drift in the background
function GlowingBlobs() {
  const group = useRef<THREE.Group>(null);

  const blobs = useMemo(() => {
    return Array.from({ length: 3 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        -6
      ),
      scale: Math.random() * 3 + 2,
      velocity: new THREE.Vector2(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002
      ),
      color: Math.random() > 0.5 ? '#64ffda' : '#00b4d8',
    }));
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.children.forEach((mesh, i) => {
      const blob = blobs[i];
      mesh.position.x += blob.velocity.x * (delta * 60);
      mesh.position.y += blob.velocity.y * (delta * 60);

      // Bounds check
      if (Math.abs(mesh.position.x) > 10) blob.velocity.x *= -1;
      if (Math.abs(mesh.position.y) > 10) blob.velocity.y *= -1;
    });
  });

  return (
    <group ref={group}>
      {blobs.map((blob, idx) => (
        <mesh key={idx} position={blob.position}>
          <planeGeometry args={[blob.scale, blob.scale]} />
          <meshBasicMaterial
            color={blob.color}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main background component
export default function ThreeBackground() {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);

    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

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
        backgroundColor: '#0a192f',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <ambientLight intensity={0.5} />
        {!reduceMotion && <GlowingBlobs />}
        <Particles count={reduceMotion ? 15 : 100} />
      </Canvas>
    </div>
  );
}
