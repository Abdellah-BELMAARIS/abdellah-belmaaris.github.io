import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RetroArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARCADE_GAMES = [
  { id: 'space-invaders', name: 'Space Invaders 3D', genre: 'Retro Shooter', wasmSize: '2.4 MB', fps: '60 FPS' },
  { id: 'cyber-snake', name: 'Retro Cyber Snake', genre: 'Classic Arcade', wasmSize: '1.8 MB', fps: '60 FPS' },
  { id: 'quantum-pong', name: 'Quantum Pong', genre: 'Physics Sports', wasmSize: '1.6 MB', fps: '60 FPS' },
  { id: 'flappy-python', name: 'Flappy Python WASM', genre: 'Precision Runner', wasmSize: '1.9 MB', fps: '60 FPS' },
  { id: 'asteroids-zero', name: 'Asteroids Zero', genre: 'Vector Space', wasmSize: '2.1 MB', fps: '60 FPS' },
  { id: 'neon-pacmaze', name: 'Neon Pac-Maze', genre: 'Maze Runner', wasmSize: '2.6 MB', fps: '60 FPS' },
  { id: 'galactic-defender', name: 'Galactic Defender', genre: 'Side-Scroller', wasmSize: '2.8 MB', fps: '60 FPS' },
  { id: 'brick-breaker', name: 'Neon Brick Breaker', genre: 'Paddle Classic', wasmSize: '1.7 MB', fps: '60 FPS' },
  { id: '2048-pixel', name: '2048 Pixel Edition', genre: 'Puzzle Matrix', wasmSize: '1.5 MB', fps: '60 FPS' },
  { id: 'tetris-retro', name: 'Tetris 8-Bit', genre: 'Falling Blocks', wasmSize: '2.0 MB', fps: '60 FPS' },
  { id: 'cyber-racer', name: 'Cyber Racer 8-Bit', genre: 'Retro Driving', wasmSize: '3.1 MB', fps: '60 FPS' },
  { id: 'lunar-lander', name: 'Lunar Lander WASM', genre: 'Gravity Physics', wasmSize: '1.8 MB', fps: '60 FPS' },
  { id: 'frogger-wasm', name: 'Cyber Frogger', genre: 'Grid Navigation', wasmSize: '2.2 MB', fps: '60 FPS' },
  { id: 'maze-runner', name: 'WASM Dungeon Maze', genre: 'Adventure RPG', wasmSize: '2.5 MB', fps: '60 FPS' },
  { id: 'minesweeper-cyber', name: 'Cyber Sweeper', genre: 'Logic Matrix', wasmSize: '1.4 MB', fps: '60 FPS' },
  { id: 'battle-tank', name: 'Battle Tank 1990', genre: 'Top-Down Combat', wasmSize: '2.7 MB', fps: '60 FPS' }
];

export default function RetroArcadeConsoleModal({ isOpen, onClose }: RetroArcadeModalProps) {
  const [selectedGame, setSelectedGame] = useState(ARCADE_GAMES[0]);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play retro 8-bit sound using Web Audio API (zero audio files needed, static safe!)
  const playRetroBeep = (freq = 440, type: OscillatorType = 'square', duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Interactive Mini Retro Starfield / Simulation Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 640);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);

    // Stars & invaders simulation
    const stars: { x: number; y: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 2.5,
        size: Math.random() * 2
      });
    }

    let shipX = width / 2;
    let invaderRow: { x: number; y: number; alive: boolean }[] = [];
    for (let c = 0; c < 8; c++) {
      invaderRow.push({ x: 40 + c * (width / 9), y: 60, alive: true });
    }

    let invaderDir = 1;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#050B14';
      ctx.fillRect(0, 0, width, height);

      // Starfield
      ctx.fillStyle = '#00E5FF';
      for (const s of stars) {
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      // Draw Invaders
      invaderRow.forEach((inv, i) => {
        if (!inv.alive) return;
        inv.x += invaderDir * 0.8;
        ctx.fillStyle = i % 2 === 0 ? '#00E5FF' : '#C084FC';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;

        // Pixel invader sprite
        ctx.fillRect(inv.x - 10, inv.y - 6, 20, 12);
        ctx.fillRect(inv.x - 14, inv.y - 2, 28, 6);
        ctx.fillStyle = '#050B14';
        ctx.fillRect(inv.x - 6, inv.y - 2, 3, 3);
        ctx.fillRect(inv.x + 3, inv.y - 2, 3, 3);
      });

      if (invaderRow.some((inv) => inv.x > width - 30)) invaderDir = -1;
      if (invaderRow.some((inv) => inv.x < 30)) invaderDir = 1;

      // Draw Player Ship
      shipX += Math.sin(frame * 0.04) * 2;
      ctx.fillStyle = '#10B981';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(shipX, height - 35);
      ctx.lineTo(shipX - 16, height - 15);
      ctx.lineTo(shipX + 16, height - 15);
      ctx.closePath();
      ctx.fill();

      // Laser shot
      if (frame % 30 < 10) {
        ctx.fillStyle = '#00E5FF';
        ctx.fillRect(shipX - 2, height - 55 - (frame % 30) * 8, 4, 12);
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen, selectedGame]);

  const handleSelectGame = (game: typeof ARCADE_GAMES[0]) => {
    setSelectedGame(game);
    playRetroBeep(520, 'square', 0.07);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="arcade-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="arcade-cabinet-container"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arcade Cabinet Marquee Header */}
            <div className="arcade-marquee-header">
              <div className="marquee-left">
                <span className="marquee-indicator-dot" />
                <span className="marquee-title">ABDELLAH BELMAARIS // 16 PYGAME WASM CLASSICS</span>
              </div>

              <div className="marquee-actions">
                <button
                  className={`arcade-toggle-btn ${crtEnabled ? 'active' : ''}`}
                  onClick={() => {
                    setCrtEnabled(!crtEnabled);
                    playRetroBeep(440, 'triangle', 0.05);
                  }}
                  title="Toggle CRT Scanline Simulation"
                >
                  <i className="fa-solid fa-tv" /> CRT {crtEnabled ? 'ON' : 'OFF'}
                </button>

                <button
                  className={`arcade-toggle-btn ${soundEnabled ? 'active' : ''}`}
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    playRetroBeep(660, 'sine', 0.06);
                  }}
                  title="Toggle 8-bit Sound Effects"
                >
                  <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`} />
                </button>

                <button className="arcade-close-btn" onClick={onClose} aria-label="Close arcade cabinet">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            {/* Cabinet Body: Screen & Game Selector */}
            <div className="arcade-cabinet-body">
              {/* Screen Area */}
              <div className={`arcade-screen-viewport ${crtEnabled ? 'crt-scanlines' : ''}`}>
                <div className="screen-header-hud">
                  <span className="screen-hud-badge">TITLE: {selectedGame.name}</span>
                  <span className="screen-hud-badge">GENRE: {selectedGame.genre}</span>
                  <span className="screen-hud-badge">RUNTIME: WEBASSEMBLY (PYGBAG)</span>
                </div>

                <canvas ref={canvasRef} className="arcade-canvas" />

                {/* CRT Glass Reflection Glint */}
                <div className="crt-glass-glint" />

                {/* Overlay Screen Footer */}
                <div className="screen-footer-hud">
                  <span className="hud-metric"><i className="fa-solid fa-bolt" /> {selectedGame.fps}</span>
                  <span className="hud-metric"><i className="fa-solid fa-file-code" /> {selectedGame.wasmSize}</span>
                  <span className="hud-metric"><i className="fa-solid fa-circle-check" /> Zero-Install Browser WASM</span>
                </div>
              </div>

              {/* Game Selector Cartridge Drawer */}
              <div className="arcade-cartridge-drawer">
                <div className="drawer-header">
                  <span className="drawer-kicker">CARTRIDGE SELECTOR</span>
                  <span className="drawer-count">16 / 16 LOADED</span>
                </div>

                <div className="cartridge-list-scroll">
                  {ARCADE_GAMES.map((game, i) => (
                    <button
                      key={game.id}
                      className={`cartridge-item-btn ${selectedGame.id === game.id ? 'active' : ''}`}
                      onClick={() => handleSelectGame(game)}
                    >
                      <span className="cartridge-index">0{i + 1}</span>
                      <div className="cartridge-meta">
                        <span className="cartridge-name">{game.name}</span>
                        <span className="cartridge-genre">{game.genre}</span>
                      </div>
                      <span className="cartridge-play-icon">▶</span>
                    </button>
                  ))}
                </div>

                {/* Direct Launch Full PyGame WASM Web App on GitHub Pages */}
                <div className="arcade-launch-footer">
                  <a
                    href="https://abdellah-belmaaris.github.io/PyGame_Projects/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-launch-btn"
                    onClick={() => playRetroBeep(880, 'square', 0.12)}
                  >
                    <i className="fa-solid fa-gamepad" />
                    <span>LAUNCH FULL 16-GAME ARCADE ↗</span>
                  </a>
                  <a
                    href="https://github.com/Abdellah-BELMAARIS/PyGame_Projects"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '10.5px',
                      color: '#94a3b8',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <i className="fa-brands fa-github" style={{ marginRight: '5px' }} />
                    View Open Source Python Repository ↗
                  </a>
                  <span className="launch-note">16 Python Classics in WebAssembly · Locked 60 FPS WebGL</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
